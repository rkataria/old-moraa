import React, { useContext, useEffect, useState } from "react"
import MiniSlideManager from "../event-content/MiniSlideManager"
import PresentationSlide from "./PresentationSlide"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import { ISlide } from "@/types/slide.type"

function PresentationManager() {
  const { meeting } = useDyteMeeting()
  const [isHost, setIsHost] = useState<boolean>(false)
  const { slides, currentSlide, setCurrentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  useEffect(() => {
    if (!meeting) return

    const preset = meeting.self.presetName
    if (preset.includes("host")) {
      setIsHost(true)
    }
  }, [meeting])

  const handleChangeCurrentSlide = (slide: ISlide) => {
    if (!isHost) return

    meeting?.participants.broadcastMessage("slide-changed", {
      slide: slide as any,
    })
  }

  return (
    <div className="py-[56px] pl-12 pr-72 w-full h-screen">
      <div className="w-full h-full p-4 relative bg-gray-100">
        <div className="w-full h-full rounded-md bg-white overflow-hidden shadow-lg">
          <PresentationSlide />
        </div>
      </div>
      <MiniSlideManager
        mode="present"
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={handleChangeCurrentSlide}
        onMiniModeChange={() => {}}
      />
    </div>
  )
}

export default PresentationManager
