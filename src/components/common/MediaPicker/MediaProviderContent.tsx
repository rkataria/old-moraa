/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'

import { Orientation } from 'unsplash-js'

import { Icon8Content } from './Icon8Content'
import { ImageCropper } from './ImageCropper'
import { LibraryContent } from './LibraryContent'
import { UnsplashContent } from './UnsplashContent'

export enum MediaProviderType {
  LIBRARY = 'Library',
  UNSPLASH = 'Unsplash',
  ICON8 = 'Icon8',
}

export function MediaProviderContent({
  ImageOrientation,
  provider,
  fileType,
  crop,
  onSelectCallback,
}: {
  ImageOrientation?: Orientation
  provider: MediaProviderType
  fileType?: 'images' | 'videos'
  crop?: boolean
  onSelectCallback?: (imageElment: HTMLImageElement) => void
}) {
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  )

  const handleImageSelect = (imageElment: HTMLImageElement) => {
    if (crop && fileType === 'images') {
      setIsCropOpen(true)
      setSelectedImage(imageElment)

      return
    }

    onSelectCallback && onSelectCallback(imageElment)
  }

  if (isCropOpen && selectedImage) {
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
  const renderersByMediaProvider: Record<MediaProviderType, React.ReactNode> = {
    [MediaProviderType.LIBRARY]: <LibraryContent />,
    [MediaProviderType.UNSPLASH]: (
      <UnsplashContent
        orientation={ImageOrientation}
        onSelect={handleImageSelect}
      />
    ),
    [MediaProviderType.ICON8]: <Icon8Content />,
  }

  const renderer = renderersByMediaProvider[provider]

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto scrollbar-none">
      {renderer}
    </div>
  )
}
