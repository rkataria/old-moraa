"use client"

import React, { useContext } from "react"
import { ISlide, SlideManagerContextType, SlideMode } from "@/types/slide.type"
import SlideManagerContext from "@/contexts/SlideManagerContext"

interface CoverProps {
  slide: ISlide
}

function Cover({ slide }: CoverProps) {
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSlide({
      ...slide,
      content: { ...slide.content, title: e.target.value },
    })
  }

  const updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSlide({
      ...slide,
      content: { ...slide.content, description: e.target.value },
    })
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
