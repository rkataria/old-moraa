import { useState } from 'react'

import { Slider, Tooltip } from '@nextui-org/react'
import Cropper, { Area } from 'react-easy-crop'
import { IoIosSquareOutline } from 'react-icons/io'
import { LuRectangleHorizontal, LuRectangleVertical } from 'react-icons/lu'

import { Button } from '@/components/ui/Button'
import getCroppedImg from '@/utils/crop-image'

export function ImageCropper({
  selectedImage,
  aspectRatio,
  onCrop,
  onError,
  onDiscard,
}: {
  selectedImage: HTMLImageElement
  aspectRatio?: number
  onCrop: (imageElment: HTMLImageElement) => void
  onError?: (error: Error) => void
  onDiscard: () => void
}) {
  const [croppedArea, setCroppedArea] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(
    aspectRatio || 1
  )
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }

  const handleCropDone = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      return
    }

    try {
      const imageData = await getCroppedImg({
        imageSrc: selectedImage.src!,
        pixelCrop: croppedAreaPixels!,
        rotation,
      })

      // Image
      const image = new Image()
      image.src = imageData as string
      image.onload = () => {
        onCrop(image)
      }
    } catch (e) {
      console.error(e)
      onError?.(e as Error)
    }
  }

  return (
    <div className="relative left-0 top-0 w-full h-full bg-white p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-md font-semibold">Crop Image</span>
        <div className="flex justify-end items-center gap-4">
          {aspectRatio ? null : (
            <>
              <Tooltip content="1:1">
                <Button
                  color="primary"
                  variant="light"
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(1)
                  }}>
                  <IoIosSquareOutline size={22} />
                </Button>
              </Tooltip>
              <Tooltip content="16:9">
                <Button
                  color="primary"
                  variant="light"
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(16 / 9)
                  }}>
                  <LuRectangleHorizontal size={22} />
                </Button>
              </Tooltip>
              <Tooltip content="9:16">
                <Button
                  color="primary"
                  variant="light"
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(9 / 16)
                  }}>
                  <LuRectangleVertical size={22} />
                </Button>
              </Tooltip>
            </>
          )}
          <Button color="primary" variant="light" onClick={onDiscard}>
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
          aspect={cropAspectRatio}
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
