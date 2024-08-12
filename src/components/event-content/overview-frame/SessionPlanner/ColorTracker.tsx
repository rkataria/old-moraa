import { Tooltip } from '@nextui-org/react'
import countBy from 'lodash.countby'

import { cn, FrameColorCodes } from '@/utils/utils'

interface ITrack {
  label: string
  value: number
  color: string
}

export function ColorTracker({
  tracks,
  className,
}: {
  tracks: ITrack[]
  className?: string
}) {
  return (
    <div
      className={cn('flex items-center w-[100px] h-2 rounded-lg', className)}>
      {tracks.map((track) => (
        <Tooltip
          content={`${track.label} ${track.value}%`}
          showArrow
          shouldFlip
          radius="sm"
          color="primary">
          <div
            style={{ width: `${track.value}%`, background: track.color }}
            className="h-full duration-300 bg-red-300 hover:scale-125"
          />
        </Tooltip>
      ))}
    </div>
  )
}

export function SessionColorTracker({
  colorCodes,
  className,
}: {
  colorCodes: string[]
  className?: string
}) {
  const filteredColors = colorCodes.map((color) =>
    !color ? 'Not selected' : color
  )

  const colorCounts = countBy(filteredColors)

  const totalColors = filteredColors.length

  const colorPercentagesArray = colorCounts
    ? Object.entries(colorCounts).map(([colorKey, count]) => ({
        label:
          FrameColorCodes[`${colorKey as keyof typeof FrameColorCodes}`]
            ?.label || 'Not Selected',
        value: totalColors
          ? // eslint-disable-next-line radix
            parseInt(((count / totalColors) * 100).toFixed(2))
          : 0,
        color:
          FrameColorCodes[`${colorKey as keyof typeof FrameColorCodes}`]
            ?.color || '#D9D9D9',
      }))
    : []

  return <ColorTracker tracks={colorPercentagesArray} className={className} />
}
