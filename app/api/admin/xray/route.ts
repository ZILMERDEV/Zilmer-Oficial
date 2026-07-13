import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const XRAY_PATH = join(process.cwd(), 'data', 'xray.json')

async function loadXray() {
  const file = await readFile(XRAY_PATH, 'utf-8')
  return JSON.parse(file)
}

export async function GET() {
  try {
    const data = await loadXray()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao carregar xray.json:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados do xray' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { field, value } = body as { field?: string; value?: unknown }

    if (!field) {
      return NextResponse.json(
        { error: 'Parâmetro "field" é obrigatório' },
        { status: 400 }
      )
    }

    const data = await loadXray()

    // Navigate dot-notation path; numeric segments are treated as array indices
    const path = field.split('.')
    let target: any = data

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      const nextKey = path[i + 1]
      if (target[key] === undefined || target[key] === null) {
        target[key] = isNaN(Number(nextKey)) ? {} : []
      }
      target = target[key]
    }

    const lastKey = path[path.length - 1]
    if (!isNaN(Number(lastKey))) {
      target[Number(lastKey)] = value
    } else {
      target[lastKey] = value
    }

    await writeFile(XRAY_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar xray.json:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar dados do xray' },
      { status: 500 }
    )
  }
}
