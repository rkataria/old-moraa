import { useEffect, useState } from 'react'

import { Image } from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'
import Draggable from 'react-draggable'

import { useEventContext } from '@/contexts/EventContext'
import { cn } from '@/utils/utils'

interface IImageConfig {
  url: string
  position: 'left' | 'right'
}

export function SideImageLayout({
  children,
  imageConfig,
}: {
  children: ReactNode
  imageConfig?: IImageConfig | object
}) {
  const { eventMode, preview, updateFrame, currentFrame } = useEventContext()

  const isEditable = eventMode === 'edit' && !preview
  const [position, setPosition] = useState(
    currentFrame?.config?.sideImageLayout?.position
  )
  const [fetchedImage, setFetchedImage] = useState<string | null>(null) // State to store the fetched image URL
  const [imageType, setImageType] = useState<string | null>(null) // State to store image type

  // Fetch the image whenever the URL changes
  useEffect(() => {
    if (!imageConfig || !('url' in imageConfig)) {
      setFetchedImage(null)
      setImageType(null)

      return
    }

    const fetchImage = async () => {
      try {
        const response = await fetch(imageConfig.url, { method: 'GET' })
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)

        setFetchedImage(objectURL) // Set the fetched image URL
        setImageType(blob.type) // Set the image MIME type
      } catch (error) {
        console.error('Error fetching the image:', error)
      }
    }

    fetchImage()
  }, [imageConfig])

  useEffect(() => {
    if (!fetchedImage) return () => null

    return () => URL.revokeObjectURL(fetchedImage)
  }, [fetchedImage])

  if (!imageConfig || !('url' in imageConfig)) {
    return children
  }

  const LeftChild = imageConfig.position === 'left' ? null : children
  const RightChild = imageConfig.position === 'left' ? children : null

  const onSave = () => {
    if (!currentFrame) return

    updateFrame({
      framePayload: {
        config: {
          ...(currentFrame.config as object),
          sideImageLayout: { position },
        },
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <div
      className={cn('grid h-full gap-16', {
        'grid-cols-[0.6fr_0.4fr]': LeftChild,
        'grid-cols-[0.4fr_0.6fr]': RightChild,
      })}>
      {LeftChild}
      <div className="overflow-hidden h-full w-full">
        <Draggable
          disabled={!isEditable}
          position={position}
          onStop={onSave}
          defaultClassName="h-full w-full"
          onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}>
          <div>
            {fetchedImage ? (
              <Image
                src={fetchedImage}
                className={cn('pointer-events-none rounded-none z-0', {
                  'h-full w-full object-cover': imageType !== 'image/gif',
                })}
                removeWrapper
              />
            ) : (
              <div />
            )}
          </div>
        </Draggable>
      </div>
      {RightChild}
    </div>
  )
}
