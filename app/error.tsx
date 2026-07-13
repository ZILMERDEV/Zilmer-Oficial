'use client'

import { useEffect } from 'react'
import {Link} from '@/i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erro:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#003366' }}>
        Algo deu errado!
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Ocorreu um erro ao carregar a página. Por favor, tente novamente.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            background: '#6ba3f0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Tentar Novamente
        </button>
        <Link
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: '#f0f0f0',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}

