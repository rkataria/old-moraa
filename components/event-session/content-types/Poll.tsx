/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */

'use client'

import React from 'react'

import clsx from 'clsx'

import { useAuth } from '@/hooks/useAuth'
import { ISlide } from '@/types/slide.type'

interface PollProps {
  slide: ISlide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votes?: any
  voted?: boolean
  isHost?: boolean
  votePoll?: (slide: ISlide, option: string) => void
}

export function Poll({
  slide,
  votes = [],
  voted,
  isHost,
  votePoll,
}: PollProps) {
  const { options, question } = slide.content

  const { currentUser } = useAuth()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionsWithVote = options.reduce((acc: any, option: any) => {
    acc[option] = 0

    return acc
  }, {})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votes.forEach((vote: any) => {
    const {
      response: { selected_option },
    } = vote

    optionsWithVote[selected_option] += optionsWithVote[selected_option]
  })

  const hasVotedOn = (option: string) =>
    votes.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vote: any) =>
        vote.response.selected_option === option &&
        vote.participant.enrollment.user_id === currentUser.id
    )

  const getOptionWidth = (option: string) => {
    if (votes.length === 0) return 0

    return Math.round((optionsWithVote[option] * 100) / votes.length)
  }

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}>
      <div className="w-4/5 mt-10 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.content.textColor,
            }}>
            {question}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4">
            {options.map((option: string) => (
              <div
                key={option}
                className={clsx(
                  'relative w-full z-0 flex justify-between items-center gap-2 bg-purple-200 p-4 rounded-lg overflow-hidden',
                  {
                    'cursor-default': voted || isHost,
                  },
                  {
                    'cursor-pointer': !(voted || isHost),
                  }
                )}
                onClick={() => {
                  if (voted || isHost) return
                  votePoll?.(slide, option)
                }}>
                <div
                  className={clsx(
                    'absolute transition-all left-0 top-0 h-full z-[-1] w-0',
                    { 'bg-purple-500': hasVotedOn(option) || isHost }
                  )}
                  style={{
                    width: `${getOptionWidth(option)}%`,
                  }}
                />
                <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-xl font-bold text-black/10 pointer-events-none">
                  {getOptionWidth(option)}%
                </div>

                <span className="font-bold">{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
