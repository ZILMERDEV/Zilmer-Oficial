'use client'

import { useState, useEffect } from 'react'
import styles from '../page.module.css'

interface LocalizedText { pt: string; en: string; es: string }
interface XrayStat { number: string; label: LocalizedText }
interface XrayData {
  tagline: LocalizedText
  headline: LocalizedText
  accentWord: LocalizedText
  subtitle: LocalizedText
  stats: XrayStat[]
}

type TextGroup = 'tagline' | 'headline' | 'accentWord' | 'subtitle'
type StatGroup = 'stat0' | 'stat1' | 'stat2'
type Group = TextGroup | StatGroup

const GROUP_LABELS: Record<Group, string> = {
  tagline: 'Tagline',
  headline: 'Título Principal',
  accentWord: 'Palavra em Destaque',
  subtitle: 'Subtítulo',
  stat0: 'Estatística 1',
  stat1: 'Estatística 2',
  stat2: 'Estatística 3',
}

const TEXT_GROUPS: TextGroup[] = ['tagline', 'headline', 'accentWord', 'subtitle']
const STAT_GROUPS: StatGroup[] = ['stat0', 'stat1', 'stat2']
const ALL_GROUPS: Group[] = [...TEXT_GROUPS, ...STAT_GROUPS]

const LOCALE_LABELS: Record<keyof LocalizedText, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #dee2e6',
  borderRadius: '4px',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  lineHeight: '1.5',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
}

export default function XrayAdminPage() {
  const [draft, setDraft] = useState<XrayData | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group>('tagline')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/xray')
      if (res.ok) {
        setDraft(await res.json())
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const postField = async (field: string, value: unknown): Promise<XrayData> => {
    const res = await fetch('/api/admin/xray', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erro ao salvar')
    }
    return res.json()
  }

  const handleSave = async () => {
    if (!draft) return
    setLoading(true)
    setMessage(null)

    try {
      const fields: [string, unknown][] = []

      if ((TEXT_GROUPS as Group[]).includes(selectedGroup)) {
        const key = selectedGroup as TextGroup
        const text = draft[key]
        fields.push(
          [`${key}.pt`, text.pt],
          [`${key}.en`, text.en],
          [`${key}.es`, text.es],
        )
      } else {
        const idx = parseInt(selectedGroup.replace('stat', ''))
        const stat = draft.stats[idx]
        fields.push(
          [`stats.${idx}.number`, stat.number],
          [`stats.${idx}.label.pt`, stat.label.pt],
          [`stats.${idx}.label.en`, stat.label.en],
          [`stats.${idx}.label.es`, stat.label.es],
        )
      }

      let updated = draft
      for (const [field, value] of fields) {
        updated = await postField(field, value)
      }
      setDraft(updated)
      setMessage({ type: 'success', text: 'Conteúdo salvo com sucesso!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Erro ao salvar. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const updateText = (key: TextGroup, locale: keyof LocalizedText, value: string) => {
    setDraft(prev => prev ? { ...prev, [key]: { ...prev[key], [locale]: value } } : prev)
  }

  const updateStatNumber = (idx: number, value: string) => {
    setDraft(prev => {
      if (!prev) return prev
      const stats = prev.stats.map((s, i) => i === idx ? { ...s, number: value } : s)
      return { ...prev, stats }
    })
  }

  const updateStatLabel = (idx: number, locale: keyof LocalizedText, value: string) => {
    setDraft(prev => {
      if (!prev) return prev
      const stats = prev.stats.map((s, i) =>
        i === idx ? { ...s, label: { ...s.label, [locale]: value } } : s
      )
      return { ...prev, stats }
    })
  }

  const renderEditor = () => {
    if (!draft) return null

    if ((TEXT_GROUPS as Group[]).includes(selectedGroup)) {
      const key = selectedGroup as TextGroup
      const isLong = key === 'subtitle'

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(['pt', 'en', 'es'] as const).map(locale => (
            <label key={locale} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>
                {LOCALE_LABELS[locale]}
              </span>
              {isLong ? (
                <textarea
                  value={draft[key][locale]}
                  onChange={e => updateText(key, locale, e.target.value)}
                  style={textareaStyle}
                />
              ) : (
                <input
                  type="text"
                  value={draft[key][locale]}
                  onChange={e => updateText(key, locale, e.target.value)}
                  style={inputStyle}
                />
              )}
            </label>
          ))}
        </div>
      )
    }

    const idx = parseInt(selectedGroup.replace('stat', ''))
    const stat = draft.stats[idx]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>Número / Sigla</span>
          <input
            type="text"
            value={stat.number}
            onChange={e => updateStatNumber(idx, e.target.value)}
            style={{ ...inputStyle, maxWidth: '160px' }}
          />
        </label>
        {(['pt', 'en', 'es'] as const).map(locale => (
          <label key={locale} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>
              Label — {LOCALE_LABELS[locale]}
            </span>
            <input
              type="text"
              value={stat.label[locale]}
              onChange={e => updateStatLabel(idx, locale, e.target.value)}
              style={inputStyle}
            />
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Editor de Conteúdo — Seção X-Ray</h1>
        <p>Edite os textos da seção de Engenharia de Precisão na homepage</p>
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
          <h2>Selecione o Campo</h2>
          <div className={styles.fieldList}>
            {ALL_GROUPS.map(group => (
              <button
                key={group}
                className={`${styles.fieldButton} ${selectedGroup === group ? styles.active : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                {GROUP_LABELS[group]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editor}>
          {draft ? (
            <>
              <div className={styles.editorHeader}>
                <h2>{GROUP_LABELS[selectedGroup]}</h2>
              </div>
              <div className={styles.editorWrapper}>
                {renderEditor()}
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
                  Ver na Homepage
                </a>
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>Carregando dados...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
