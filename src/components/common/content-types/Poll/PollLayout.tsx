import { Image } from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'

interface IImageConfig {
  url: string
  position: 'left' | 'right'
}

export function PollLayout({
  children,
  imageConfig,
}: {
  children: ReactNode
  imageConfig?: IImageConfig | object
}) {
  if (!imageConfig || !('url' in imageConfig)) {
    return children
  }

  if (imageConfig.position === 'left') {
    return (
      <div className="grid grid-cols-[0.4fr_0.6fr] h-full gap-16">
        <Image
          src={imageConfig.url}
          className="w-full h-full !rounded-r-none object-cover"
          classNames={{ wrapper: 'w-full !rounded-r-none' }}
        />
        {children}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[0.6fr_0.4fr] h-full gap-16">
      {children}
      <Image
        src={imageConfig.url}
        className="w-full h-full !rounded-l-none object-cover"
        classNames={{ wrapper: 'w-full !rounded-l-none' }}
      />
    </div>
  )
}
