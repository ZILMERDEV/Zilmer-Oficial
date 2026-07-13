'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './ImageGallery.module.css'
import { cdnUrl } from '@/lib/assets'

type ImageGalleryProps = {
  images: string[]
  alt: string
  captions?: Record<string, string>
  firstImageIndex?: number
}

export default function ImageGallery({
  images,
  alt,
  captions = {},
  firstImageIndex = 0,
}: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null
  }

  const safeIndex =
    firstImageIndex >= 0 && firstImageIndex < images.length ? firstImageIndex : 0

  const [currentIndex, setCurrentIndex] = useState(safeIndex)

  const currentImage = images[currentIndex]
  const currentCaption = captions[currentImage] || ''

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleSelect = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageContainer}>
        {images.length > 1 && (
          <button
            type="button"
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Imagem anterior"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className={styles.imageWrapper}>
          <div className={styles.mainImage}>
            <Image
              src={cdnUrl(currentImage)}
              alt={alt}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          {currentCaption && (
            <div className={styles.caption}>{currentCaption}</div>
          )}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Próxima imagem"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              className={`${styles.thumbnail} ${
                index === currentIndex ? styles.active : ''
              }`}
              onClick={() => handleSelect(index)}
              aria-label={`Selecionar imagem ${index + 1}`}
            >
              <img
                src={cdnUrl(src)}
                alt={`${alt} - miniatura ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

