import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const area = formData.get('area') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }
    if (!area) {
      return NextResponse.json({ error: 'Parâmetro "area" obrigatório' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use JPG, PNG, WEBP ou GIF' },
        { status: 400 }
      )
    }

    const subdir = join('images', 'areas', area)
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

    const relativePath = `/images/areas/${area}/${fileName}`
    return NextResponse.json({ success: true, path: relativePath })
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}
