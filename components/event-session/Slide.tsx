import EventSessionContext from "@/contexts/EventSessionContext"
import { useAuth } from "@/hooks/useAuth"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import React, { useContext } from "react"
import { ContentType } from "../event-content/ContentTypePicker"
import Cover from "./content-types/Cover"
import Poll from "./content-types/Poll"
import { checkVoted } from "@/utils/content.util"
import SlideLoading from "./SlideLoading"
import GoogleSlides from "../event-content/content-types/GoogleSlides"
import Reflection from "./content-types/Reflection"

function Slide() {
  const {
    presentationStatus,
    currentSlide,
    votePoll,
    addReflection,
    currentSlideResponses,
    currentSlideLoading,
  } = useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  if (!currentSlide) return null

  if (currentSlide.contentType === ContentType.COVER) {
    return <Cover key={currentSlide.id} slide={currentSlide} />
  }

  if (currentSlideLoading) return <SlideLoading />

  if (currentSlide.contentType === ContentType.POLL) {
    return (
      <Poll
        key={currentSlide.id}
        slide={currentSlide}
        votePoll={votePoll}
        votes={currentSlideResponses}
        voted={checkVoted(currentSlideResponses, currentUser)}
      />
    )
  }

  if (currentSlide.contentType === ContentType.GOOGLE_SLIDES) {
    return <GoogleSlides key={currentSlide.id} slide={currentSlide} />
  }
  if (currentSlide.contentType === ContentType.REFLECTION) {
    return (
      <Reflection
        key={currentSlide.id}
        slide={currentSlide}
        responses={currentSlideResponses}
        responded={checkVoted(currentSlideResponses, currentUser)}
        addReflection={addReflection}
        user={currentUser}
      />
    )
  }

  return null
}

export default Slide
