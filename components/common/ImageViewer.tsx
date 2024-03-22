import { Image } from '@nextui-org/react'

type ImageViewerProps = {
  src: string
}

export function ImageViewer({ src }: ImageViewerProps) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Image src={src} loading="lazy" className="h-full" />
    </div>
  )
}
