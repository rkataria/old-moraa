import { useContext } from 'react'

import { TwitterPicker } from 'react-color'

import { SLIDE_BG_COLOR_PALETTE } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function CommonSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType

  const updateSlideColors = (color: string, colorKey: string) => {
    if (!currentSlide) return

    updateSlide({
      slidePayload: {
        config: {
          ...currentSlide.config,
          [colorKey]: color,
        },
      },
      slideId: currentSlide.id,
    })
  }

  if (!currentSlide) return null

  return (
    <div className="flex items-center gap-2px-4 my-4 text-xs gap-3">
      <div className="flex-1">
        <p className="text-xs text-slate-500 mt-2">Background Color</p>
        <TwitterPicker
          colors={SLIDE_BG_COLOR_PALETTE}
          className="!shadow-none mt-2"
          triangle="hide"
          styles={{
            default: {
              body: {
                padding: '0',
              },
              swatch: {
                border: '1px solid lightGrey',
              },
            },
          }}
          color={currentSlide.config.backgroundColor}
          onChange={(color) => updateSlideColors(color.hex, 'backgroundColor')}
        />
      </div>
    </div>
  )
}
