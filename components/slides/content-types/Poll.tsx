"use client"
import React from "react"
import { ISlide } from "@/types/slide.type"

interface PollProps {
  slide: ISlide
}

function Poll({ slide }: PollProps) {
  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}
    >
      <div className="w-4/5 mt-20 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.content.textColor,
            }}
          >
            {slide.content.question}
          </h2>

          <div className="mt-4">
            {slide.content.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <button className="w-full text-left p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-xl font-semibold">
                  {option}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Poll
