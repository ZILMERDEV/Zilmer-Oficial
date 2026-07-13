import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const PRODUTOS_PATH = join(process.cwd(), 'data', 'produtos.json')

async function loadProdutos() {
  const file = await readFile(PRODUTOS_PATH, 'utf-8')
  return JSON.parse(file)
}

export async function GET() {
  try {
    const data = await loadProdutos()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar produtos.json:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados de produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoria, path, value } = body as {
      categoria?: string
      path?: string
      value?: unknown
    }

    if (!categoria || !path) {
      return NextResponse.json(
        { error: 'Parâmetros "categoria" e "path" são obrigatórios' },
        { status: 400 }
      )
    }

    const data = await loadProdutos()

    if (!data[categoria]) {
      return NextResponse.json(
        { error: `Categoria '${categoria}' não encontrada em produtos.json` },
        { status: 404 }
      )
    }

    const keys = path.split('.')
    let target: any = data[categoria]

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (target[key] === undefined || target[key] === null) {
        target[key] = {}
      }
      target = target[key]
    }

    target[keys[keys.length - 1]] = value

    await writeFile(PRODUTOS_PATH, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar produtos.json:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar dados de produtos' },
      { status: 500 }
    )
  }
}

