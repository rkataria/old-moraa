import { ChangeEvent, useContext } from 'react'

import { TwitterPicker } from 'react-color'
import { TbCheck } from 'react-icons/tb'

import { Checkbox, Switch } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { FRAME_BG_COLOR_PALETTE } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'

export function CommonFrameSettings() {
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType
  if (!currentFrame) return null

  const updateFrameColors = (color: string, colorKey: string) => {
    if (!currentFrame) return

    if (currentFrame.config?.[colorKey] === color) return

    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          [colorKey]: color,
        },
      },
      frameId: currentFrame.id,
    })
  }

  const onToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentFrame) return
    const changedKey = e.target.name
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          [changedKey]: !currentFrame.config[changedKey],
        },
      },
      frameId: currentFrame.id,
    })
  }

  const showTitleToggle = ![ContentType.REFLECTION, ContentType.POLL].includes(
    currentFrame.type
  )

  return (
    <div className="flex items-center gap-2px-4 my-4 text-xs gap-3">
      <div className="flex-1">
        <p className="text-xs text-slate-500 mt-2">Background Color</p>
        <TwitterPicker
          colors={FRAME_BG_COLOR_PALETTE}
          className="!shadow-none mt-2 !bg-transparent"
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
          color={currentFrame.config.backgroundColor}
          onChange={(color) => updateFrameColors(color.hex, 'backgroundColor')}
        />

        <Switch
          color="success"
          isSelected={currentFrame.status === FrameStatus.PUBLISHED}
          // eslint-disable-next-line react/no-unstable-nested-components
          thumbIcon={({ isSelected }) => (isSelected ? <TbCheck /> : null)}
          onValueChange={(isSelected) =>
            updateFrame({
              framePayload: {
                status: isSelected ? FrameStatus.PUBLISHED : FrameStatus.DRAFT,
              },
              frameId: currentFrame.id,
            })
          }
          classNames={{
            base: 'inline-flex flex-row-reverse w-full max-w-md items-center p-0 justify-between mt-4 pr-4',
          }}>
          <div className="flex flex-col gap-1">
            <p className="text-sm">Share with participants</p>
          </div>
        </Switch>

        <div className="grid gap-2 w-full mt-4">
          {showTitleToggle && (
            <Checkbox
              name="showTitle"
              size="sm"
              isSelected={currentFrame.config.showTitle}
              onChange={onToggleChange}>
              Title
            </Checkbox>
          )}
          <Checkbox
            name="showDescription"
            size="sm"
            isSelected={currentFrame.config.showDescription}
            onChange={onToggleChange}>
            Description
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
