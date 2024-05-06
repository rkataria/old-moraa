/* TODO: Fix any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react'

import { useClickAway } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { SketchPicker } from 'react-color'

import { PollForm } from './PollForm'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

export function PollEditor({
  slide,
  openSettings,
}: {
  slide: ISlide
  openSettings: boolean
}) {
  const { updateSlide } = useContext(EventContext) as EventContextType
  const [showSettings, setShowSettings] = useState<boolean>(openSettings)
  const settingsRef = useClickAway(() => {
    setShowSettings(false)
  })

  useEffect(() => {
    setShowSettings(openSettings)
  }, [openSettings])

  return (
    <div className={clsx('relative w-full h-full overflow-hidden')}>
      <div className="relative w-full h-full overflow-x-hidden overflow-y-auto scrollbar-thin">
        <PollForm slide={slide as any} />
      </div>
      <div
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref={settingsRef}
        className={clsx(
          'absolute top-0 h-full max-w-[420px] z-20 w-full bg-white transition-all overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20',
          {
            'right-0': showSettings,
            '-right-[420px]': !showSettings,
          }
        )}>
        <div className="px-8 py-4">
          <h3 className="text-xl font-bold mb-4">Add a background color</h3>
          <div className="relative">
            <div className="my-4">
              <SketchPicker
                color={slide.config.backgroundColor}
                onChange={(color) => {
                  updateSlide({
                    slidePayload: {
                      config: {
                        ...slide.config,
                        backgroundColor: color.hex,
                      },
                    },
                    slideId: slide.id,
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
