"use client"
import React, { useState } from "react"
import { ISlide } from "@/types/slide.type"
import clsx from "clsx"

interface ReflectionProps {
  slide: ISlide
  responses?: any
  responded?: boolean
  addReflection?: (slide: ISlide, reflection: string) => void
}

function Reflection({
  slide,
  responses = [],
  responded,
  addReflection,
}: ReflectionProps) {
  const [reflection, setReflection] = useState("")
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
            {slide.content.title}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 bg-green-300">
            {responded && (
              <div className="mt-4 grid grid-cols-1 gap-4 bg-green-500">
                YOUR REFLECTION
              </div>
            )}

            {!responded && (
              <>
                <textarea
                  className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-lg"
                  placeholder="Enter your reflection here..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-purple-900/10 text-sm font-semibold rounded-md"
                  onClick={() => addReflection?.(slide, reflection)}
                >
                  Submit
                </button>
              </>
            )}
            {responded && (
              <div className="mt-4 grid grid-cols-1 gap-4 bg-green-500">
                <h3 className="text-lg font-semibold text-white">
                  OTHER REFLECTIONS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {responses.map(
                    (
                      response: { username: string; reflection: string },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-md"
                        style={{
                          borderColor: slide.content.textColor,
                        }}
                      >
                        <p
                          className="text-lg font-medium"
                          style={{ color: slide.content.textColor }}
                        >
                          {response.username}
                        </p>
                        <p
                          className="text-gray-600 font-semibold"
                          style={{ color: slide.content.textColor }}
                        >
                          {response.reflection}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reflection
