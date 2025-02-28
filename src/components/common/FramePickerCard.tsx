/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Chip, Tooltip } from '@heroui/react'

import { RenderIf } from './RenderIf/RenderIf'

import { FramePickerFrame } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

// eslint-disable-next-line import/no-cycle

interface IContentCard {
  frame: FramePickerFrame
  onClick: (frame: FramePickerFrame) => void
}

export function FramePickerCard({ frame, onClick }: IContentCard) {
  return (
    <Tooltip
      content={frame.description}
      hidden={frame.isCommingSoon || !frame.description}
      className="w-56 rounded-md bg-black text-white">
      <div
        key={frame.type}
        onClick={() => {
          if (frame.isCommingSoon) return

          onClick(frame)
        }}
        className={cn(
          'relative h-auto aspect-square rounded-md flex justify-center items-center border-2 border-transparent',
          {
            'cursor-pointer group/content-card hover:border-primary bg-gray-100':
              !frame.isCommingSoon,
            'cursor-not-allowed group/content-card-disabled bg-gray-50':
              frame.isCommingSoon,
          }
        )}>
        <div
          className={cn('flex flex-col gap-2 justify-center items-center', {
            'group-hover/content-card:text-primary': !frame.isCommingSoon,
            'text-gray-500': frame.isCommingSoon,
          })}>
          {frame.iconSmall}
          <span className="text-sm font-semibold">{frame.name}</span>
          <RenderIf isTrue={frame.isCommingSoon!}>
            <Chip
              color="default"
              size="sm"
              className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white">
              Coming Soon
            </Chip>
          </RenderIf>
        </div>
      </div>
    </Tooltip>
  )
}
