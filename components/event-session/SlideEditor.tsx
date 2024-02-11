import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import React, { useContext } from "react"
import { ContentType } from "../event-content/ContentTypePicker"
import CoverEditor from "./CoverEditor"

function SlideEditor() {
  const { currentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!currentSlide) return null

  if (currentSlide.type === ContentType.COVER) {
    return <CoverEditor slide={currentSlide} />
  }

  return null
}

export default SlideEditor
