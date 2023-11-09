"use client"

import React, { useState } from "react"
import { ISlide } from "./Slide"
import { IconTrash } from "@tabler/icons-react"

interface ContentTypePollProps {
  slide: ISlide
}

function ContentTypePoll({ slide }: ContentTypePollProps) {
  const [poll, setPoll] = useState({
    question: "What is your favorite color?",
    options: ["Red", "Blue", "Green", "Yellow"],
  })

  const updateQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoll((prev) => ({ ...prev, question: e.target.value }))
  }

  return (
    <div className="w-full min-h-full flex justify-center items-start">
      <div className="w-4/5 bg-white mt-20 rounded-md relative">
        <div className="p-4">
          <input
            placeholder="Add question"
            value={poll.question}
            onChange={updateQuestion}
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold text-gray-800"
          />

          <div className="mt-4">
            {poll.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  placeholder="Add option"
                  value={option}
                  className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-xl font-semibold"
                />
                <button className="p-2 text-gray-300 hover:text-red-600">
                  <IconTrash size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-12 right-0 flex justify-between items-center">
          <button className="px-4 py-2 bg-black/50 text-white rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentTypePoll
