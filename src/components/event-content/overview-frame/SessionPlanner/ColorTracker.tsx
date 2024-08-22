import { Tooltip } from '@/components/common/ShortuctTooltip'
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
  colorCodes: { colorCode: string; timeSpan: number }[]
  className?: string
}) {
  function calculateTimePercentages(
    data: { colorCode: string; timeSpan: number }[]
  ) {
    const totalTime = data.reduce((sum, item) => sum + (item.timeSpan || 0), 0)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timeByColorCode = data.reduce((acc: any, item) => {
      const colorCode = item.colorCode || 'none'
      if (!acc[colorCode]) {
        acc[colorCode] = 0
      }
      acc[colorCode] += item.timeSpan || 0

      return acc
    }, {})

    const percentages = Object.keys(timeByColorCode).map((colorCode) => ({
      label: colorCode,
      // eslint-disable-next-line radix
      value: parseInt(
        ((timeByColorCode[colorCode] / totalTime) * 100).toFixed(1)
      ),
      color:
        FrameColorCodes[`${colorCode as keyof typeof FrameColorCodes}`]
          ?.color || '#D9D9D9',
    }))

    return percentages
  }

  const tracks = calculateTimePercentages(colorCodes)

  return <ColorTracker tracks={tracks} className={className} />
}
