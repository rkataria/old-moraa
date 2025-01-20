/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'

import { Orientation } from 'unsplash-js'

import { GiphyContent } from './GiphyContent'
import { Icon8Content } from './Icon8Content'
import { ImageCropper } from './ImageCropper'
import { LibraryContent } from './LibraryContent'
import { UnsplashContent } from './UnsplashContent'
import { MediaTypeNames } from '../Library/MediaLibrary'

export enum MediaProviderType {
  LIBRARY = 'Library',
  UNSPLASH = 'Unsplash',
  ICON8 = 'Icon8',
  GIPHY = 'Giphy',
}
type FileTypes = 'images' | 'videos'
type MediaProviderContentProps = {
  ImageOrientation?: Orientation
  provider: MediaProviderType
  fileType?: FileTypes
  crop?: boolean
  onSelectCallback?: (imageElment: HTMLImageElement) => void
}

export function MediaProviderContent({
  ImageOrientation,
  provider,
  fileType,
  crop,
  onSelectCallback,
}: MediaProviderContentProps) {
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  )

  const showCropper = isCropOpen && selectedImage

  const handleImageSelect = (imageElment: HTMLImageElement) => {
    if (crop && fileType === 'images') {
      setIsCropOpen(true)
      setSelectedImage(imageElment)

      return
    }

    onSelectCallback && onSelectCallback(imageElment)
  }

  if (showCropper) {
    return (
      <ImageCropper
        selectedImage={selectedImage}
        onCrop={(element) => onSelectCallback?.(element)}
        onDiscard={() => {
          setIsCropOpen(false)
          setSelectedImage(null)
        }}
        onError={(error) => {
          console.error(error)
        }}
      />
    )
  }

  const fileTypeToMediaTypeMap: Record<FileTypes, MediaTypeNames> = {
    images: MediaTypeNames.Image,
    videos: MediaTypeNames.Video,
  }

  const renderersByMediaProvider: Record<MediaProviderType, React.ReactNode> = {
    [MediaProviderType.LIBRARY]: (
      <LibraryContent
        mediaType={fileTypeToMediaTypeMap[fileType!]}
        onSelect={handleImageSelect}
      />
    ),
    [MediaProviderType.UNSPLASH]: (
      <UnsplashContent
        orientation={ImageOrientation}
        onSelect={handleImageSelect}
      />
    ),
    [MediaProviderType.ICON8]: <Icon8Content />,
    [MediaProviderType.GIPHY]: (
      <GiphyContent onImageSelect={handleImageSelect} />
    ),
  }

  const renderer = renderersByMediaProvider[provider]

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto scrollbar-none">
      {renderer}
    </div>
  )
}
