import AreasAtuacao from '@/components/AreasAtuacao'
import XRaySection from '@/components/XRaySection'
import ProjetosRecentes from '@/components/ProjetosRecentes'

export default function Home() {
  return (
    <>
      <div id="areas">
        <AreasAtuacao />
      </div>
      <XRaySection />
      <ProjetosRecentes />
    </>
  )
}
