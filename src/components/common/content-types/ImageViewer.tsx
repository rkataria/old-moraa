import { useState } from 'react'

import { Image, Skeleton } from '@nextui-org/react'

type ImageViewerProps = {
  src: string
}

export function ImageViewer({ src }: ImageViewerProps) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative flex justify-center items-center aspect-video w-full">
      <Image
        src={src}
        loading="eager"
        className="w-full aspect-video z-0"
        classNames={{ wrapper: 'h-full' }}
        onLoad={() => {
          setLoading(false)
        }}
        onError={() => console.log('error')}
      />
      {loading && (
        <div className="absolute left-0 top-0 w-full h-full rounded-md overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      )}
    </div>
  )
}
