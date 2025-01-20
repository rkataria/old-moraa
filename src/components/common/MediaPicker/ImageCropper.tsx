import { useState } from 'react'

import { Slider, Tooltip } from '@nextui-org/react'
import Cropper, { Area } from 'react-easy-crop'
import { CiNoWaitingSign } from 'react-icons/ci'
import { HiOutlineArrowSmallLeft } from 'react-icons/hi2'
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

  const defaultAspectRatio = selectedImage.width / selectedImage.height

  return (
    <div className="relative left-0 top-0 w-full h-full bg-white flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-1">
          <Button
            isIconOnly
            color="default"
            variant="light"
            onClick={onDiscard}>
            <HiOutlineArrowSmallLeft size={18} />
          </Button>
          <span className="text-md font-semibold">Crop Image</span>
        </div>
        <div className="flex justify-end items-center gap-4">
          {aspectRatio ? null : (
            <>
              <Tooltip content="Reset">
                <Button
                  color="default"
                  variant="light"
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(undefined)
                  }}>
                  <CiNoWaitingSign size={22} />
                </Button>
              </Tooltip>
              <Tooltip content="1:1">
                <Button
                  color="default"
                  variant={cropAspectRatio === 1 ? 'flat' : 'light'}
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(1)
                  }}>
                  <IoIosSquareOutline size={22} />
                </Button>
              </Tooltip>
              <Tooltip content="16:9">
                <Button
                  color="default"
                  variant={cropAspectRatio === 16 / 9 ? 'flat' : 'light'}
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(16 / 9)
                  }}>
                  <LuRectangleHorizontal size={22} />
                </Button>
              </Tooltip>
              <Tooltip content="9:16">
                <Button
                  color="default"
                  variant={cropAspectRatio === 9 / 16 ? 'flat' : 'light'}
                  isIconOnly
                  onClick={() => {
                    setCropAspectRatio(9 / 16)
                  }}>
                  <LuRectangleVertical size={22} />
                </Button>
              </Tooltip>
            </>
          )}

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
          aspect={cropAspectRatio || defaultAspectRatio}
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
