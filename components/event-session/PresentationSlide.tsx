import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import React, { useContext } from "react"
import Cover from "../slides/content-types/Cover"
import Poll from "../slides/content-types/Poll"
import { ContentType } from "../slides/ContentTypePicker"
import { checkVoted } from "@/utils/content.util"

function PresentationSlide() {
  const { currentSlide, currentSlideResponses, currentUser, votePoll } =
    useContext(EventSessionContext) as EventSessionContextType

  if (!currentSlide) return null

  return (
    <div className="w-full h-full">
      {currentSlide.contentType === ContentType.COVER && (
        <Cover key={currentSlide.id} slide={currentSlide} />
      )}
      {currentSlide.contentType === "poll" && (
        <Poll
          key={currentSlide.id}
          slide={currentSlide}
          votePoll={votePoll}
          votes={currentSlideResponses}
          voted={checkVoted(currentSlideResponses, currentUser)}
        />
      )}
    </div>
  )
}

export default PresentationSlide
