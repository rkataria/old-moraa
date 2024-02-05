import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import React, { useContext } from "react"
import Cover from "./content-types/Cover"
import Poll from "./content-types/Poll"
import { ContentType } from "../event-content/ContentTypePicker"
import { checkVoted } from "@/utils/content.util"
import { useAuth } from "@/hooks/useAuth"

function PresentationSlide() {
  const { currentSlide, currentSlideResponses, votePoll } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const { currentUser } = useAuth()

  if (!currentSlide) return null

  return (
    <div className="w-full h-full">
      {currentSlide.type === ContentType.COVER && (
        <Cover key={currentSlide.id} slide={currentSlide} />
      )}
      {currentSlide.type === "poll" && (
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
