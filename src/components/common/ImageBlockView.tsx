import { Image } from '@nextui-org/react'

import { ImageBlock } from '../event-session/content-types/TextImage'

import { cn } from '@/utils/utils'

export function ImageBlockView({ imageBlock }: { imageBlock: ImageBlock }) {
  return (
    <div className="relative flex justify-center items-center overflow-hidden rounded-md h-full">
      <Image
        src={imageBlock?.data.file.url}
        removeWrapper
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex-none rounded-md overflow-hidden w-full h-auto object-contain'
        )}
      />
    </div>
  )
}
