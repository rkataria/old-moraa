import { useState } from 'react'

import { Image, Skeleton } from '@heroui/react'

import { Hotspot, HotspotImageWrapper } from '../../HotspotImageWrapper'

type EmbedProps = {
  path: string
  disableHotspot?: boolean
  hotspots?: Hotspot[]
  onHotspotCreate?: (hotspot: Hotspot) => void
  onHotspotDelete?: (hotspot: Hotspot) => void
  hideExistingHotspots?: boolean
  disableAddHotspot?: boolean
}

export function Embed({
  path,
  disableHotspot,
  hotspots,
  onHotspotCreate,
  onHotspotDelete,
  hideExistingHotspots,
  disableAddHotspot,
}: EmbedProps) {
  const [loading, setLoading] = useState(true)

  return (
    <div
      className="relative flex justify-center items-center aspect-video overflow-hidden"
      style={{ maxHeight: '100%', maxWidth: '100%' }}>
      <HotspotImageWrapper
        hotspots={hotspots || []}
        disableAddHotspot={disableAddHotspot || disableHotspot}
        hideExistingHotspots={hideExistingHotspots || disableHotspot}
        onHotspotDelete={onHotspotDelete}
        onHotspotCreate={onHotspotCreate}>
        {({ handleImageClick }) => (
          <Image
            src={path}
            removeWrapper
            loading="eager"
            className="rounded-md object-contain w-[-webkit-fill-available] h-[-webkit-fill-available]"
            onClick={handleImageClick}
            onLoad={() => setLoading(false)}
            onError={() => console.error('Error loading image')}
          />
        )}
      </HotspotImageWrapper>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
          <Skeleton className="w-full h-full" />
        </div>
      )}
    </div>
  )
}
