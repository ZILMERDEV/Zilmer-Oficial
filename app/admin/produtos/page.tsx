'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '../page.module.css'
import imageStyles from './imageManager.module.css'
import CarouselEditor from './CarouselEditor'

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

type FieldEntry = {
  label: string
  path: string
  type?: 'text' | 'image' | 'carousel'
  subfolder?: string
}

type FieldGroup = { group: string; fields: FieldEntry[] }

const CATEGORIAS: { key: string; label: string; previewUrl: string }[] = [
  { key: 'oleo', label: 'Transformadores a Óleo', previewUrl: '/produtos/transformadores-oleo' },
  { key: 'seco', label: 'Transformadores a Seco', previewUrl: '/produtos/transformadores-seco' },
  { key: 'instrumentos', label: 'Transformadores p/ Instrumentos', previewUrl: '/produtos/transformadores-instrumentos' },
]

// carousel entries use path = product base path (e.g. 'produtos.para-retificadores')
const FIELDS: Record<string, FieldGroup[]> = {
  oleo: [
    {
      group: 'Introdução',
      fields: [
        { label: 'Descrição', path: 'intro.description' },
      ],
    },
    {
      group: 'Transformadores Auxiliares',
      fields: [
        { label: 'Título', path: 'produtos.transformadores-auxiliares.title' },
        { label: 'Descrição Longa', path: 'produtos.transformadores-auxiliares.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.transformadores-auxiliares.image', type: 'image', subfolder: 'transformadores-auxiliares' },
        { label: 'Carrossel da Página', path: 'produtos.transformadores-auxiliares', type: 'carousel', subfolder: 'transformadores-auxiliares' },
      ],
    },
    {
      group: 'Para Retificadores',
      fields: [
        { label: 'Título', path: 'produtos.para-retificadores.title' },
        { label: 'Descrição Longa', path: 'produtos.para-retificadores.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.para-retificadores.image', type: 'image', subfolder: 'para-retificadores' },
        { label: 'Carrossel da Página', path: 'produtos.para-retificadores', type: 'carousel', subfolder: 'para-retificadores' },
      ],
    },
    {
      group: 'Para Fornos em Arco',
      fields: [
        { label: 'Título', path: 'produtos.para-fornos.title' },
        { label: 'Descrição Longa', path: 'produtos.para-fornos.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.para-fornos.image', type: 'image', subfolder: 'para-fornos' },
        { label: 'Carrossel da Página', path: 'produtos.para-fornos', type: 'carousel', subfolder: 'para-fornos' },
      ],
    },
    {
      group: 'Autotransformadores de Partida',
      fields: [
        { label: 'Título', path: 'produtos.de-partida.title' },
        { label: 'Descrição Longa', path: 'produtos.de-partida.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.de-partida.image', type: 'image', subfolder: 'de-partida' },
        { label: 'Carrossel da Página', path: 'produtos.de-partida', type: 'carousel', subfolder: 'de-partida' },
      ],
    },
    {
      group: 'Transformadores de Aterramento',
      fields: [
        { label: 'Título', path: 'produtos.de-aterramento.title' },
        { label: 'Descrição Longa', path: 'produtos.de-aterramento.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.de-aterramento.image', type: 'image', subfolder: 'de-aterramento' },
        { label: 'Carrossel da Página', path: 'produtos.de-aterramento', type: 'carousel', subfolder: 'de-aterramento' },
      ],
    },
    {
      group: 'Autotransformadores Padrão',
      fields: [
        { label: 'Título', path: 'produtos.autotransformadores.title' },
        { label: 'Descrição Longa', path: 'produtos.autotransformadores.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.autotransformadores.image', type: 'image', subfolder: 'autotransformadores' },
        { label: 'Carrossel da Página', path: 'produtos.autotransformadores', type: 'carousel', subfolder: 'autotransformadores' },
      ],
    },
    {
      group: 'Reatores Imersos em Óleo',
      fields: [
        { label: 'Título', path: 'produtos.reatores.title' },
        { label: 'Descrição Longa', path: 'produtos.reatores.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.reatores.image', type: 'image', subfolder: 'reatores' },
        { label: 'Carrossel da Página', path: 'produtos.reatores', type: 'carousel', subfolder: 'reatores' },
      ],
    },
    {
      group: 'Transformadores de Força',
      fields: [
        { label: 'Introdução', path: 'transformadores-de-forca.intro' },
        { label: 'Imagem do Card (Página Principal)', path: 'transformadores-de-forca.cardImage', type: 'image', subfolder: 'transformadores-de-forca' },
        { label: '30–500 kVA — Título', path: 'transformadores-de-forca.categorias.30-500.title' },
        { label: '30–500 kVA — Descrição', path: 'transformadores-de-forca.categorias.30-500.description' },
        { label: '30–500 kVA — Imagem', path: 'transformadores-de-forca.categorias.30-500.image', type: 'image', subfolder: 'transformadores-de-forca/30-a-300-kv' },
        { label: '500–3000 kVA — Título', path: 'transformadores-de-forca.categorias.500-3000.title' },
        { label: '500–3000 kVA — Descrição', path: 'transformadores-de-forca.categorias.500-3000.description' },
        { label: '500–3000 kVA — Imagem', path: 'transformadores-de-forca.categorias.500-3000.image', type: 'image', subfolder: 'transformadores-de-forca/500-a-3000-kv' },
        { label: '3–20 MVA — Título', path: 'transformadores-de-forca.categorias.3-20.title' },
        { label: '3–20 MVA — Descrição', path: 'transformadores-de-forca.categorias.3-20.description' },
        { label: '3–20 MVA — Imagem', path: 'transformadores-de-forca.categorias.3-20.image', type: 'image', subfolder: 'transformadores-de-forca/3mva-a-20mva' },
      ],
    },
  ],
  seco: [
    {
      group: 'Introdução',
      fields: [
        { label: 'Descrição', path: 'intro.description' },
      ],
    },
    {
      group: 'Média Tensão',
      fields: [
        { label: 'Título', path: 'produtos.media-tensao.title' },
        { label: 'Descrição Longa', path: 'produtos.media-tensao.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.media-tensao.image', type: 'image', subfolder: 'media-tensao' },
        { label: 'Carrossel da Página', path: 'produtos.media-tensao', type: 'carousel', subfolder: 'media-tensao' },
      ],
    },
    {
      group: 'Para Retificadores',
      fields: [
        { label: 'Título', path: 'produtos.para-retificadores.title' },
        { label: 'Descrição Longa', path: 'produtos.para-retificadores.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.para-retificadores.image', type: 'image', subfolder: 'retificadores' },
        { label: 'Carrossel da Página', path: 'produtos.para-retificadores', type: 'carousel', subfolder: 'retificadores' },
      ],
    },
    {
      group: 'Aterramento',
      fields: [
        { label: 'Título', path: 'produtos.aterramento.title' },
        { label: 'Descrição Longa', path: 'produtos.aterramento.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.aterramento.image', type: 'image', subfolder: 'aterramento' },
        { label: 'Carrossel da Página', path: 'produtos.aterramento', type: 'carousel', subfolder: 'aterramento' },
      ],
    },
    {
      group: 'Baixa Tensão',
      fields: [
        { label: 'Título', path: 'produtos.baixa-tensao.title' },
        { label: 'Descrição Longa', path: 'produtos.baixa-tensao.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.baixa-tensao.image', type: 'image', subfolder: 'baixa-tensao' },
        { label: 'Carrossel da Página', path: 'produtos.baixa-tensao', type: 'carousel', subfolder: 'baixa-tensao' },
      ],
    },
    {
      group: 'Reatores de Partida',
      fields: [
        { label: 'Título', path: 'produtos.reatores-de-partida.title' },
        { label: 'Descrição Longa', path: 'produtos.reatores-de-partida.longDescription' },
        { label: 'Imagem do Card', path: 'produtos.reatores-de-partida.image', type: 'image', subfolder: 'reatores-de-partida' },
        { label: 'Carrossel da Página', path: 'produtos.reatores-de-partida', type: 'carousel', subfolder: 'reatores-de-partida' },
      ],
    },
  ],
  instrumentos: [
    {
      group: 'Introdução',
      fields: [
        { label: 'Descrição', path: 'intro.description' },
      ],
    },
    {
      group: 'TP — Uso Interno',
      fields: [
        { label: 'Descrição', path: 'tp.uso-interno.description' },
        { label: 'Imagem', path: 'tp.uso-interno.image', type: 'image', subfolder: 'tp-internos' },
      ],
    },
    {
      group: 'TP — Uso Externo',
      fields: [
        { label: 'Descrição', path: 'tp.uso-externo.description' },
        { label: 'Imagem', path: 'tp.uso-externo.image', type: 'image', subfolder: 'tp-externos' },
      ],
    },
    {
      group: 'TC — Uso Interno',
      fields: [
        { label: 'Descrição', path: 'tc.uso-interno.description' },
        { label: 'Imagem', path: 'tc.uso-interno.image', type: 'image', subfolder: 'tc-internos' },
      ],
    },
    {
      group: 'TC — Uso Externo',
      fields: [
        { label: 'Descrição', path: 'tc.uso-externo.description' },
        { label: 'Imagem', path: 'tc.uso-externo.image', type: 'image', subfolder: 'tc-externos' },
      ],
    },
  ],
}

