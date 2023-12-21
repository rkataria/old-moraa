import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import React, { useContext } from "react"
import { ContentType } from "../slides/ContentTypePicker"
import Cover from "../slides/content-types/Cover"
import Poll from "../slides/content-types/Poll"
import { checkVoted } from "@/utils/content.util"
import { useAuth } from "@/hooks/useAuth"

function SlideContainer() {
  const { presentationStatus, currentSlide, votePoll, currentSlideResponses } =
    useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  if (!currentSlide) return null

  return (
    <div className="flex-auto bg-gray-100 p-4 relative flex justify-center items-start">
      <div className="h-[90%] aspect-video bg-white rounded-md">
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
    </div>
  )
}

export default SlideContainer
