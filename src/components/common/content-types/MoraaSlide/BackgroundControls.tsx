/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { Slider } from '@heroui/react'
import { fabric } from 'fabric'
import { PiCaretDown } from 'react-icons/pi'

import { BackgroundControlsModal } from './BackgroundControlsModal'
import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'
import { NumberInputCaret } from '../../NumberInputCaret'
import { SwitchControl } from '../../SwitchControl'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { cn } from '@/utils/utils'

const BLUR_FACTOR = 50

export function MoraaSlideBackgroundControls() {
  const { canvas } = useMoraaSlideEditorContext()

  const backgroundImage = canvas?.backgroundImage as fabric.Image
  const blurFilter = backgroundImage?.filters?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) => f?.type === 'Blur'
  ) as unknown as {
    type: string
    blur: number
  }
  const blendFilter = backgroundImage?.filters?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) => f.type === 'BlendColor'
  ) as unknown as {
    type: string
    color: string
    alpha: number
    mode: string
  }

  const applyBlendColorFilters = () => {
    const _blendFilter = new fabric.Image.filters.BlendColor({
      color: '#C7C7C7',
      alpha: 0.4,
      mode: 'overlay',
    })

    backgroundImage.filters?.push(_blendFilter)
    backgroundImage.applyFilters()
    canvas?.requestRenderAll()
    canvas?.fire('object:modified')
  }

  const clearBlendColorFilter = () => {
    backgroundImage.filters = backgroundImage.filters?.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => f.type !== 'BlendColor'
    )
    backgroundImage.applyFilters()
    canvas?.requestRenderAll()
    canvas?.fire('object:modified')
  }

  const [collapsed, setCollapsed] = useState(true)
  const [overlay, setOverlay] = useState(!!blurFilter)

  const blur = blurFilter?.blur || 0
  const overlayColor = blendFilter?.color || '#000000'
  const overlayAlpha = blendFilter?.alpha || 0
  const overlayOpacity = 1 - overlayAlpha

  return (
    <div className="flex flex-col gap-2">
      <LabelWithInlineControl
        label="Background"
        className="flex justify-between items-center gap-2 font-semibold"
        control={<BackgroundControlsModal onClose={() => {}} />}
      />
      {backgroundImage && (
        <div>
          <div
            className="flex justify-between items-center text-primary-400 hover:text-primary cursor-pointer"
            onClick={() => setCollapsed((o) => !o)}>
            <span>More options</span>
            <PiCaretDown
              className={cn('-rotate-90', {
                'rotate-0': !collapsed,
              })}
            />
          </div>
          {!collapsed && (
            <div className="pb-4 pt-2 flex flex-col gap-3">
              <LabelWithInlineControl
                label="Blur"
                className="flex justify-between items-center gap-2"
                control={
                  <NumberInputCaret
                    min={0}
                    step={5}
                    max={20}
                    selectOnFocus
                    number={blur * BLUR_FACTOR}
                    onChange={(value) => {
                      if (blurFilter) {
                        blurFilter.blur = value / BLUR_FACTOR
                        backgroundImage.applyFilters()
                        canvas?.requestRenderAll()
                        canvas?.fire('object:modified')
                      } else {
                        const _blurFilter = new fabric.Image.filters.Blur({
                          blur: value / BLUR_FACTOR,
                        })
                        backgroundImage.filters?.push(_blurFilter)
                        backgroundImage.applyFilters()
                        canvas?.requestRenderAll()
                        canvas?.fire('object:modified')
                      }
                    }}
                  />
                }
              />
              <LabelWithInlineControl
                label="Overlay"
                className="flex justify-between items-center"
                control={
                  <SwitchControl
                    label=""
                    checked={overlay}
                    onChange={() => {
                      setOverlay((o) => !o)
                      if (!overlay) {
                        applyBlendColorFilters()
                      } else {
                        clearBlendColorFilter()
                      }
                    }}
                  />
                }
              />
              {overlay && (
                <div className="py-1 flex flex-col gap-3">
                  <LabelWithInlineControl
                    label="Color"
                    className="flex justify-between items-center"
                    control={
                      <ColorPicker
                        defaultColor={overlayColor as string}
                        onChange={(color) => {
                          if (blendFilter) {
                            blendFilter.color = color
                            blendFilter.mode = 'overlay'
                            backgroundImage.applyFilters()
                            canvas?.requestRenderAll()
                            canvas?.fire('object:modified')
                          }
                        }}
                      />
                    }
                  />
                  <LabelWithInlineControl
                    label="Opacity"
                    className="flex-col"
                    control={
                      <Slider
                        size="sm"
                        showTooltip
                        step={0.01}
                        maxValue={1}
                        minValue={0}
                        formatOptions={{ style: 'percent' }}
                        aria-label="Opacity"
                        className="w-full"
                        defaultValue={overlayOpacity}
                        onChange={(value) => {
                          if (blendFilter) {
                            blendFilter.alpha = 1 - (value as number)
                            blendFilter.mode = 'overlay'
                            backgroundImage.applyFilters()
                            canvas?.requestRenderAll()
                            canvas?.fire('object:modified')
                          }
                        }}
                      />
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
