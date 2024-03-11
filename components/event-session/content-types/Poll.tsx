/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */

'use client'

import React from 'react'

import { Avatar, AvatarGroup } from '@nextui-org/react'

import { useAuth } from '@/hooks/useAuth'
import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface VotedUsersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votes: any[]
  option: string
}

function VotedUsers({ votes, option }: VotedUsersProps) {
  const votedUsers = votes.filter(
    (voterData) => voterData.response.selected_option === option
  )

  if (!votedUsers || votedUsers.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      <AvatarGroup
        isBordered
        max={5}
        total={votedUsers.length}
        renderCount={(count) => (
          <p className="text-sm font-medium ms-2">+{count} votes</p>
        )}>
        {votedUsers.map((voterData) => (
          <div>
            {voterData.participant.enrollment.profile.first_name ? (
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${voterData.participant.enrollment.profile.first_name} ${voterData.participant.enrollment.profile.last_name}`)}`}
                size="sm"
              />
            ) : (
              <Avatar
                isBordered
                className="h-8 w-8 cursor-pointer"
                src="https://github.com/shadcn.png"
                size="sm"
              />
            )}
          </div>
        ))}
      </AvatarGroup>
    </div>
  )
}

interface PollProps {
  slide: ISlide & {
    content: {
      question: string
      options: string[]
      backgroundColor: string
      textColor: string
    }
  }
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

    optionsWithVote[selected_option] += 1
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
                className={cn(
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
                  className={cn(
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
                <div className="absolute right-4">
                  <VotedUsers votes={votes} option={option} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
