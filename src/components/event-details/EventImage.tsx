import { Image } from '@nextui-org/react'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { cn } from '@/utils/utils'

type EventImageProps = {
  src: string | null
  className?: string
}

export function EventImage({ src, className }: EventImageProps) {
  return (
    <Image
      src={src || IMAGE_PLACEHOLDER}
      className={cn('w-full h-full object-cover rounded-lg', className)}
      classNames={{
        wrapper:
          '!max-w-none w-full h-auto aspect-square rounded-lg overflow-hidden shadow-lg',
        img: 'w-full h-full object-cover rounded-lg',
      }}
    />
  )
}
