import { Image } from '@nextui-org/react'

import { ImageBlock } from '../event-session/content-types/TextImage'

import { cn } from '@/utils/utils'

export function ImageBlockView({ imageBlock }: { imageBlock: ImageBlock }) {
  return (
    <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
      <div className="relative rounded-md overflow-hidden group">
        <Image
          src={imageBlock?.data.file.url}
          removeWrapper
          className={cn('relative z-0 flex-none rounded-md overflow-hidden')}
        />
      </div>
    </div>
  )
}
