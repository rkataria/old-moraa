"use client"

import React, { useContext, useEffect, useState } from "react"
import { ISlide, SlideManagerContextType, SlideMode } from "@/types/slide.type"
import SlideManagerContext from "@/contexts/SlideManagerContext"
import { useThrottle } from "@uidotdev/usehooks"

interface CoverProps {
  slide: ISlide
}

function Cover({ slide }: CoverProps) {
  const [title, setTitle] = useState<string>(slide.content.title)
  const [description, setDescription] = useState<string>(
    slide.content.description
  )
  const throttledTitle = useThrottle(title, 500)
  const throttledDescription = useThrottle(description, 500)

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        title: throttledTitle,
        description: throttledDescription,
      },
    })
  }, [throttledTitle, throttledDescription])

  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 bg-white">
      <input
        placeholder="Title"
        defaultValue={slide.content.title}
        onChange={updateTitle}
        className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800"
      />
      <input
        placeholder="This is a description"
        defaultValue={slide.content.description}
        className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl"
        onChange={updateDescription}
      />
    </div>
  )
}

export default Cover
