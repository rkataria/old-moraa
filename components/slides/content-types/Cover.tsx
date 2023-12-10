"use client"

import React from "react"
import { ISlide } from "@/types/slide.type"

interface CoverProps {
  slide: ISlide
}

function Cover({ slide }: CoverProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 bg-white">
      <h2 className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800">
        {slide.content.title}
      </h2>
      <p className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl">
        {slide.content.description}
      </p>
    </div>
  )
}

export default Cover