function getValueByPath(obj: any, path: string): string {
  const keys = path.split('.')
  let target = obj
  for (const key of keys) {
    if (target == null || typeof target !== 'object') return ''
    target = target[key]
  }
  return typeof target === 'string' ? target : ''
}

function getPreviewUrl(categoria: string, path: string): string {
  const base: Record<string, string> = {
    oleo: '/produtos/transformadores-oleo',
    seco: '/produtos/transformadores-seco',
    instrumentos: '/produtos/transformadores-instrumentos',
  }
  const categoryBase = base[categoria] || '/produtos'
  if (path.startsWith('produtos.')) {
    const slug = path.split('.')[1]
    return slug ? `${categoryBase}/${slug}` : categoryBase
  }
  if (path.startsWith('transformadores-de-forca')) {
    return `${categoryBase}/transformadores-de-forca`
  }
  return categoryBase
}

const FIELD_ICON: Record<string, string> = {
  image: '🖼 ',
  carousel: '🎞 ',
}

export default function AdminProdutosPage() {
  const [produtosData, setProdutosData] = useState<any>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string>('oleo')
  const [selectedEntry, setSelectedEntry] = useState<FieldEntry | null>(null)
  const [editedValue, setEditedValue] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Thumbnail image state
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/produtos')
      if (res.ok) setProdutosData(await res.json())
    } catch (e) {
      console.error('Erro ao carregar dados:', e)
    }
  }

  const loadExistingImages = async (categoria: string, subfolder: string) => {
    try {
      const res = await fetch(`/api/admin/produtos/images?category=${categoria}&subfolder=${subfolder}`)
      if (res.ok) setExistingImages((await res.json()).images || [])
    } catch {
      setExistingImages([])
    }
  }

  const handleFieldSelect = (entry: FieldEntry) => {
    setSelectedEntry(entry)
    setMessage(null)
    setImageFile(null)
    setImagePreview('')
    setExistingImages([])

    if (entry.type !== 'carousel' && produtosData) {
      setEditedValue(stripHtml(getValueByPath(produtosData[selectedCategoria], entry.path)))
      if (entry.type === 'image' && entry.subfolder) {
        loadExistingImages(selectedCategoria, entry.subfolder)
      }
    }
  }

  const handleCategoriaSelect = (key: string) => {
    setSelectedCategoria(key)
    setSelectedEntry(null)
    setEditedValue('')
    setImageFile(null)
    setImagePreview('')
    setExistingImages([])
    setMessage(null)
  }

  const handleTextSave = async () => {
    if (!selectedEntry) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria: selectedCategoria, path: selectedEntry.path, value: stripHtml(editedValue) }),
      })
      if (res.ok) {
        setProdutosData(await res.json())
        setMessage({ type: 'success', text: 'Texto salvo com sucesso!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const err = await res.json().catch(() => ({}))
        setMessage({ type: 'error', text: err.error || 'Erro ao salvar.' })
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Erro ao salvar.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageUpload = async () => {
    if (!imageFile || !selectedEntry) return
    setImageUploading(true)
    setMessage(null)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('category', selectedCategoria)
      if (selectedEntry.subfolder) formData.append('subfolder', selectedEntry.subfolder)

      const uploadRes = await fetch('/api/admin/produtos/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}))
        setMessage({ type: 'error', text: err.error || 'Erro ao fazer upload.' })
        return
      }
      const { path: uploadedPath } = await uploadRes.json()
      await saveImagePath(uploadedPath)
      setImageFile(null)
      setImagePreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (selectedEntry.subfolder) loadExistingImages(selectedCategoria, selectedEntry.subfolder)
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Erro ao fazer upload.' })
    } finally {
      setImageUploading(false)
    }
  }

  const saveImagePath = async (imagePath: string) => {
    if (!selectedEntry) return
    const res = await fetch('/api/admin/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria: selectedCategoria, path: selectedEntry.path, value: imagePath }),
    })
    if (res.ok) {
      setProdutosData(await res.json())
      setEditedValue(imagePath)
      setMessage({ type: 'success', text: 'Imagem salva com sucesso!' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: 'Erro ao salvar o caminho da imagem.' })
    }
  }

  const previewUrl = selectedEntry
    ? getPreviewUrl(selectedCategoria, selectedEntry.path)
    : CATEGORIAS.find(c => c.key === selectedCategoria)?.previewUrl || '/produtos'
  const groups = FIELDS[selectedCategoria] || []
  const isImage = selectedEntry?.type === 'image'
  const isCarousel = selectedEntry?.type === 'carousel'
  const currentImagePath = isImage ? editedValue : ''
  const selectedGroup = groups.find(g => g.fields.some(f => f.path === selectedEntry?.path))

  if (!produtosData) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.placeholder}><p>Carregando dados...</p></div>
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Editor de Conteúdo - Produtos</h1>
        <p>Edite os textos e imagens das páginas de produtos diretamente aqui</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/admin" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>→ Editar Áreas</a>
          {' | '}
          <a href="/admin/sobre" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>→ Editar Sobre</a>
          {' | '}
          <a href="/admin/noticias" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>→ Editar Notícias</a>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
      )}

      <div className={styles.adminContent}>
        {/* ── Sidebar ── */}
        <div className={styles.sidebar}>
          <h2>Categoria</h2>
          <div className={styles.areaList}>
            {CATEGORIAS.map(c => (
              <button
                key={c.key}
                className={`${styles.areaButton} ${selectedCategoria === c.key ? styles.active : ''}`}
                onClick={() => handleCategoriaSelect(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <h2 style={{ marginTop: '2rem' }}>Campos</h2>
          <div className={styles.fieldList}>
            {groups.map(group => (
              <div key={group.group}>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  color: '#888', padding: '0.6rem 0.5rem 0.2rem', letterSpacing: '0.05em'
                }}>
                  {group.group}
                </div>
                {group.fields.map(f => (
                  <button
                    key={f.path}
                    className={`${styles.fieldButton} ${selectedEntry?.path === f.path ? styles.active : ''}`}
                    onClick={() => handleFieldSelect(f)}
                    style={f.type && f.type !== 'text' ? { fontStyle: 'italic' } : undefined}
                  >
                    {f.type ? (FIELD_ICON[f.type] || '') : ''}{f.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Editor area ── */}
        <div className={styles.editor}>
          {selectedEntry ? (
            <>
              <div className={styles.editorHeader}>
                <h2>{selectedGroup?.group} — {selectedEntry.label}</h2>
              </div>

              {/* Carousel editor */}
              {isCarousel && selectedEntry.subfolder && (
                <>
                  <CarouselEditor
                    key={`${selectedCategoria}::${selectedEntry.path}`}
                    categoria={selectedCategoria}
                    basePath={selectedEntry.path}
                    subfolder={selectedEntry.subfolder}
                    produtosData={produtosData}
                    onDataUpdate={setProdutosData}
                    onMessage={setMessage}
                  />
                  <div className={styles.editorActions} style={{ marginTop: '1.5rem' }}>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={styles.previewButton}>
                      Ver a Página
                    </a>
                  </div>
                </>
              )}

              {/* Thumbnail image editor */}
              {isImage && (
                <div className={imageStyles.imageManager}>
                  <div className={imageStyles.currentSection}>
                    <h3>Imagem atual do card</h3>
                    {currentImagePath ? (
                      <div className={imageStyles.currentImageWrap}>
                        <div className={imageStyles.currentImagePreview}>
                          <Image src={currentImagePath} alt="Imagem atual" fill style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                        <p className={imageStyles.imagePath}>{currentImagePath}</p>
                        <button className={imageStyles.removeButton} onClick={() => saveImagePath('')}>
                          Remover imagem
                        </button>
                      </div>
                    ) : (
                      <div className={imageStyles.noImage}>Nenhuma imagem definida</div>
                    )}
                  </div>

                  <div className={imageStyles.uploadSection}>
                    <h3>Enviar nova imagem</h3>
                    <p className={imageStyles.hint}>
                      Pasta: <code>/images/produtos/{selectedCategoria}/{selectedEntry.subfolder}/</code>
                    </p>
                    <div className={imageStyles.uploadRow}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className={imageStyles.fileInput}
                      />
                      {imageFile && (
                        <button className={imageStyles.uploadButton} onClick={handleImageUpload} disabled={imageUploading}>
                          {imageUploading ? 'Enviando...' : 'Enviar e Usar'}
                        </button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className={imageStyles.uploadPreviewWrap}>
                        <div className={imageStyles.uploadPreview}>
                          <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                        <p className={imageStyles.previewLabel}>Preview: {imageFile?.name}</p>
                      </div>
                    )}
                  </div>

                  {existingImages.length > 0 && (
                    <div className={imageStyles.gallerySection}>
                      <h3>Imagens disponíveis na pasta ({existingImages.length})</h3>
                      <p className={imageStyles.hint}>Clique em uma imagem para usá-la como imagem do card</p>
                      <div className={imageStyles.gallery}>
                        {existingImages.map(img => (
                          <button
                            key={img}
                            className={`${imageStyles.galleryItem} ${currentImagePath === img ? imageStyles.galleryItemActive : ''}`}
                            onClick={() => saveImagePath(img)}
                            title={img.split('/').pop()}
                          >
                            <div className={imageStyles.galleryThumb}>
                              <Image src={img} alt={img.split('/').pop() || ''} fill style={{ objectFit: 'cover' }} unoptimized />
                            </div>
                            <span className={imageStyles.galleryName}>{img.split('/').pop()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.editorActions} style={{ marginTop: '1.5rem' }}>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={styles.previewButton}>
                      Ver a Página
                    </a>
                  </div>
                </div>
              )}

              {/* Text editor */}
              {!isImage && !isCarousel && (
                <>
                  <div className={styles.editorWrapper}>
                    <textarea
                      value={editedValue || ''}
                      onChange={(e) => setEditedValue(e.target.value)}
                      placeholder="Digite o texto aqui..."
                      style={{
                        width: '100%',
                        minHeight: '220px',
                        padding: '15px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                  <div className={styles.editorActions}>
                    <button className={styles.saveButton} onClick={handleTextSave} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={styles.previewButton}>
                      Ver a Página
                    </a>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>Selecione uma categoria e um campo para começar a editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
