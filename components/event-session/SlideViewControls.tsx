import React, { useContext } from "react"
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled
} from "@tabler/icons-react"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import { IconButton } from "@chakra-ui/react"
import { ContentType } from "../event-content/ContentTypePicker"
import { SlideEventManagerType, SlideEvents } from "@/utils/events.util"
import { useHotkeys } from "@/hooks/useHotkeys"
import classNames from "classnames"

const buttonStyle =
  "!h-4 !w-4 !m-1 !bg-white/50 !text-black transition-all duration-200 hover:!bg-white/90"

function SlideViewControls() {
  const { slides, currentSlide, nextSlide, previousSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const { meeting } = useDyteMeeting()
  useHotkeys("ArrowRight", () => {
    SlideEvents[SlideEventManagerType.OnRight].dispatchEvent()
  })
  useHotkeys("ArrowLeft", () => {
    SlideEvents[SlideEventManagerType.OnLeft].dispatchEvent()
  })
  useHotkeys("ArrowUp", () => {
    updateCurrentSlide(false)
    previousSlide()
  })
  useHotkeys("ArrowDown", () => {
    updateCurrentSlide(true)
    nextSlide()
  })

  const updateCurrentSlide = (isNext: boolean) => {
    const currentSlideIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    const nextSlide = slides[currentSlideIndex + (isNext ? 1 : -1)]
    if (!nextSlide) return
    meeting.participants.broadcastMessage("set-current-slide-by-id", {
      slideId: nextSlide.id,
    })
  }

  const showRightLeftArrow = [ContentType.GOOGLE_SLIDES].includes(
    currentSlide?.contentType as ContentType
  )

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-md flex justify-center items-center gap-2">
      <div className={classNames({ flex: !showRightLeftArrow })}>
        <div className="flex justify-center items-center">
          <IconButton
            aria-label="button"
            className={buttonStyle}
            onClick={() => {
              updateCurrentSlide(false)
              previousSlide()
            }}
          >
            <IconCaretUpFilled size={24} />
          </IconButton>
        </div>
        {showRightLeftArrow ? (
          <div className="flex justify-center items-center">
            <IconButton
              aria-label="button"
              className={buttonStyle}
              onClick={() => {
                SlideEvents[SlideEventManagerType.OnLeft].dispatchEvent()
              }}
            >
              <IconCaretLeftFilled size={24} />
            </IconButton>
            <IconButton
              aria-label="button"
              className={buttonStyle}
              onClick={() => {
                SlideEvents[SlideEventManagerType.OnRight].dispatchEvent()
              }}
            >
              <IconCaretRightFilled size={24} />
            </IconButton>
          </div>
        ) : null}
        <div className="flex justify-center items-center">
          <IconButton
            aria-label="button"
            className={buttonStyle}
            onClick={() => {
              updateCurrentSlide(true)
              nextSlide()
            }}
          >
            <IconCaretDownFilled size={24} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default SlideViewControls
