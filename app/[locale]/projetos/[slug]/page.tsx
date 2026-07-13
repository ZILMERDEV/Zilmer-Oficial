'use client'

import { use } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import styles from './page.module.css'
import { useLocale } from 'next-intl'
import { cdnUrl } from '@/lib/assets'

interface Noticia {
  id: string
  title: string
  description: string
  image: string
  slug: string
  content: string
  date: string
}

const noticiasPt: Noticia[] = [
  {
    id: '1',
    title: 'Projeto em Operação - Hidrelétrica',
    description: 'Transformadores de força para sistema de geração de energia hidrelétrica continuam operando com máxima eficiência e confiabilidade.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
    content: `
      <p>Nossos transformadores de força instalados na usina hidrelétrica continuam operando com excelência, garantindo o fornecimento estável de energia elétrica para a região.</p>
      <p>O projeto, que foi implementado há dois anos, demonstra a robustez e confiabilidade dos nossos equipamentos em condições de operação contínua. Os transformadores foram projetados especificamente para atender às demandas de alta potência do sistema de geração.</p>
      <p>Com monitoramento constante e manutenção preventiva, os equipamentos mantêm seus parâmetros de desempenho dentro das especificações técnicas, garantindo eficiência energética e segurança operacional.</p>
    `,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Novo Projeto Aplicado - Subestação Industrial',
    description: 'Solução completa em transformadores para subestação de grande porte recém-instalada e em fase de testes.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
    content: `
      <p>Acabamos de concluir a instalação de uma solução completa em transformadores para uma subestação industrial de grande porte. O projeto representa um marco importante na expansão da infraestrutura elétrica da região.</p>
      <p>Os transformadores foram customizados para atender às necessidades específicas do cliente, incluindo requisitos de alta tensão e capacidade de carga. A instalação foi realizada por nossa equipe técnica especializada, seguindo rigorosos protocolos de segurança.</p>
      <p>Atualmente, os equipamentos estão em fase de testes e comissionamento, com previsão de entrada em operação comercial nas próximas semanas.</p>
    `,
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Projeto em Operação - Mineração',
    description: 'Transformadores robustos para operação em ambiente de mineração mantendo alta performance e durabilidade.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
    content: `
      <p>Nossos transformadores instalados em operações de mineração continuam demonstrando sua capacidade de resistir a condições extremas de operação. Projetados especificamente para ambientes industriais desafiadores, os equipamentos mantêm alta performance mesmo sob condições severas.</p>
      <p>A robustez dos transformadores é essencial neste tipo de aplicação, onde a confiabilidade é crítica para manter a produção. Nossos equipamentos foram testados e aprovados para operação em ambientes com alta umidade, variações de temperatura e exposição a partículas.</p>
      <p>O projeto tem sido um sucesso, com os transformadores operando sem interrupções e mantendo todos os parâmetros dentro das especificações técnicas.</p>
    `,
    date: '2024-01-10',
  },
]

const noticiasEs: Noticia[] = [
  {
    id: '1',
    title: 'Proyecto en Operación – Hidroeléctrica',
    description: 'Los transformadores de fuerza para un sistema de generación de energía hidroeléctrica continúan operando con máxima eficiencia y confiabilidad.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
    content: `
      <p>Nuestros transformadores de fuerza instalados en la central hidroeléctrica continúan operando con excelencia, garantizando el suministro estable de energía eléctrica a la región.</p>
      <p>El proyecto, implementado hace dos años, demuestra la robustez y confiabilidad de nuestros equipos en condiciones de operación continua. Los transformadores fueron diseñados específicamente para satisfacer las demandas de alta potencia del sistema de generación.</p>
      <p>Con monitoreo constante y mantenimiento preventivo, los equipos mantienen sus parámetros de rendimiento dentro de las especificaciones técnicas, garantizando eficiencia energética y seguridad operacional.</p>
    `,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Nuevo Proyecto Aplicado – Subestación Industrial',
    description: 'Solución integral en transformadores para una subestación de gran envergadura recientemente instalada y en fase de puesta en servicio.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
    content: `
      <p>Acabamos de concluir la instalación de una solución integral en transformadores para una subestación industrial de gran envergadura. El proyecto representa un hito importante en la expansión de la infraestructura eléctrica de la región.</p>
      <p>Los transformadores fueron adaptados para satisfacer los requisitos específicos del cliente, incluyendo exigencias de alta tensión y capacidad de carga. La instalación fue realizada por nuestro equipo técnico especializado, siguiendo rigurosos protocolos de seguridad.</p>
      <p>Actualmente, los equipos se encuentran en fase de pruebas y puesta en servicio, con previsión de entrada en operación comercial en las próximas semanas.</p>
    `,
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Proyecto en Operación – Minería',
    description: 'Transformadores robustos para operación en entorno minero, manteniendo alto rendimiento y durabilidad.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
    content: `
      <p>Nuestros transformadores instalados en operaciones mineras continúan demostrando su capacidad para resistir condiciones de operación extremas. Diseñados específicamente para entornos industriales exigentes, los equipos mantienen alto rendimiento incluso bajo condiciones severas.</p>
      <p>La robustez de los transformadores es esencial en este tipo de aplicación, donde la confiabilidad es crítica para mantener la producción. Nuestros equipos han sido probados y aprobados para operación en entornos con alta humedad, variaciones de temperatura y exposición a partículas.</p>
      <p>El proyecto ha sido un éxito, con los transformadores operando sin interrupciones y manteniendo todos los parámetros dentro de las especificaciones técnicas.</p>
    `,
    date: '2024-01-10',
  },
]

