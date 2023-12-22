import React, { useContext } from "react"
import ControlButton from "./ControlButton"
import {
  IconArrowLeft,
  IconArrowRight,
  IconClock,
  IconPencil,
} from "@tabler/icons-react"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"

const buttonStyle =
  "!bg-black/10 !text-white transition-all duration-200 group-hover:!bg-black/90 hover:!bg-black"

function SlideViewControls() {
  const { nextSlide, previousSlide, enableEditing } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-md flex justify-center items-center gap-2">
      <ControlButton className={buttonStyle}>
        <IconClock size={16} />
      </ControlButton>
      <ControlButton className={buttonStyle} onClick={previousSlide}>
        <IconArrowLeft size={16} />
      </ControlButton>
      <ControlButton className={buttonStyle} onClick={nextSlide}>
        <IconArrowRight size={16} />
      </ControlButton>
      <ControlButton className={buttonStyle} onClick={enableEditing}>
        <IconPencil size={16} />
      </ControlButton>
    </div>
  )
}

export default SlideViewControls
