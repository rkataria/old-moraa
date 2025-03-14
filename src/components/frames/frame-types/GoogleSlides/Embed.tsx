/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { PageControls } from '@/components/common/PageControls'

export type EmbedProps = {
  url: string
  showControls?: boolean
  startPage?: number
  onPageChange?: (pageNumber: number) => void
}

export function Embed({
  url,
  showControls,
  startPage = 1,
  onPageChange,
}: EmbedProps) {
  const [currentPage, setCurrentPage] = useState<number>(startPage)
  // const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setCurrentPage(startPage)
  }, [startPage])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    onPageChange?.(pageNumber)
  }

  return (
    <div className="relative w-full h-full">
      {/* {loading && (
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-md" />
      )} */}
      {/* TODO: FixAI */}
      {/* <ReactGoogleSlides
        width="100%"
        height="100%"
        slidesLink={url}
        position={currentPage}
        containerStyle={{ pointerEvents: 'none' }}
        className="rounded-md"
        onLoad={() => {
          setLoading(false)
        }}
      /> */}

      {showControls && (
        <PageControls
          currentPage={currentPage}
          handleCurrentPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