const noticiasEn: Noticia[] = [
  {
    id: '1',
    title: 'Project in Operation – Hydropower',
    description: 'Power transformers for a hydropower generation system continue operating with maximum efficiency and reliability.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-hidreletrica',
    content: `
      <p>Our power transformers installed at the hydropower plant continue operating with excellence, ensuring stable supply of electrical energy to the region.</p>
      <p>The project, implemented two years ago, demonstrates the robustness and reliability of our equipment under continuous operating conditions. The transformers were designed specifically to meet the high-power demands of the generation system.</p>
      <p>With constant monitoring and preventive maintenance, the equipment maintains its performance parameters within the technical specifications, ensuring energy efficiency and operational safety.</p>
    `,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'New Applied Project – Industrial Substation',
    description: 'Complete transformer solution for a large-scale substation recently installed and under commissioning.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-subestacao',
    content: `
      <p>We have just completed the installation of a complete transformer solution for a large-scale industrial substation. The project represents an important milestone in the expansion of the region's electrical infrastructure.</p>
      <p>The transformers were customised to meet the client's specific requirements, including high-voltage and load-capacity specifications. Installation was carried out by our specialised technical team, following rigorous safety protocols.</p>
      <p>The equipment is currently undergoing testing and commissioning, with commercial operation expected within the coming weeks.</p>
    `,
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Project in Operation – Mining',
    description: 'Robust transformers for operation in a mining environment, maintaining high performance and durability.',
    image: '/images/projetos/projeto-1.jpeg',
    slug: 'projeto-mineracao',
    content: `
      <p>Our transformers installed in mining operations continue to demonstrate their capacity to withstand extreme operating conditions. Designed specifically for challenging industrial environments, the equipment maintains high performance even under severe conditions.</p>
      <p>The robustness of the transformers is essential in this type of application, where reliability is critical to maintaining production. Our equipment has been tested and approved for operation in environments with high humidity, temperature variations and particle exposure.</p>
      <p>The project has been a success, with the transformers operating without interruption and maintaining all parameters within the technical specifications.</p>
    `,
    date: '2024-01-10',
  },
]

export default function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const locale = useLocale()
  const isEn = locale === 'en'
  const noticias = locale === 'en' ? noticiasEn : locale === 'es' ? noticiasEs : noticiasPt
  const noticia = noticias.find((n) => n.slug === slug)

  if (!noticia) {
    return (
      <section className={styles.page}>
        <div className="container">
          <Link href="/" className={styles.backLink}>
            {locale === 'en' ? '← Back to Home' : locale === 'es' ? '← Volver al inicio' : '← Voltar para Home'}
          </Link>
          <div className={styles.article}>
            <h1 className={styles.title}>{locale === 'en' ? 'Article not found' : locale === 'es' ? 'Artículo no encontrado' : 'Notícia não encontrada'}</h1>
            <p>{locale === 'en' ? 'The article you are looking for does not exist.' : locale === 'es' ? 'El artículo que busca no existe.' : 'A notícia que você está procurando não existe.'}</p>
          </div>
        </div>
      </section>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'en' ? 'en-GB' : locale === 'es' ? 'es-ES' : 'pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          {locale === 'en' ? '← Back to Home' : locale === 'es' ? '← Volver al inicio' : '← Voltar para Home'}
        </Link>

        <article className={styles.article}>
          <div className={styles.header}>
            <h1 className={styles.title}>{noticia.title}</h1>
            <time className={styles.date}>{formatDate(noticia.date)}</time>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={cdnUrl(noticia.image)}
              alt={noticia.title}
              fill
              className={styles.image}
              sizes="100vw"
              priority
            />
          </div>

          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: noticia.content }}
          />
        </article>
      </div>
    </section>
  )
}

