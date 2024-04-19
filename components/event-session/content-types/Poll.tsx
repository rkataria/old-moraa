/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useContext, useEffect, useState } from 'react'

import { Avatar, AvatarGroup, Button, Checkbox } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { type EventContextType } from '@/types/event-context.type'
import { type EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { cn, getAvatarForName } from '@/utils/utils'

export type VoteResponse = {
  selected_options: string[]
  anonymous: boolean
}

export type Vote = {
  id: string
  participant: {
    enrollment: {
      user_id: string
      profile: {
        first_name: string
        last_name: string
      }
    }
  }
  response: VoteResponse
}
interface VoteUsersProps {
  votes: Vote[]
  option: string
}

function VoteUsers({ votes, option }: VoteUsersProps) {
  const voteUsers = votes.filter((vote) =>
    vote.response.selected_options?.includes(option)
  )

  if (!voteUsers || voteUsers.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      <AvatarGroup
        isBordered
        max={5}
        total={voteUsers.length}
        renderCount={(count) =>
          count > 5 && (
            <p className="text-sm font-medium ms-2">+{count - 5} more votes</p>
          )
        }>
        {voteUsers.map((voterData) => {
          const { enrollment } = voterData.participant
          const isAnonymous = voterData.response.anonymous

          if (isAnonymous) {
            return (
              <Avatar
                isBordered
                showFallback
                className="h-8 w-8 cursor-pointer"
                size="sm"
              />
            )
          }

          if (enrollment.profile.first_name) {
            const name = [
              enrollment.profile.first_name ?? '',
              enrollment.profile.last_name ?? '',
            ].join(' ')
            const url = getAvatarForName(name)

            return <Avatar src={url} size="sm" />
          }

          return (
            <Avatar isBordered className="h-8 w-8 cursor-pointer" size="sm" />
          )
        })}
      </AvatarGroup>
    </div>
  )
}

interface PollOptionProps {
  slide: ISlide & {
    content: {
      question: string
      options: string[]
    }
  }
  voted?: boolean
  pollOption: string
  isOwner?: boolean
  isOptionSelected: (option: string) => boolean
  handleVoteCheckbox: (option: string) => void
}

function PollOption({
  slide,
  pollOption,
  isOwner,
  voted,
  isOptionSelected,
  handleVoteCheckbox,
}: PollOptionProps) {
  if (slide.config.allowVoteOnMultipleOptions && !isOwner && !voted) {
    return (
      <Checkbox
        isSelected={isOptionSelected(pollOption)}
        onValueChange={() => handleVoteCheckbox(pollOption)}
        isReadOnly={isOwner}
        radius="sm"
        classNames={{
          label: 'font-bold text-black',
          wrapper: 'border-2 border-purple-500 rounded',
        }}>
        {pollOption}
      </Checkbox>
    )
  }

  return <p className="font-bold">{pollOption}</p>
}

interface PollProps {
  slide: ISlide & {
    content: {
      question: string
      options: string[]
    }
  }
  votes?: Vote[]
  voted?: boolean
  isOwner?: boolean
}

export function Poll({ slide, votes = [], voted, isOwner }: PollProps) {
  const { options, question } = slide.content
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voteButtonVisible, setVoteButtonVisible] = useState<boolean>(false)
  const { currentUser } = useAuth()
  const { eventMode } = useContext(EventContext) as EventContextType
  const { onVote, onUpdateVote } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [makeMyVoteAnonymous, setMakeMyVoteAnonymous] = useState<boolean>(
    votes.find((vote) => vote.participant.enrollment.user_id === currentUser.id)
      ?.response.anonymous || false
  )

  useEffect(() => {
    if (
      voted ||
      isOwner ||
      !slide.config.allowVoteOnMultipleOptions ||
      selectedOptions.length === 0
    ) {
      setVoteButtonVisible(false)
    } else {
      setVoteButtonVisible(true)
    }
  }, [voted, isOwner, slide.config.allowVoteOnMultipleOptions, selectedOptions])

  const isOptionSelected = (option: string) => selectedOptions.includes(option)

  const handleVoteCheckbox = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((vote) => vote !== option)
      )

      return
    }
    setSelectedOptions((prevSelectedOptions) => [
      ...prevSelectedOptions,
      option,
    ])
  }

  const optionsVoteCount = votes.reduce(
    (
      acc: {
        [key: string]: number
      },
      vote: Vote
    ) => {
      vote.response.selected_options?.forEach((option: string) => {
        acc[option] = (acc[option] || 0) + 1
      })

      return acc
    },
    {}
  )

  const getOptionWidth = (option: string) => {
    if (votes.length === 0 || !optionsVoteCount[option]) return 0

    return Math.round((optionsVoteCount[option] * 100) / votes.length)
  }

  const selfVote = votes.find(
    (vote: Vote) => vote.participant.enrollment.user_id === currentUser.id
  )

  const votedOptions = selfVote?.response.selected_options || []
  const showAnonymousToggle =
    eventMode === 'present' && !isOwner && slide.config.allowVoteAnonymously

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.config.backgroundColor,
      }}>
      <div className="w-4/5 mt-10 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.config.textColor,
            }}>
            {question}
          </h2>
          {showAnonymousToggle && (
            <div className="my-2 flex justify-end items-center">
              <Checkbox
                size="sm"
                className="items-baseline"
                isSelected={makeMyVoteAnonymous}
                onValueChange={(checked) => {
                  if (!selfVote) {
                    setMakeMyVoteAnonymous(checked)

                    return
                  }

                  onUpdateVote(selfVote.id, {
                    ...selfVote.response,
                    anonymous: checked,
                  })
                  setMakeMyVoteAnonymous(checked)
                }}>
                Make my vote anonymous
              </Checkbox>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4">
            {options.map((option: string) => (
              <div
                key={option}
                className={cn(
                  'relative w-full z-0 flex justify-between items-center gap-2 bg-purple-200 p-4 h-12 rounded-lg overflow-hidden',
                  {
                    'cursor-default': voted || isOwner,
                  },
                  {
                    'cursor-pointer': !voted || !isOwner,
                  }
                )}
                onClick={() => {
                  if (
                    voted ||
                    isOwner ||
                    slide.config.allowVoteOnMultipleOptions
                  ) {
                    return
                  }

                  onVote(slide, {
                    selectedOptions: [option],
                    anonymous: makeMyVoteAnonymous,
                  })
                }}>
                <div
                  className={cn(
                    'absolute transition-all left-0 top-0 h-full z-[-1] w-0',
                    {
                      'bg-purple-500': votedOptions.includes(option) || isOwner,
                    }
                  )}
                  style={{
                    width: `${getOptionWidth(option)}%`,
                  }}
                />
                <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-xl font-bold text-black/10 pointer-events-none">
                  {getOptionWidth(option)}%
                </div>
                <PollOption
                  slide={slide}
                  pollOption={option}
                  isOwner={isOwner}
                  voted={voted}
                  isOptionSelected={isOptionSelected}
                  handleVoteCheckbox={handleVoteCheckbox}
                />
                <div className="absolute right-4">
                  <VoteUsers votes={votes} option={option} />
                </div>
              </div>
            ))}
            {voteButtonVisible && (
              <div className="flex justify-end items-center mt-8 mb-4">
                <Button
                  type="button"
                  color="primary"
                  onClick={() =>
                    onVote(slide, {
                      selectedOptions,
                      anonymous: makeMyVoteAnonymous,
                    })
                  }>
                  Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
