import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const SOBRE_PATH = join(process.cwd(), 'data', 'sobre.json')

async function loadSobre() {
  const file = await readFile(SOBRE_PATH, 'utf-8')
  return JSON.parse(file)
}

export async function GET() {
  try {
    const data = await loadSobre()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar sobre.json:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados de sobre' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, section, field, value, index } = body as {
      action?: string
      section?: string
      field?: string
      value?: unknown
      index?: number
    }

    const data = await loadSobre()

    // Array actions for certificados items
    if (action === 'addCertificado') {
      data.certificados.items = data.certificados.items || []
      data.certificados.items.push(value)
      await writeFile(SOBRE_PATH, JSON.stringify(data, null, 2), 'utf-8')
      return NextResponse.json(data)
    }

    if (action === 'removeCertificado') {
      data.certificados.items = data.certificados.items || []
      if (index === undefined || index < 0 || index >= data.certificados.items.length) {
        return NextResponse.json({ error: 'Índice inválido' }, { status: 400 })
      }
      data.certificados.items.splice(index, 1)
      await writeFile(SOBRE_PATH, JSON.stringify(data, null, 2), 'utf-8')
      return NextResponse.json(data)
    }

    if (!section || !field) {
      return NextResponse.json(
        { error: 'Parâmetros "section" e "field" são obrigatórios' },
        { status: 400 }
      )
    }

    if (!data[section]) {
      return NextResponse.json(
        { error: `Seção '${section}' não encontrada em sobre.json` },
        { status: 404 }
      )
    }

    // Navigate dot-notation path within the section (e.g. "cards.historico.title")
    const path = field.split('.')
    let target: any = data[section]

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      if (target[key] === undefined || target[key] === null) {
        target[key] = {}
      }
      target = target[key]
    }

    const lastKey = path[path.length - 1]
    target[lastKey] = value

    await writeFile(SOBRE_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar sobre.json:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar dados de sobre' },
      { status: 500 }
    )
  }
}
