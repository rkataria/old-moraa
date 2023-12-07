import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import React, { useContext } from "react"
import Slide from "../slides/Slide"
import clsx from "clsx"
import BasicSlide from "../slides/content-types/Basic"
import PollPreview from "../PollPreview"

function PresentationSlide() {
  const { currentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (!currentSlide) return null

  console.log(currentSlide)

  return (
    <div className="w-full h-full">
      {currentSlide.contentType === "basic" && (
        <BasicSlide
          key={currentSlide.id}
          slide={currentSlide}
          mode="present"
          sync={() => {}}
        />
      )}
      {currentSlide.contentType === "poll" && (
        <PollPreview
          key={currentSlide.id}
          question={currentSlide.content.question}
          options={currentSlide.content.options}
          config={currentSlide.config}
        />
      )}
    </div>
  )
}

export default PresentationSlide
