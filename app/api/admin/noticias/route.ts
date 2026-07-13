import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const NOTICIAS_PATH = join(process.cwd(), 'data', 'noticias.json')
const NOTICIAS_EN_PATH = join(process.cwd(), 'data', 'noticias.en.json')
const NOTICIAS_ES_PATH = join(process.cwd(), 'data', 'noticias.es.json')

function stripHtml(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').trim()
  }
  return value
}

async function loadNoticias(locale?: string) {
  const filePath = locale === 'en' ? NOTICIAS_EN_PATH : locale === 'es' ? NOTICIAS_ES_PATH : NOTICIAS_PATH
  const file = await readFile(filePath, 'utf-8')
  return JSON.parse(file)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'pt'
    const data = await loadNoticias(locale)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar noticias.json:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados de notícias' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, field, value, index } = body as {
      action?: string
      field?: string
      value?: unknown
      index?: number
    }

    const data = await loadNoticias()  // POST always writes to PT (primary) file

    if (action === 'addItem') {
      const newId = String(Date.now())
      data.items.push({
        id: newId,
        title: 'Nova notícia',
        description: 'Descrição da notícia.',
        image: '/images/projetos/projeto-1.jpeg',
        slug: `noticia-${newId}`,
      })
      await writeFile(NOTICIAS_PATH, JSON.stringify(data, null, 2), 'utf-8')
      return NextResponse.json(data)
    }

    if (action === 'removeItem') {
      if (index === undefined || index < 0 || index >= data.items.length) {
        return NextResponse.json(
          { error: 'Índice inválido' },
          { status: 400 }
        )
      }
      data.items.splice(index, 1)
      await writeFile(NOTICIAS_PATH, JSON.stringify(data, null, 2), 'utf-8')
      return NextResponse.json(data)
    }

    if (!field) {
      return NextResponse.json(
        { error: 'Parâmetro "field" é obrigatório' },
        { status: 400 }
      )
    }

    // Navigate nested path, e.g. "section.title" or "items.0.description"
    const path = field.split('.')
    let target: any = data

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      const next = !isNaN(Number(path[i + 1])) ? [] : {}
      if (target[key] === undefined || target[key] === null) {
        target[key] = next
      }
      target = target[key]
    }

    const lastKey = path[path.length - 1]
    target[lastKey] = stripHtml(value)

    await writeFile(NOTICIAS_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar noticias.json:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar dados de notícias' },
      { status: 500 }
    )
  }
}
