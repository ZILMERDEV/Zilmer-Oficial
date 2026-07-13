'use client'

import { useState } from 'react'
import ImageGallery from '@/components/ImageGallery'
import ContactButton from '@/components/ContactButton'
import styles from './page.module.css'
import { useLocale } from 'next-intl'
import produtosPt from '@/data/produtos.json'
import produtosEn from '@/data/produtos.en.json'
// @ts-ignore
import produtosEs from '@/data/produtos.es.json'

type Category = {
  id: string
  title: string
  description: string
  specifications: string[]
  images: string[]
  captions: { [key: string]: string }
  firstImageIndex?: number
}

function buildCategories(produtosData: typeof produtosPt): Category[] {
  const categoriasData = (produtosData.oleo as any)?.['transformadores-de-forca']?.categorias || {}
  return Object.keys(categoriasData).map((key) => {
    const categoria = categoriasData[key] as any
    return {
      id: key,
      title: categoria.title,
      description: categoria.description,
      specifications: categoria.specifications || [],
      images: categoria.images?.length
        ? categoria.images
        : categoria.image ? [categoria.image] : [],
      captions: categoria.captions || {},
      firstImageIndex: categoria.firstImageIndex ?? 0,
    }
  })
}

export default function TransformadoresDeForcaPage() {
  const locale = useLocale()
  const isEn = locale === 'en'

  const categories = buildCategories(locale === 'en' ? (produtosEn as typeof produtosPt) : locale === 'es' ? (produtosEs as typeof produtosPt) : produtosPt)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories.length > 0 ? categories[0] : null
  )

  if (categories.length === 0) {
    return (
      <section className={styles.page}>
        <div className="container">
          <h1>{locale === 'en' ? 'Power Transformers' : locale === 'es' ? 'Transformadores de Fuerza' : 'Transformadores de Força'}</h1>
          <p>{locale === 'en' ? 'No categories available.' : locale === 'es' ? 'No hay categorías disponibles.' : 'Nenhuma categoria disponível.'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <h1>{locale === 'en' ? 'Power Transformers' : locale === 'es' ? 'Transformadores de Fuerza' : 'Transformadores de Força'}</h1>

        <div className={styles.forcePageContent}>
          <div className={styles.categorySidebar}>
            <h2>{locale === 'en' ? 'Categories' : locale === 'es' ? 'Categorías' : 'Categorias'}</h2>
            <nav className={styles.categoryNav}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryItem} ${
                    selectedCategory && selectedCategory.id === category.id ? styles.activeCategory : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.title}
                </button>
              ))}
            </nav>
          </div>

          {selectedCategory ? (
            <div className={styles.categoryDetail}>
              <h2 className={styles.categoryTitle}>{selectedCategory.title}</h2>

              {selectedCategory.images.length > 0 && (
                <div className={styles.galleryWrapper}>
                  <ImageGallery
                    images={selectedCategory.images}
                    alt={selectedCategory.title}
                    captions={selectedCategory.captions}
                    firstImageIndex={selectedCategory.firstImageIndex}
                  />
                </div>
              )}

              <div className={styles.categoryDescription}>
                <p>{selectedCategory.description}</p>
              </div>

              <div className={styles.specifications}>
                <h3>{locale === 'en' ? 'Technical Specifications' : locale === 'es' ? 'Especificaciones Técnicas' : 'Especificações Técnicas'}</h3>
                <ul className={styles.specificationsList}>
                  {selectedCategory.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.contactButton}>
                <ContactButton />
              </div>
            </div>
          ) : (
            <div className={styles.categoryDetail}>
              <p>{locale === 'en' ? 'Select a category' : locale === 'es' ? 'Seleccione una categoría' : 'Selecione uma categoria'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}







