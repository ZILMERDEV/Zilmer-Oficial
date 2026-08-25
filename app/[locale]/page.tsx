import AreasAtuacao from '@/components/AreasAtuacao'
import XRaySection from '@/components/XRaySection'

/* Seção de Notícias desligada da home a pedido do cliente. O componente
   ProjetosRecentes e os dados em data/noticias*.json continuam intactos —
   para reativar, importe e reinsira <ProjetosRecentes /> abaixo de
   <XRaySection />. */

export default function Home() {
  return (
    <>
      <div id="areas">
        <AreasAtuacao />
      </div>
      <XRaySection />
    </>
  )
}
