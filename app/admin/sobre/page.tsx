'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '../page.module.css'
import { cdnUrl } from '@/lib/assets'

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

interface CertificadoItem { file: string; title: string; type: string }

interface SobreData {
  principal: {
    title: string
    intro: string
    image?: string
    cards: {
      historico: { title: string; description: string }
      clientes: { title: string; description: string }
      certificados: { title: string; description: string }
    }
  }
  historico: {
    title: string
    subtitle: string
    content: string
    image?: string
    imageCaption?: string
  }
  clientes: {
    title: string
    description: string
    image?: string
  }
  certificados: {
    title: string
    description: string
    items?: CertificadoItem[]
  }
}

// Fields that show the image uploader instead of a textarea
const IMAGE_FIELDS = new Set(['image'])
// The certificados items list editor
const isItemsField = (section: string, field: string) =>
  section === 'certificados' && field === 'items'

const sectionNames: Record<string, string> = {
  principal: 'Página Principal',
  historico: 'Histórico',
  clientes: 'Clientes',
  certificados: 'Certificados',
}

const getFieldNames = (section: string): Record<string, string> => {
  if (section === 'principal') return {
    'intro': 'Introdução',
    'image': 'Imagem Principal',
    'cards.historico.title': 'Card Histórico - Título',
    'cards.historico.description': 'Card Histórico - Descrição',
    'cards.clientes.title': 'Card Clientes - Título',
    'cards.clientes.description': 'Card Clientes - Descrição',
    'cards.certificados.title': 'Card Certificados - Título',
    'cards.certificados.description': 'Card Certificados - Descrição',
  }
  if (section === 'historico') return {
    'subtitle': 'Subtítulo',
    'content': 'Conteúdo',
    'image': 'Foto Histórica',
    'imageCaption': 'Legenda da Foto',
  }
  if (section === 'clientes') return {
    'description': 'Descrição',
    'image': 'Imagem dos Clientes',
  }
  if (section === 'certificados') return {
    'description': 'Descrição',
    'items': 'Certificados (PDFs / Imagens)',
  }
  return {}
}

const getPreviewUrl = (section: string) => {
  if (section === 'historico') return '/sobre/historico'
  if (section === 'clientes') return '/sobre/clientes'
  if (section === 'certificados') return '/sobre/certificados'
  return '/sobre'
}

