import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import React, { useContext } from "react"
import Cover from "../slides/content-types/Cover"
import Poll from "../slides/content-types/Poll"
import { ContentType } from "../slides/ContentTypePicker"

function PresentationSlide() {
  const { currentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!currentSlide) return null

  console.log(currentSlide)

  return (
    <div className="w-full h-full">
      {currentSlide.contentType === ContentType.COVER && (
        <Cover key={currentSlide.id} slide={currentSlide} />
      )}
      {currentSlide.contentType === "poll" && (
        <Poll key={currentSlide.id} slide={currentSlide} />
      )}
    </div>
  )
}

export default PresentationSlide
