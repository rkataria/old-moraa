import { useContext } from 'react'

import { TwitterPicker } from 'react-color'

import { SLIDE_BG_COLOR_PALETTE } from '@/constants/common'
import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { SlideManagerContextType } from '@/types/slide.type'

export function CommonSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const updateSlideColors = (color: string, colorKey: string) => {
    updateSlide({
      ...currentSlide,
      config: {
        ...currentSlide?.config,
        [colorKey]: color,
      },
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
