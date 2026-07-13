import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const AREAS_PATH = join(process.cwd(), 'data', 'areas.json')

async function loadAreas() {
  const file = await readFile(AREAS_PATH, 'utf-8')
  return JSON.parse(file)
}

export async function GET() {
  try {
    const data = await loadAreas()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar areas.json:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados de áreas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { area, field, value } = body as {
      area?: string
      field?: string
      value?: unknown
    }

    if (!area || !field) {
      return NextResponse.json(
        { error: 'Parâmetros "area" e "field" são obrigatórios' },
        { status: 400 }
      )
    }

    const data = await loadAreas()

    if (!data[area]) {
      return NextResponse.json(
        { error: `Área '${area}' não encontrada em areas.json` },
        { status: 404 }
      )
    }

    // Navegar até o campo solicitado (ex: "aplicacao.description")
    const path = field.split('.')
    let target: any = data[area]

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      if (target[key] === undefined || target[key] === null) {
        target[key] = {}
      }
      target = target[key]
    }

    const lastKey = path[path.length - 1]
    target[lastKey] = value

    await writeFile(AREAS_PATH, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar areas.json:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar dados de áreas' },
      { status: 500 }
    )
  }
}

