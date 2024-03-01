import React, { useContext, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { PresentationSlide } from './PresentationSlide'
import { MiniSlideManager } from '../event-content/MiniSlideManager'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'

export function PresentationManager() {
  const { meeting } = useDyteMeeting()
  const [isHost, setIsHost] = useState<boolean>(false)
  const { slides, currentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  useEffect(() => {
    if (!meeting) return

    const preset = meeting.self.presetName
    if (preset.includes('host')) {
      setIsHost(true)
    }
  }, [meeting])

  const handleChangeCurrentSlide = (slide: ISlide) => {
    if (!isHost) return

    meeting?.participants.broadcastMessage('slide-changed', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        reorderSlide={() => {}}
      />
    </div>
  )
}
