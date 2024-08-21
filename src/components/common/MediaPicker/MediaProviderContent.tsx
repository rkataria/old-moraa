/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'

import { Slider } from '@nextui-org/react'
import Cropper, { Area } from 'react-easy-crop'

import { Icon8Content } from './Icon8Content'
import { LibraryContent } from './LibraryContent'
import { UnsplashContent } from './UnsplashContent'

import { Button } from '@/components/ui/Button'
import getCroppedImg from '@/utils/crop-image'

export enum MediaProviderType {
  LIBRARY = 'Library',
  UNSPLASH = 'Unsplash',
  ICON8 = 'Icon8',
}

export function MediaProviderContent({
  provider,
  fileType,
  crop,
  onSelectCallback,
}: {
  provider: MediaProviderType
  fileType?: 'images' | 'videos'
  crop?: boolean
  onSelectCallback?: (imageElment: HTMLImageElement) => void
}) {
  const [croppedArea, setCroppedArea] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
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

  const onCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }

  const handleCropDone = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      return
    }

    try {
      const imageData = await getCroppedImg(
        selectedImage.src!,
        croppedAreaPixels!,
        rotation
      )
      setIsCropOpen(false)
      setSelectedImage(null)

      // Image
      const img = new Image()
      img.src = imageData as string
      img.onload = () => {
        onSelectCallback && onSelectCallback(img)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (isCropOpen && selectedImage) {
    return (
      <div className="relative left-0 top-0 w-full h-full bg-white p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-md font-semibold">Crop Image</span>
          <div className="flex justify-end items-center gap-4">
            <Button
              color="primary"
              variant="light"
              onClick={() => {
                setIsCropOpen(false)
                setSelectedImage(null)
              }}>
              Discard
            </Button>
            <Button color="primary" onClick={handleCropDone}>
              Done
            </Button>
          </div>
        </div>
        <div className="relative p-4 flex-grow rounded-md overflow-hidden">
          <Cropper
            image={selectedImage.src}
            crop={croppedArea}
            rotation={rotation}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCroppedArea}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Slider
            label="Zoom"
            size="sm"
            step={0.1}
            maxValue={3}
            minValue={1}
            defaultValue={1}
            onChange={(value) => setZoom(value as number)}
          />
          <Slider
            label="Rotation"
            size="sm"
            step={1}
            maxValue={360}
            minValue={0}
            defaultValue={0}
            onChange={(value) => setRotation(value as number)}
          />
        </div>
      </div>
    )
  }
  const renderersByMediaProvider: Record<MediaProviderType, React.ReactNode> = {
    [MediaProviderType.LIBRARY]: <LibraryContent />,
    [MediaProviderType.UNSPLASH]: (
      <UnsplashContent onSelect={handleImageSelect} />
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
