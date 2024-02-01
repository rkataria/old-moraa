"use client"
import React from "react"
import { ISlide } from "@/types/slide.type"
import clsx from "clsx"

interface PollProps {
  slide: ISlide
  votes?: any
  voted?: boolean
  isHost?: boolean
  votePoll?: (slide: ISlide, option: string) => void
}

function Poll({ slide, votes = [], voted, isHost, votePoll }: PollProps) {
  const { options } = slide.content

  const optionsWithVote = options.reduce((acc: any, option: any) => {
    acc[option] = 0

    return acc
  }, {})

  votes.forEach((vote: any) => {
    const {
      response: { selected_option },
    } = vote

    optionsWithVote[selected_option] = optionsWithVote[selected_option] + 1
  })

  const getOptionWidth = (option: string) => {
    return Math.round((optionsWithVote[option] * 100) / votes.length)
  }

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

          <div className="mt-4 grid grid-cols-1 gap-4">
            {slide.content.options.map((option: string, index: number) => (
              <div
                key={index}
                className={clsx(
                  "relative w-full z-0 flex justify-between items-center gap-2 bg-purple-200 p-4 rounded-lg overflow-hidden"
                )}
              >
                {voted && (
                  <>
                    <div
                      className="absolute transition-all left-0 top-0 h-full bg-purple-500 z-[-1] w-0"
                      style={{
                        width: `${getOptionWidth(option)}%`,
                      }}
                    />
                    <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-xl font-bold text-black/10 pointer-events-none">
                      {getOptionWidth(option)}%
                    </div>
                  </>
                )}
                <span className="font-bold">{option}</span>
                {!voted && !isHost && (
                  <button
                    className="px-4 py-2 bg-purple-900/10 text-sm font-semibold rounded-md"
                    onClick={() => votePoll?.(slide, option)}
                  >
                    Vote
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Poll
