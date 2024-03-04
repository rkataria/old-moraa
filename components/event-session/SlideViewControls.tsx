import React, { useContext } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled,
} from '@tabler/icons-react'
import classNames from 'classnames'

import { Button } from '@nextui-org/react'

import { ContentType } from '../event-content/ContentTypePicker'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useHotkeys } from '@/hooks/useHotkeys'
import { EventSessionContextType } from '@/types/event-session.type'
import { SlideEventManagerType, SlideEvents } from '@/utils/events.util'

const buttonStyle =
  '!h-4 !w-4 !m-1 !bg-white/50 !text-black transition-all duration-200 hover:!bg-white/90'

export function SlideViewControls() {
  const { slides, currentSlide, nextSlide, previousSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const { meeting } = useDyteMeeting()
  useHotkeys('ArrowRight', () => {
    SlideEvents[SlideEventManagerType.OnRight].dispatchEvent()
  })
  useHotkeys('ArrowLeft', () => {
    SlideEvents[SlideEventManagerType.OnLeft].dispatchEvent()
  })
  useHotkeys('ArrowUp', () => {
    updateCurrentSlide(false)
    previousSlide()
  })
  useHotkeys('ArrowDown', () => {
    updateCurrentSlide(true)
    nextSlide()
  })

  const updateCurrentSlide = (isNext: boolean) => {
    const currentSlideIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const nextSlide = slides[currentSlideIndex + (isNext ? 1 : -1)]
    if (!nextSlide) return
    meeting.participants.broadcastMessage('set-current-slide-by-id', {
      slideId: nextSlide.id,
    })
  }

  const showRightLeftArrow = [
    ContentType.GOOGLE_SLIDES,
    ContentType.PDF_VIEWER,
  ].includes(currentSlide?.type as ContentType)

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-md flex justify-center items-center gap-2">
      <div>
        <div className="flex justify-center items-center">
          <Button
            aria-label="previous-button"
            isIconOnly
            className={buttonStyle}
            onClick={() => {
              updateCurrentSlide(false)
              previousSlide()
            }}>
            <IconCaretUpFilled size={24} />
          </Button>
        </div>
        <div
          className={classNames('flex justify-center items-center', {
            invisible: !showRightLeftArrow,
          })}>
          <Button
            aria-label="left-button"
            isIconOnly
            className={buttonStyle}
            onClick={() => {
              SlideEvents[SlideEventManagerType.OnLeft].dispatchEvent()
            }}>
            <IconCaretLeftFilled size={24} />
          </Button>
          <Button
            aria-label="right-button"
            isIconOnly
            className={buttonStyle}
            onClick={() => {
              SlideEvents[SlideEventManagerType.OnRight].dispatchEvent()
            }}>
            <IconCaretRightFilled size={24} />
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Button
            aria-label="next-button"
            isIconOnly
            className={buttonStyle}
            onClick={() => {
              updateCurrentSlide(true)
              nextSlide()
            }}>
            <IconCaretDownFilled size={24} />
          </Button>
        </div>
      </div>
    </div>
  )
}
