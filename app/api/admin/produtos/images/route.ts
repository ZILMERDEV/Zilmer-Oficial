import { NextResponse } from 'next/server'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subfolder = searchParams.get('subfolder') || ''

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não especificada' },
        { status: 400 }
      )
    }

    const folderMap: { [key: string]: string } = {
      oleo: 'public/images/produtos/oleo',
      seco: 'public/images/produtos/seco',
      instrumentos: 'public/images/produtos/instrumentos',
    }

    const baseFolder = folderMap[category]
    if (!baseFolder) {
      return NextResponse.json(
        { error: `Categoria '${category}' não encontrada` },
        { status: 404 }
      )
    }

    const searchDir = subfolder ? join(process.cwd(), baseFolder, subfolder) : join(process.cwd(), baseFolder)
    const images: string[] = []

    const findImages = (dir: string, relBase: string = '') => {
      try {
        const files = readdirSync(dir)
        files.forEach((file) => {
          const fullPath = join(dir, file)
          const relPath = relBase ? `${relBase}/${file}` : file
          const stat = statSync(fullPath)
          if (stat.isDirectory()) {
            findImages(fullPath, relPath)
          } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
            const imagePath = subfolder
              ? `/images/produtos/${category}/${subfolder}/${relPath.replace(/\\/g, '/')}`
              : `/images/produtos/${category}/${relPath.replace(/\\/g, '/')}`
            images.push(imagePath)
          }
        })
      } catch {
        // directory may not exist yet
      }
    }

    findImages(searchDir)

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Erro ao buscar imagens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagens' },
      { status: 500 }
    )
  }
}
