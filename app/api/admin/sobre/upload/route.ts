import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const SECTION_DIRS: Record<string, string> = {
  principal: join('images', 'sobre'),
  historico: join('images', 'sobre'),
  clientes: join('images', 'clientes'),
  certificados: join('images', 'certificados'),
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const section = formData.get('section') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }
    if (!section || !SECTION_DIRS[section]) {
      return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
    }

    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use JPG, PNG, WEBP, GIF ou PDF' },
        { status: 400 }
      )
    }

    const subdir = SECTION_DIRS[section]
    const uploadDir = join(process.cwd(), 'public', subdir)

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const relativePath = `/${subdir.replace(/\\/g, '/')}/${fileName}`
    return NextResponse.json({ success: true, path: relativePath })
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}
