"use client"

import React, { useContext, useState } from "react"
import { ISlide } from "@/types/slide.type"
import { useThrottle } from "@uidotdev/usehooks"
import TextareaAutosize from "react-textarea-autosize"
import SlideEditControls from "./SlideEditControls"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"

interface CoverEditorProps {
  slide: ISlide
}

function CoverEditor({ slide }: CoverEditorProps) {
  const { updateSlide, disableEditing } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const { meeting } = useDyteMeeting()
  const [title, setTitle] = useState<string>(slide.content.title)
  const [description, setDescription] = useState<string>(
    slide.content.description
  )
  const throttledTitle = useThrottle(title, 500)
  const throttledDescription = useThrottle(description, 500)

  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleSave = async () => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        title: throttledTitle,
        description: throttledDescription,
      },
    })

    // Let user know that the slide has been saved
    meeting.participants.broadcastMessage("sync-slides", {})

    disableEditing()
  }

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center px-8 bg-white">
        <TextareaAutosize
          maxLength={100}
          placeholder="Title"
          defaultValue={slide.content.title}
          onChange={updateTitle}
          className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800 resize-none"
        />
        <TextareaAutosize
          maxLength={300}
          placeholder="This is a description"
          defaultValue={slide.content.description}
          className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl resize-none"
          onChange={updateDescription}
        />
      </div>
      <SlideEditControls onSave={handleSave} />
    </>
  )
}

export default CoverEditor
