import { useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { CommonImageSettings } from './CommonImageSettings'

import { ColorPicker } from '@/components/common/ColorPicker'
import { TwoWayNumberCounter } from '@/components/common/content-types/MoraaSlide/FontSizeControl'
import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { useEventContext } from '@/contexts/EventContext'

export function WordCloudSettings() {
  const { currentFrame, updateFrame } = useEventContext()

  const [updatedConfig, setUpdatedConfig] = useState(currentFrame?.config)

  const debouncedConfig = useDebounce(updatedConfig, 300)

  useEffect(() => {
    if (!currentFrame) return
    if (isEqual(debouncedConfig, currentFrame.config)) return

    updateFrame({
      framePayload: {
        config: updatedConfig,
      },
      frameId: currentFrame?.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedConfig])

  if (!currentFrame) return null

  const colors = updatedConfig?.colors || []

  const handleColorChange = (index: number, color: string) => {
    const updatedColors = [...colors]
    updatedColors[index] = color

    setUpdatedConfig({
      ...updatedConfig,
      colors: updatedColors,
    })
  }

  return (
    <>
      <LabelWithInlineControl
        label="Max words"
        control={
          <TwoWayNumberCounter
            defaultCount={updatedConfig?.maxWords as number}
            onCountChange={(count) => {
              setUpdatedConfig({
                ...updatedConfig,
                maxWords: count,
              })
            }}
            noNegative
          />
        }
      />
      <LabelWithInlineControl
        label="Visualization Colors"
        className="flex-col items-start"
        control={
          <div className="flex items-center gap-1">
            {colors?.map((color: string, index: number) => (
              <ColorPicker
                defaultColor={color}
                onChange={(newColor) => handleColorChange(index, newColor)}
                className="w-8 h-8 rounded-md border-none"
              />
            ))}
          </div>
        }
      />
      <CommonImageSettings frame={currentFrame} />
    </>
  )
}
