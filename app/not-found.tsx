import {Link} from '@/i18n/routing';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#003366' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#666' }}>
        Página não encontrada
      </h2>
      <p style={{ marginBottom: '2rem', color: '#888' }}>
        A página que você está procurando não existe.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 2rem',
          background: '#6ba3f0',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        Voltar para Home
      </Link>
    </div>
  )
}












