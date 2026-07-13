'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './carouselEditor.module.css'

interface CarouselEditorProps {
  categoria: string
  basePath: string
  subfolder: string
  produtosData: any
  onDataUpdate: (data: any) => void
  onMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void
}

function readByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), obj)
}

export default function CarouselEditor({
  categoria,
  basePath,
  subfolder,
  produtosData,
  onDataUpdate,
  onMessage,
}: CarouselEditorProps) {
  const productData = readByPath(produtosData?.[categoria], basePath)

  const [images, setImages] = useState<string[]>(productData?.images || [])
  const [captions, setCaptions] = useState<Record<string, string>>(productData?.captions || {})
  const [firstImageIndex, setFirstImageIndex] = useState<number>(productData?.firstImageIndex ?? 0)
  const [folderImages, setFolderImages] = useState<string[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const pd = readByPath(produtosData?.[categoria], basePath)
    setImages(pd?.images || [])
    setCaptions(pd?.captions || {})
    setFirstImageIndex(pd?.firstImageIndex ?? 0)
    loadFolderImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, categoria])

  const loadFolderImages = async () => {
    try {
      const res = await fetch(`/api/admin/produtos/images?category=${categoria}&subfolder=${subfolder}`)
      if (res.ok) {
        const data = await res.json()
        setFolderImages(data.images || [])
      }
    } catch {
      setFolderImages([])
    }
  }

  const saveToApi = async (path: string, value: unknown): Promise<any> => {
    const res = await fetch('/api/admin/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, path, value }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erro ao salvar')
    }
    return res.json()
  }

  const persistImages = async (newImages: string[], newFirstIdx: number) => {
    setSaving(true)
    try {
      let data = await saveToApi(`${basePath}.images`, newImages)
      data = await saveToApi(`${basePath}.firstImageIndex`, newFirstIdx)
      onDataUpdate(data)
      setImages(newImages)
      setFirstImageIndex(newFirstIdx)
    } catch (e: any) {
      onMessage({ type: 'error', text: e?.message || 'Erro ao salvar.' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddImage = async (imagePath: string) => {
    if (images.includes(imagePath)) {
      onMessage({ type: 'error', text: 'Esta imagem já está no carrossel.' })
      setTimeout(() => onMessage(null), 3000)
      return
    }
    const newImages = [...images, imagePath]
    await persistImages(newImages, firstImageIndex)
    onMessage({ type: 'success', text: 'Imagem adicionada ao carrossel!' })
    setTimeout(() => onMessage(null), 3000)
  }

  const handleRemove = async (idx: number) => {
    const removed = images[idx]
    const newImages = images.filter((_, i) => i !== idx)
    const newCaptions = { ...captions }
    delete newCaptions[removed]

    let newFirst = firstImageIndex
    if (idx < firstImageIndex) newFirst = firstImageIndex - 1
    else if (idx === firstImageIndex) newFirst = 0
    if (newImages.length === 0) newFirst = 0

    setSaving(true)
    try {
      let data = await saveToApi(`${basePath}.images`, newImages)
      data = await saveToApi(`${basePath}.captions`, newCaptions)
      data = await saveToApi(`${basePath}.firstImageIndex`, newFirst)
      onDataUpdate(data)
      setImages(newImages)
      setCaptions(newCaptions)
      setFirstImageIndex(newFirst)
      onMessage({ type: 'success', text: 'Imagem removida.' })
      setTimeout(() => onMessage(null), 3000)
    } catch (e: any) {
      onMessage({ type: 'error', text: e?.message || 'Erro ao remover.' })
    } finally {
      setSaving(false)
    }
  }

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return
    const newImages = [...images]
    ;[newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]]
    let newFirst = firstImageIndex
    if (firstImageIndex === idx) newFirst = idx - 1
    else if (firstImageIndex === idx - 1) newFirst = idx
    await persistImages(newImages, newFirst)
  }

  const handleMoveDown = async (idx: number) => {
    if (idx === images.length - 1) return
    const newImages = [...images]
    ;[newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]]
    let newFirst = firstImageIndex
    if (firstImageIndex === idx) newFirst = idx + 1
    else if (firstImageIndex === idx + 1) newFirst = idx
    await persistImages(newImages, newFirst)
  }

  const handleSetFirst = async (idx: number) => {
    setSaving(true)
    try {
      const data = await saveToApi(`${basePath}.firstImageIndex`, idx)
      onDataUpdate(data)
      setFirstImageIndex(idx)
      onMessage({ type: 'success', text: 'Imagem inicial definida.' })
      setTimeout(() => onMessage(null), 3000)
    } catch (e: any) {
      onMessage({ type: 'error', text: e?.message || 'Erro.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCaptions = async () => {
    setSaving(true)
    try {
      const data = await saveToApi(`${basePath}.captions`, captions)
      onDataUpdate(data)
      onMessage({ type: 'success', text: 'Legendas salvas com sucesso!' })
      setTimeout(() => onMessage(null), 3000)
    } catch (e: any) {
      onMessage({ type: 'error', text: e?.message || 'Erro ao salvar legendas.' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    setUploadPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!uploadFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('category', categoria)
      formData.append('subfolder', subfolder)

      const res = await fetch('/api/admin/produtos/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        onMessage({ type: 'error', text: err.error || 'Erro ao fazer upload.' })
        return
      }
      const { path: uploadedPath } = await res.json()

      const newImages = [...images, uploadedPath]
      await persistImages(newImages, firstImageIndex)
      await loadFolderImages()

      setUploadFile(null)
      setUploadPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      onMessage({ type: 'success', text: 'Imagem enviada e adicionada ao carrossel!' })
      setTimeout(() => onMessage(null), 3000)
    } catch (e: any) {
      onMessage({ type: 'error', text: e?.message || 'Erro ao fazer upload.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.container}>

      {/* ── Upload section ── */}
      <section className={styles.section}>
        <h3>Enviar nova imagem</h3>
        <p className={styles.hint}>Pasta: <code>/images/produtos/{categoria}/{subfolder}/</code></p>
        <div className={styles.uploadRow}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {uploadFile && (
            <button className={styles.uploadBtn} onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Enviando...' : 'Enviar e Adicionar'}
            </button>
          )}
        </div>
        {uploadPreview && (
          <div className={styles.previewRow}>
            <div className={styles.previewThumb}>
              <Image src={uploadPreview} alt="Preview" fill style={{ objectFit: 'contain' }} unoptimized />
            </div>
            <span className={styles.hint}>{uploadFile?.name}</span>
          </div>
        )}
      </section>

      {/* ── Carousel list ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Imagens no carrossel{images.length > 0 ? ` (${images.length})` : ''}</h3>
          {images.length > 0 && (
            <button className={styles.saveCaptionsBtn} onClick={handleSaveCaptions} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar legendas'}
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div className={styles.empty}>
            Nenhuma imagem no carrossel. Envie uma nova ou selecione da pasta abaixo.
          </div>
        ) : (
          <>
            <div className={styles.imageList}>
              {images.map((imgPath, idx) => (
                <div
                  key={imgPath + idx}
                  className={`${styles.imageItem} ${idx === firstImageIndex ? styles.isFirst : ''}`}
                >
                  <div className={styles.thumbCol}>
                    <div className={styles.imageThumb}>
                      <Image src={imgPath} alt={`Imagem ${idx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div className={styles.orderBtns}>
                      <button
                        className={styles.orderBtn}
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0 || saving}
                        title="Mover para cima"
                      >▲</button>
                      <span className={styles.orderNum}>{idx + 1}</span>
                      <button
                        className={styles.orderBtn}
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === images.length - 1 || saving}
                        title="Mover para baixo"
                      >▼</button>
                    </div>
                  </div>

                  <div className={styles.detailCol}>
                    <div className={styles.detailActions}>
                      {idx === firstImageIndex ? (
                        <span className={styles.firstBadge}>★ Primeira imagem</span>
                      ) : (
                        <button className={styles.setFirstBtn} onClick={() => handleSetFirst(idx)} disabled={saving}>
                          ☆ Definir como primeira
                        </button>
                      )}
                      <button className={styles.removeBtn} onClick={() => handleRemove(idx)} disabled={saving}>
                        Remover
                      </button>
                    </div>
                    <div className={styles.captionRow}>
                      <label className={styles.captionLabel}>Legenda:</label>
                      <input
                        type="text"
                        value={captions[imgPath] || ''}
                        onChange={e => setCaptions(prev => ({ ...prev, [imgPath]: e.target.value }))}
                        placeholder="Digite a legenda desta imagem..."
                        className={styles.captionInput}
                      />
                    </div>
                    <p className={styles.imgFileName}>{imgPath.split('/').pop()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.bottomSave}>
              <button className={styles.saveCaptionsBtn} onClick={handleSaveCaptions} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar legendas'}
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── Folder gallery ── */}
      {folderImages.length > 0 && (
        <section className={styles.section}>
          <h3>Imagens disponíveis na pasta ({folderImages.length})</h3>
          <p className={styles.hint}>Clique em uma imagem para adicioná-la ao carrossel</p>
          <div className={styles.folderGallery}>
            {folderImages.map(img => {
              const inCarousel = images.includes(img)
              return (
                <button
                  key={img}
                  className={`${styles.galleryItem} ${inCarousel ? styles.galleryItemUsed : ''}`}
                  onClick={() => !inCarousel && handleAddImage(img)}
                  disabled={inCarousel || saving}
                  title={img.split('/').pop()}
                >
                  <div className={styles.galleryThumb}>
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                    {inCarousel && <div className={styles.usedOverlay}>✓ No carrossel</div>}
                  </div>
                  <span className={styles.galleryName}>{img.split('/').pop()}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
