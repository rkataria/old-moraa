import React, { useContext } from "react"
import ControlButton from "./ControlButton"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"

const buttonStyle =
  "!bg-black/10 !text-white transition-all duration-200 group-hover:!bg-black/90 hover:!bg-black"

type SlideEditControlsProps = {
  onSave: () => void
}

function SlideEditControls({ onSave }: SlideEditControlsProps) {
  const { disableEditing } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-md flex justify-center items-center gap-2">
      <ControlButton className={buttonStyle} onClick={disableEditing}>
        Cancel
      </ControlButton>
      <ControlButton className={buttonStyle} onClick={onSave}>
        Save
      </ControlButton>
    </div>
  )
}

export default SlideEditControls
