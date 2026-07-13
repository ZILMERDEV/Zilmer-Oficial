'use client'

import { useState, useEffect } from 'react'
import styles from '../page.module.css'

interface NoticiaItem {
  id: string
  title: string
  description: string
  image: string
  slug: string
}

interface NoticiasData {
  section: {
    title: string
    subtitle: string
  }
  items: NoticiaItem[]
}

type SelectedPanel = 'section' | `item-${number}`

export default function AdminNoticiasPage() {
  const [data, setData] = useState<NoticiasData | null>(null)
  const [selectedPanel, setSelectedPanel] = useState<SelectedPanel>('section')
  const [selectedField, setSelectedField] = useState<string>('')
  const [editedValue, setEditedValue] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/noticias')
      if (res.ok) {
        setData(await res.json())
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSave = async () => {
    if (!selectedField || !data) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: selectedField, value: editedValue }),
      })

      if (res.ok) {
        setData(await res.json())
        showMessage('success', 'Salvo com sucesso!')
      } else {
        const err = await res.json().catch(() => ({}))
        showMessage('error', err.error || 'Erro ao salvar.')
      }
    } catch {
      showMessage('error', 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addItem' }),
      })
      if (res.ok) {
        const updated: NoticiasData = await res.json()
        setData(updated)
        const newIndex = updated.items.length - 1
        setSelectedPanel(`item-${newIndex}`)
        setSelectedField('')
        setEditedValue('')
        showMessage('success', 'Item adicionado!')
      }
    } catch {
      showMessage('error', 'Erro ao adicionar item.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveItem = async (index: number) => {
    if (!confirm('Remover esta notícia?')) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'removeItem', index }),
      })
      if (res.ok) {
        setData(await res.json())
        setSelectedPanel('section')
        setSelectedField('')
        setEditedValue('')
        showMessage('success', 'Item removido!')
      }
    } catch {
      showMessage('error', 'Erro ao remover item.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleFieldSelect = (field: string) => {
    if (!data) return
    setSelectedField(field)

    const path = field.split('.')
    let target: any = data
    for (const key of path) {
      if (target === undefined || target === null) { target = ''; break }
      target = !isNaN(Number(key)) ? target[Number(key)] : target[key]
    }

    setEditedValue(typeof target === 'string' ? target : '')
  }

  const sectionFields: Record<string, string> = {
    'section.subtitle': 'Subtítulo da Seção',
  }

  const itemFields: Record<string, string> = {
    title: 'Título',
    description: 'Descrição',
    image: 'Caminho da Imagem',
    slug: 'Slug (URL)',
  }

  const getItemFieldPath = (field: string) => {
    if (selectedPanel === 'section') return field
    const idx = selectedPanel.replace('item-', '')
    return `items.${idx}.${field}`
  }

  const isItemPanel = selectedPanel !== 'section'
  const itemIndex = isItemPanel ? Number(selectedPanel.replace('item-', '')) : -1

  const fieldLabel = () => {
    if (selectedPanel === 'section') return sectionFields[selectedField] || selectedField
    const base = selectedField.split('.').pop() || ''
    return itemFields[base] || base
  }

  const isSingleLineField = selectedField.endsWith('.image') || selectedField.endsWith('.slug') ||
    selectedField.endsWith('.title')

  if (!data) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.placeholder}><p>Carregando dados...</p></div>
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Editor de Conteúdo - Notícias</h1>
        <p>Edite os textos e itens da seção de Notícias da página inicial</p>
        <div style={{ marginTop: '0.5rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#6ba3f0', textDecoration: 'none', fontWeight: 600 }}>
            → Ver página inicial
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
          <h2>Seção</h2>
          <div className={styles.areaList}>
            <button
              className={`${styles.areaButton} ${selectedPanel === 'section' ? styles.active : ''}`}
              onClick={() => { setSelectedPanel('section'); setSelectedField(''); setEditedValue('') }}
            >
              Título &amp; Subtítulo
            </button>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Itens</h2>
          <div className={styles.areaList}>
            {data.items.map((item, idx) => (
              <div key={item.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  className={`${styles.areaButton} ${selectedPanel === `item-${idx}` ? styles.active : ''}`}
                  style={{ flex: 1, textAlign: 'left' }}
                  onClick={() => { setSelectedPanel(`item-${idx}`); setSelectedField(''); setEditedValue('') }}
                >
                  {item.title || `Item ${idx + 1}`}
                </button>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  disabled={actionLoading}
                  title="Remover"
                  style={{
                    background: 'transparent',
                    border: '1px solid #e74c3c',
                    color: '#e74c3c',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddItem}
            disabled={actionLoading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '8px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            + Adicionar Notícia
          </button>

          {(selectedPanel !== 'section' || Object.keys(sectionFields).length > 0) && (
            <>
              <h2 style={{ marginTop: '2rem' }}>Campos</h2>
              <div className={styles.fieldList}>
                {selectedPanel === 'section'
                  ? Object.entries(sectionFields).map(([field, label]) => (
                      <button
                        key={field}
                        className={`${styles.fieldButton} ${selectedField === field ? styles.active : ''}`}
                        onClick={() => handleFieldSelect(field)}
                      >
                        {label}
                      </button>
                    ))
                  : Object.entries(itemFields).map(([base, label]) => {
                      const field = getItemFieldPath(base)
                      return (
                        <button
                          key={field}
                          className={`${styles.fieldButton} ${selectedField === field ? styles.active : ''}`}
                          onClick={() => handleFieldSelect(field)}
                        >
                          {label}
                        </button>
                      )
                    })
                }
              </div>
            </>
          )}
        </div>

        <div className={styles.editor}>
          {selectedField ? (
            <>
              <div className={styles.editorHeader}>
                <h2>
                  {isItemPanel ? `Item ${itemIndex + 1}` : 'Seção'} — {fieldLabel()}
                </h2>
                {(selectedField.endsWith('.image')) && (
                  <p style={{ color: '#888', fontSize: '0.875rem', margin: '4px 0 0' }}>
                    Caminho relativo à pasta <code>public/</code>, ex: <code>/images/projetos/projeto-1.jpeg</code>
                  </p>
                )}
                {(selectedField.endsWith('.slug')) && (
                  <p style={{ color: '#888', fontSize: '0.875rem', margin: '4px 0 0' }}>
                    Identificador na URL (sem espaços ou acentos), ex: <code>projeto-hidreletrica</code>
                  </p>
                )}
              </div>
              <div className={styles.editorWrapper}>
                {isSingleLineField ? (
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <textarea
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    placeholder="Digite o texto aqui..."
                    style={{
                      width: '100%',
                      minHeight: '160px',
                      padding: '10px 14px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
              <div className={styles.editorActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewButton}
                >
                  Ver a Página
                </a>
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>Selecione um campo na barra lateral para começar a editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
