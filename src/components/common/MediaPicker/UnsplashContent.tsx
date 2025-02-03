/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react'

import Masonry from 'react-responsive-masonry'
import { createApi, Orientation } from 'unsplash-js'
import { Basic } from 'unsplash-js/dist/methods/photos/types'

import { SearchInput } from './SearchInput'
import { ContentLoading } from '../ContentLoading'

import { Button } from '@/components/ui/Button'

const unsplashAPI = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
})

const DEFAULT_SEARCH_TEXT = 'creative'
const PER_PAGE_COUNT = 12

export function UnsplashContent({
  orientation = 'landscape',
  onSelect,
}: {
  orientation?: Orientation
  onSelect: (imageElment: HTMLImageElement) => void
}) {
  const [searchText, setSearchText] = useState<string>(DEFAULT_SEARCH_TEXT)
  const [images, setImages] = useState<Basic[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    unsplashAPI.search
      .getPhotos({
        query: searchText || DEFAULT_SEARCH_TEXT,
        page: currentPage,
        perPage: PER_PAGE_COUNT,
        orientation,
        orderBy: 'relevant',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((result) => {
        if (currentPage === 1) {
          setImages(result.response?.results || [])
        } else {
          setImages((prevImages) => [
            ...prevImages,
            ...(result.response?.results || []),
          ])
        }

        setTotalPages(result.response?.total_pages || 1)
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.')
      })
  }, [searchText, currentPage, orientation])

  const renderContent = () => {
    if (images.length === 0 && !error) {
      return <ContentLoading />
    }

    if (error) {
      return (
        <div className="h-full flex justify-center items-center">{error}</div>
      )
    }

    return (
      <>
        <Masonry columnsCount={2} gutter="1rem">
          {images.map((image) => (
            <div key={image.id} className="flex flex-col gap-1">
              <img
                src={image.urls.regular}
                className="rounded-md w-full block"
                alt=""
                crossOrigin="anonymous"
                id={image.id}
                onClick={() =>
                  onSelect(
                    document.getElementById(image.id) as HTMLImageElement
                  )
                }
              />
              <p>
                Photo by{' '}
                <a
                  href={`https://unsplash.com/@${image.user.username}`}
                  target="_blank"
                  rel="noreferrer">
                  {image.user.name}
                </a>
              </p>
            </div>
          ))}
        </Masonry>
        <div className="flex justify-center items-center">
          <Button
            size="sm"
            variant="light"
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1)
              }
            }}>
            Load more
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <SearchInput
        placeholder="Search Unsplash"
        debounce={700}
        onChange={setSearchText}
      />

      {renderContent()}
    </div>
  )
}
