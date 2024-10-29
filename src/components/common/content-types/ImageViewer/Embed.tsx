import { useState } from 'react'

import { Image, Skeleton } from '@nextui-org/react'

import { getOjectPublicUrl } from '@/utils/utils'

type EmbedProps = {
  path: string
}

export function Embed({ path }: EmbedProps) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative flex justify-center items-center aspect-video w-full">
      <Image
        src={getOjectPublicUrl(path as string)}
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
