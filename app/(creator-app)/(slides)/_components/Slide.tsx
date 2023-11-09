"use client"

import React, { useState } from "react"
import ChooseContentType, { ContentType } from "./ChooseContentType"
import ContentTypePoll from "./ContentTypePoll"

export interface ISlide {
  id: string
  name: string
  content?: string
  deckId: string
  createdAt?: string
  updatedAt?: string
  config: {
    backgroundColor: string
  }
  contentType?: string
}

interface SlideProps {
  index: number
  slide: ISlide
}

export default function Slide({ index, slide }: SlideProps) {
  const [contentType, setContentType] = useState<ContentType | null>(null)

  const addContentType = (contentType: ContentType) => {
    console.log(contentType)
    setContentType(contentType)
  }

  return (
    <div
      data-slide-id={slide.id}
      className="bg-pink-800 rounded-md min-w-[75%] w-[75%] aspect-video m-auto relative group overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 transition-all"
      style={{
        backgroundColor: slide.config.backgroundColor || "#166534",
      }}
    >
      <div className="absolute -top-8 left-0 flex justify-start items-center gap-2">
        <h3 className="font-sm font-semibold">{`Slide ${index + 1} - `}</h3>
        <input
          placeholder="Add slide name"
          className="font-sm font-semibold p-0 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0"
        />
      </div>
      {!contentType && (
        <div className="p-12 bg-black/50 rounded-md absolute left-0 top-0 w-full h-full hidden group-hover:block transition-all">
          <ChooseContentType onChoose={addContentType} />
        </div>
      )}
      {contentType === "poll" && <ContentTypePoll slide={slide} />}
    </div>
  )
}