export default function AdminSobrePage() {
  const [sobreData, setSobreData] = useState<SobreData | null>(null)
  const [selectedSection, setSelectedSection] = useState<string>('principal')
  const [selectedField, setSelectedField] = useState<string>('')
  const [editedValue, setEditedValue] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  // Certificados new-item state
  const certFileRef = useRef<HTMLInputElement>(null)
  const [newCertTitle, setNewCertTitle] = useState('')
  const [newCertType, setNewCertType] = useState('pdf')
  const [newCertFile, setNewCertFile] = useState<File | null>(null)
  const [certAddLoading, setCertAddLoading] = useState(false)

  useEffect(() => {
    loadSobreData()
  }, [])

  const loadSobreData = async () => {
    try {
      const response = await fetch('/api/admin/sobre')
      if (response.ok) {
        const data = await response.json()
        setSobreData(data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // ── Text save ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedSection || !selectedField) return
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/sobre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: selectedSection,
          field: selectedField,
          value: stripHtml(editedValue),
        }),
      })
      if (response.ok) {
        setSobreData(await response.json())
        showMessage('success', 'Texto salvo com sucesso!')
      } else {
        showMessage('error', 'Erro ao salvar. Tente novamente.')
      }
    } catch {
      showMessage('error', 'Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // ── Image upload ───────────────────────────────────────────
  const handleImageUpload = async () => {
    if (!selectedFile || !selectedSection) return
    setUploadLoading(true)
    setMessage(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('section', selectedSection)

      const uploadRes = await fetch('/api/admin/sobre/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || 'Erro no upload')
      const { path } = await uploadRes.json()

      const saveRes = await fetch('/api/admin/sobre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: selectedSection, field: selectedField, value: path }),
      })
      if (!saveRes.ok) throw new Error('Erro ao salvar caminho')
      const updated = await saveRes.json()
      setSobreData(updated)
      setEditedValue(path)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      showMessage('success', 'Imagem enviada e salva com sucesso!')
    } catch (e: any) {
      showMessage('error', e?.message || 'Erro ao fazer upload')
    } finally {
      setUploadLoading(false)
    }
  }

  // ── Certificados management ────────────────────────────────
  const handleRemoveCertificado = async (index: number) => {
    setMessage(null)
    try {
      const res = await fetch('/api/admin/sobre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'removeCertificado', index }),
      })
      if (!res.ok) throw new Error('Erro ao remover')
      setSobreData(await res.json())
      showMessage('success', 'Certificado removido.')
    } catch (e: any) {
      showMessage('error', e?.message || 'Erro ao remover certificado')
    }
  }

  const handleAddCertificado = async () => {
    if (!newCertTitle.trim() || !newCertFile) return
    setCertAddLoading(true)
    setMessage(null)
    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', newCertFile)
      formData.append('section', 'certificados')
      const uploadRes = await fetch('/api/admin/sobre/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || 'Erro no upload')
      const { path } = await uploadRes.json()
      const fileName = path.split('/').pop() || path

      // Add item
      const res = await fetch('/api/admin/sobre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addCertificado',
          value: { file: fileName, title: newCertTitle.trim(), type: newCertType },
        }),
      })
      if (!res.ok) throw new Error('Erro ao adicionar')
      setSobreData(await res.json())
      setNewCertTitle('')
      setNewCertType('pdf')
      setNewCertFile(null)
      if (certFileRef.current) certFileRef.current.value = ''
      showMessage('success', 'Certificado adicionado com sucesso!')
    } catch (e: any) {
      showMessage('error', e?.message || 'Erro ao adicionar certificado')
    } finally {
      setCertAddLoading(false)
    }
  }

  // ── Field selection ────────────────────────────────────────
  const handleFieldSelect = (field: string) => {
    setSelectedField(field)
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (!sobreData) return

    let value = ''
    if (IMAGE_FIELDS.has(field) || isItemsField(selectedSection, field)) {
      // For image fields, read the current path; items editor is rendered separately
      const sectionData = sobreData[selectedSection as keyof SobreData] as any
      value = IMAGE_FIELDS.has(field) ? (sectionData?.[field] || '') : ''
    } else {
      // Navigate dot-notation path to get current text
      const fieldParts = field.split('.')
      let target: any = sobreData[selectedSection as keyof SobreData]
      for (const part of fieldParts) {
        if (!isNaN(Number(part)) && Array.isArray(target)) {
          target = target[Number(part)]
        } else if (target && target[part] !== undefined) {
          target = target[part]
        } else {
          target = undefined
          break
        }
      }
      value = typeof target === 'string' ? stripHtml(target) : ''
    }
    setEditedValue(value)
  }

  // ── Render helpers ─────────────────────────────────────────
  const renderImageEditor = () => {
    const sectionData = sobreData ? (sobreData[selectedSection as keyof SobreData] as any) : null
    const currentPath: string = sectionData?.[selectedField] || editedValue || ''

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#003366', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>Imagem Atual</h3>
          {currentPath ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '260px', background: '#e9ecef', borderRadius: '6px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPath}
                  alt="Imagem atual"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).src = cdnUrl(currentPath) }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: 0, wordBreak: 'break-all', background: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #dee2e6', maxWidth: '480px' }}>
                {currentPath}
              </p>
            </div>
          ) : (
            <p style={{ color: '#aaa', margin: 0 }}>Nenhuma imagem definida</p>
          )}
        </div>

        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#003366', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>Trocar Imagem</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              style={{ flex: 1, fontSize: '0.9rem' }}
            />
            <button
              className={styles.saveButton}
              onClick={handleImageUpload}
              disabled={!selectedFile || uploadLoading}
            >
              {uploadLoading ? 'Enviando...' : 'Upload & Salvar'}
            </button>
          </div>
          {selectedFile && (
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              Arquivo selecionado: <strong>{selectedFile.name}</strong>
            </p>
          )}
        </div>
      </div>
    )
  }

  const renderCertificadosEditor = () => {
    const items: CertificadoItem[] = sobreData?.certificados?.items || []
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Current items */}
        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#003366', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
            Certificados Atuais ({items.length})
          </h3>
          {items.length === 0 ? (
            <p style={{ color: '#aaa', margin: 0 }}>Nenhum certificado cadastrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', background: '#fff',
                    border: '1px solid #dee2e6', borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.type === 'pdf' ? '📄' : '🖼️'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#888', wordBreak: 'break-all' }}>{item.file}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase' }}>{item.type}</span>
                  <button
                    onClick={() => handleRemoveCertificado(i)}
                    style={{
                      padding: '0.3rem 0.75rem', background: '#fff', color: '#dc3545',
                      border: '1px solid #dc3545', borderRadius: '4px', fontSize: '0.8rem',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new item */}
        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#003366', margin: '0 0 1rem 0', fontSize: '1rem' }}>Adicionar Certificado</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Título</span>
              <input
                type="text"
                value={newCertTitle}
                onChange={e => setNewCertTitle(e.target.value)}
                placeholder="Ex: Certificado ISO 9001"
                style={{ padding: '0.5rem 0.75rem', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '0.9rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Tipo</span>
              <select
                value={newCertType}
                onChange={e => setNewCertType(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="pdf">PDF</option>
                <option value="image">Imagem</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Arquivo</span>
              <input
                ref={certFileRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={e => setNewCertFile(e.target.files?.[0] || null)}
                style={{ fontSize: '0.9rem' }}
              />
            </label>
            <button
              className={styles.saveButton}
              onClick={handleAddCertificado}
              disabled={!newCertTitle.trim() || !newCertFile || certAddLoading}
              style={{ alignSelf: 'flex-start' }}
            >
              {certAddLoading ? 'Adicionando...' : 'Adicionar Certificado'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!sobreData) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.placeholder}><p>Carregando dados...</p></div>
      </div>
    )
  }

  const fieldNames = getFieldNames(selectedSection)
  const isImg = IMAGE_FIELDS.has(selectedField)
  const isItems = isItemsField(selectedSection, selectedField)

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Editor de Conteúdo — Sobre</h1>
        <p>Edite textos e imagens das páginas de Sobre</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/admin" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            ← Voltar ao painel principal
          </a>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.adminContent}>
        <div className={styles.sidebar}>
          <h2>Selecione a Seção</h2>
          <div className={styles.areaList}>
            {Object.keys(sectionNames).map((key) => (
              <button
                key={key}
                className={`${styles.areaButton} ${selectedSection === key ? styles.active : ''}`}
                onClick={() => {
                  setSelectedSection(key)
                  setSelectedField('')
                  setEditedValue('')
                  setSelectedFile(null)
                }}
              >
                {sectionNames[key]}
              </button>
            ))}
          </div>

          {selectedSection && (
            <>
              <h2 style={{ marginTop: '2rem' }}>Selecione o Campo</h2>
              <div className={styles.fieldList}>
                {Object.keys(fieldNames).map((field) => (
                  <button
                    key={field}
                    className={`${styles.fieldButton} ${selectedField === field ? styles.active : ''}`}
                    onClick={() => handleFieldSelect(field)}
                  >
                    {fieldNames[field]}
                    {IMAGE_FIELDS.has(field) && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', opacity: 0.7 }}>🖼️</span>
                    )}
                    {isItemsField(selectedSection, field) && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', opacity: 0.7 }}>📁</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.editor}>
          {selectedSection && selectedField ? (
            <>
              <div className={styles.editorHeader}>
                <h2>
                  {sectionNames[selectedSection]} — {fieldNames[selectedField]}
                </h2>
              </div>

              <div className={styles.editorWrapper}>
                {isImg ? (
                  renderImageEditor()
                ) : isItems ? (
                  renderCertificadosEditor()
                ) : (
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
                )}
              </div>

              {/* Actions row — hidden for image and items editors (they have inline buttons) */}
              {!isImg && !isItems && (
                <div className={styles.editorActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <a
                    href={getPreviewUrl(selectedSection)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.previewButton}
                  >
                    Ver a Página
                  </a>
                </div>
              )}

              {(isImg || isItems) && (
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={getPreviewUrl(selectedSection)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.previewButton}
                  >
                    Ver a Página
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>Selecione uma seção e um campo para começar a editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
