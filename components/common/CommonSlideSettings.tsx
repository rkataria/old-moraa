import { ChangeEvent, useContext } from 'react'

import { TwitterPicker } from 'react-color'

import { Checkbox } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { SLIDE_BG_COLOR_PALETTE } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function CommonSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType
  if (!currentSlide) return null

  const updateSlideColors = (color: string, colorKey: string) => {
    if (!currentSlide) return

    if (currentSlide.config?.[colorKey] === color) return

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

  const onToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentSlide) return
    const changedKey = e.target.name
    updateSlide({
      slidePayload: {
        config: {
          ...currentSlide.config,
          [changedKey]: !currentSlide.config[changedKey],
        },
      },
      slideId: currentSlide.id,
    })
  }

  const showTitleToggle = ![ContentType.REFLECTION, ContentType.POLL].includes(
    currentSlide.type
  )

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

        <div className="grid gap-2 w-full mt-4">
          {showTitleToggle && (
            <Checkbox
              name="showTitle"
              size="sm"
              isSelected={currentSlide.config.showTitle}
              onChange={onToggleChange}>
              Title
            </Checkbox>
          )}
          <Checkbox
            name="showDescription"
            size="sm"
            isSelected={currentSlide.config.showDescription}
            onChange={onToggleChange}>
            Description
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
