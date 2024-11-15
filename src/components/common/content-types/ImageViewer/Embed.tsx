import { useState } from 'react'

import { Image, Skeleton } from '@nextui-org/react'

import { getObjectPublicUrl } from '@/utils/utils'

type EmbedProps = {
  path: string
  publicUrl?: string
}

export function Embed({ path, publicUrl }: EmbedProps) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative flex justify-center items-center aspect-video w-full">
      <Image
        src={publicUrl ?? getObjectPublicUrl(path as string)}
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
