"use client"
import React, { useState } from "react"
import { ISlide } from "@/types/slide.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"

interface ReflectionProps {
  slide: ISlide
  responses?: any
  responded?: boolean
  user: any
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
}

function Reflection({
  slide,
  responses = [],
  responded,
  user,
  addReflection,
}: ReflectionProps) {
  const [reflection, setReflection] = useState("")
  const { meeting } = useDyteMeeting()
  const username = meeting.self.name
  const selfResponse = responses.find((res: any) => res.profile_id === user.id)
  const otherResponses = responses.filter(
    (res: any) => res.response.username !== username
  )
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

          <div className="mt-4 grid grid-cols-1 gap-4 ">
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
                  onClick={() => addReflection?.(slide, reflection, username)}
                >
                  Submit
                </button>
              </>
            )}
            {responded && (
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-300 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {/* Display the first character of the username */}
                        {username.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-medium">{username}</p>
                        <p className="text-gray-600 font-semibold">
                          {selfResponse?.response.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherResponses?.map(
                (
                  res: {
                    response: { username: string; reflection: string }
                  },
                  index: number
                ) => (
                  <div className="p-4 bg-gray-200 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {/* Display the first character of the username */}
                        {res.response.username.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-medium">
                          {res.response.username}
                        </p>
                        <p className="text-gray-600 font-semibold">
                          {res.response.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reflection
