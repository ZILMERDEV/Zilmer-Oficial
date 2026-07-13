'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'
import { cdnUrl } from '@/lib/assets'

const IMAGE_FIELDS = new Set(['aplicacao.image', 'aplicacao.heroImage'])

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

interface AreaData {
  title: string
  aplicacao: {
    title: string
    description: string
    onde?: string
    como?: string
    image: string
    heroImage: string
    heroDescription: string
  }
  solucao: {
    title: string
    problem: string
    melhora: string
    essencial: string
  }
  projetos: Array<{
    title: string
    description: string
    image: string
  }>
}

interface AreasData {
  [key: string]: AreaData
}

export default function AdminPage() {
  const [areasData, setAreasData] = useState<AreasData>({})
  const [selectedArea, setSelectedArea] = useState<string>('')
  const [selectedField, setSelectedField] = useState<string>('')
  const [editedValue, setEditedValue] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    loadAreasData()
  }, [])

  const loadAreasData = async () => {
    try {
      const response = await fetch('/api/admin/areas')
      if (response.ok) {
        const data = await response.json()
        setAreasData(data)
        if (Object.keys(data).length > 0 && !selectedArea) {
          setSelectedArea(Object.keys(data)[0])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSave = async () => {
    if (!selectedArea || !selectedField) return

    setLoading(true)
    setMessage(null)

    try {
      let valueToSave: string | string[] = stripHtml(editedValue)

      if (selectedField === 'aplicacao.imageCaptions') {
        valueToSave = stripHtml(editedValue).split('\n').filter((line: string) => line.trim() !== '')
      }

      const response = await fetch('/api/admin/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          area: selectedArea,
          field: selectedField,
          value: valueToSave,
        }),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setAreasData(updatedData)
        showMessage('success', 'Texto salvo com sucesso!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Erro ao salvar. Tente novamente.'
        showMessage('error', errorMessage)
        console.error('Erro ao salvar:', errorData)
      }
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      showMessage('error', error?.message || 'Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldSelect = (field: string) => {
    setSelectedField(field)
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (selectedArea && areasData[selectedArea]) {
      const area = areasData[selectedArea]
      let value = ''

      if (IMAGE_FIELDS.has(field)) {
        value = (area.aplicacao as any)[field.split('.')[1]] || ''
        setEditedValue(value)
        return
      }

      if (field === 'aplicacao.description') {
        value = stripHtml(area.aplicacao.description)
      } else if (field === 'aplicacao.title') {
        value = stripHtml(area.aplicacao.title)
      } else if (field === 'aplicacao.heroDescription') {
        value = stripHtml(area.aplicacao.heroDescription)
      } else if (field === 'aplicacao.imageCaption') {
        value = (area.aplicacao as any).imageCaption || ''
      } else if (field === 'aplicacao.imageCaptions') {
        // Se for array, converter para string separada por quebras de linha e remover HTML
        const captions = (area.aplicacao as any).imageCaptions || []
        if (Array.isArray(captions)) {
          value = captions.map((cap: string) => 
            typeof cap === 'string' ? cap.replace(/<[^>]*>/g, '').trim() : cap
          ).join('\n')
        } else {
          value = ''
        }
      } else if (field === 'cta.title') {
        value = (area as any).cta?.title || 'Interessado em nossas soluções?'
      } else if (field === 'cta.text') {
        value = (area as any).cta?.text || 'Entre em contato e descubra como podemos ajudar seu projeto'
      } else if (field === 'solucao.problem') {
        value = area.solucao.problem
      } else if (field === 'solucao.melhora') {
        value = area.solucao.melhora
      } else if (field === 'solucao.essencial') {
        value = area.solucao.essencial
      }
      
      setEditedValue(value)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImageUpload = async () => {
    if (!selectedFile || !selectedArea || !selectedField) return
    setUploadLoading(true)
    setMessage(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('area', selectedArea)

      const uploadRes = await fetch('/api/admin/areas/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || 'Erro no upload')
      const { path } = await uploadRes.json()

      const saveRes = await fetch('/api/admin/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: selectedArea, field: selectedField, value: path }),
      })
      if (!saveRes.ok) throw new Error('Erro ao salvar caminho')
      const updated = await saveRes.json()
      setAreasData(updated)
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

  const renderImageEditor = () => {
    const currentPath: string = editedValue || ''
    const label = selectedField === 'aplicacao.heroImage' ? 'Hero (fundo da página)' : 'Imagem da seção de aplicação'

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ padding: '1.25rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#003366', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>Imagem Atual — {label}</h3>
          {currentPath ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '280px', background: '#e9ecef', borderRadius: '6px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPath}
                  alt="Imagem atual"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).src = cdnUrl(currentPath) }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: 0, wordBreak: 'break-all', background: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #dee2e6', maxWidth: '520px' }}>
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

  const areaNames: { [key: string]: string } = {
    transporte: 'Transporte',
    hidreletrica: 'Hidrelétrica',
    mineracao: 'Mineração',
    subestacoes: 'Subestações',
    'energias-renovaveis': 'Energias Renováveis',
    'controle-medicao': 'Controle e Medição',
  }

  const fieldNames: { [key: string]: string } = {
    'aplicacao.image': 'Imagem da Aplicação',
    'aplicacao.heroImage': 'Imagem do Hero',
    'aplicacao.title': 'Título da Aplicação',
    'aplicacao.description': 'Descrição da Aplicação',
    'aplicacao.heroDescription': 'Descrição do Hero',
    'aplicacao.imageCaption': 'Legenda da Imagem Principal',
    'aplicacao.imageCaptions': 'Legendas das Imagens (Array)',
    'cta.title': 'CTA - Título',
    'cta.text': 'CTA - Texto',
    'solucao.problem': 'O Problema',
    'solucao.melhora': 'Como Melhora',
    'solucao.essencial': 'Por que é Essencial',
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Editor de Conteúdo - Áreas</h1>
        <p>Edite os textos das páginas de áreas diretamente aqui</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/admin/sobre" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            → Editar páginas de Sobre
          </a>
          {' | '}
          <a href="/admin/produtos" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            → Editar páginas de Produtos
          </a>
          {' | '}
          <a href="/admin/noticias" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            → Editar Notícias
          </a>
          {' | '}
          <a href="/admin/xray" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            → Editar Seção X-Ray
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
          <h2>Selecione a Área</h2>
          <div className={styles.areaList}>
            {Object.keys(areasData).map((key) => (
              <button
                key={key}
                className={`${styles.areaButton} ${selectedArea === key ? styles.active : ''}`}
                onClick={() => {
                  setSelectedArea(key)
                  setSelectedField('')
                  setEditedValue('')
                }}
              >
                {areaNames[key] || key}
              </button>
            ))}
          </div>

          {selectedArea && (
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
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.editor}>
          {selectedArea && selectedField ? (
            <>
              <div className={styles.editorHeader}>
                <h2>
                  {areaNames[selectedArea]} - {fieldNames[selectedField]}
                </h2>
              </div>
              <div className={styles.editorWrapper}>
                {IMAGE_FIELDS.has(selectedField) ? (
                  renderImageEditor()
                ) : (
                  <textarea
                    value={editedValue || ''}
                    onChange={(e) => setEditedValue(e.target.value)}
                    placeholder={selectedField === 'aplicacao.imageCaptions'
                      ? 'Digite uma legenda por linha.'
                      : 'Digite o texto aqui...'}
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
              {IMAGE_FIELDS.has(selectedField) ? (
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={`/${selectedArea}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.previewButton}
                  >
                    Ver a Página
                  </a>
                </div>
              ) : (
                <div className={styles.editorActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <a
                    href={`/${selectedArea}`}
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
              <p>Selecione uma área e um campo para começar a editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

