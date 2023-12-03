"use client"

import React, { useEffect, useState } from "react"
import { ISlide, SlideMode } from "@/types/slide.type"

interface BasicSlideProps {
  slide: ISlide
  mode: SlideMode
  sync: (slide: ISlide) => void
}

function BasicSlide({ slide, mode, sync }: BasicSlideProps) {
  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    sync({
      ...slide,
      content: { ...slide.content, title: e.target.value },
    })
  }

  const updateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    sync({
      ...slide,
      content: { ...slide.content, description: e.target.value },
    })
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 bg-white">
      <input
        placeholder="Title"
        defaultValue={slide.content.title}
        disabled={mode === "present"}
        onChange={updateTitle}
        className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800"
      />
      <input
        placeholder="This is a description"
        defaultValue={slide.content.description}
        disabled={mode === "present"}
        className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl"
        onChange={updateDescription}
      />
    </div>
  )
}

export default BasicSlide
