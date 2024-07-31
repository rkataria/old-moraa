import { useEffect, useState } from 'react'

import ReactGoogleSlides from 'react-google-slides'

import { PageControls } from './PageControls'

export type GoogleSlideEmbedProps = {
  url: string
  showControls?: boolean
  startPage?: number
  onPageChange?: (pageNumber: number) => void
}

export function GoogleSlideEmbed({
  url,
  showControls,
  startPage = 1,
  onPageChange,
}: GoogleSlideEmbedProps) {
  const [currentPage, setCurrentPage] = useState<number>(startPage)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setCurrentPage(startPage)
  }, [startPage])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    onPageChange?.(pageNumber)
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        // <Skeleton className="absolute left-0 top-0 w-full h-full rounded-md" />
        <img
          src="/moraa-loader.gif"
          alt="moraa-loader"
          className="absolute left-0 top-0 w-full h-full rounded-md"
        />
      )}
      <ReactGoogleSlides
        width="100%"
        height="100%"
        slidesLink={url}
        position={currentPage}
        containerStyle={{ pointerEvents: 'none' }}
        className="rounded-md"
        onLoad={() => {
          setLoading(false)
        }}
      />

      {showControls && (
        <PageControls
          currentPage={currentPage}
          handleCurrentPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
