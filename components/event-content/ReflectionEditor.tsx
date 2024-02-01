"use client"

import React, { useContext, useEffect, useState } from "react"
import { ISlide, SlideManagerContextType, SlideMode } from "@/types/slide.type"
import SlideManagerContext from "@/contexts/SlideManagerContext"
import { useThrottle } from "@uidotdev/usehooks"
import TextareaAutosize from "react-textarea-autosize"

interface ReflectionEditorProps {
  slide: ISlide
}

function ReflectionEditor({ slide }: ReflectionEditorProps) {
  const [title, setTitle] = useState<string>(slide.content.title)
  const throttledTitle = useThrottle(title, 500)

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType
  const [showSettings, setShowSettings] = useState<boolean>(openSettings)
  const settingsRef = useClickAway(() => {
    setShowSettings(false)
  })
  const [preview, setPreview] = useState<boolean>(false)

  useEffect(() => {
    setShowSettings(openSettings)
  }, [openSettings])

  useEffect(() => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        title: throttledTitle,
      },
    })
  }, [throttledTitle])

  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }


  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8 bg-white">
      <TextareaAutosize
        maxLength={100}
        placeholder="Title"
        defaultValue={slide.content.title}
        onChange={updateTitle}
        className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800 resize-none"
      />  
    </div>
  )
}

export default ReflectionEditor
