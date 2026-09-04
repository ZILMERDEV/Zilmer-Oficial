import styles from './layout.module.css'
import IndiceInstrumentos from './IndiceInstrumentos'

// Envolve a página principal e as 16 páginas de categoria (tipo/uso/classe)
// com o índice lateral fixo. Por ser um layout do App Router, ele não
// remonta ao navegar entre categorias — só o conteúdo troca, o que é o que
// dá a sensação de navegação mais rápida.
export default function TransformadoresInstrumentosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <IndiceInstrumentos />
          </aside>
          <div className={styles.conteudo}>{children}</div>
        </div>
      </div>
    </div>
  )
}
