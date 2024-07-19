/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect, useState } from 'react'

import { Avatar, AvatarGroup, Button, Checkbox } from '@nextui-org/react'

import { useAuth } from '@/hooks/useAuth'
import { IFrame } from '@/types/frame.type'
import { cn, getAvatarForName } from '@/utils/utils'

export type Vote = {
  participant: {
    enrollment: {
      user_id: string
      profile: {
        first_name: string
        last_name: string
      }
    }
  }
  response: {
    selected_options: string[]
  }
}

interface VoteUsersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votes: any[]
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
        {voteUsers.map((voterData) => (
          <div>
            {voterData.participant.enrollment.profile.first_name ? (
              <Avatar
                src={getAvatarForName(
                  `${voterData.participant.enrollment.profile.first_name} ${voterData.participant.enrollment.profile.last_name}`,
                  voterData.participant.enrollment.profile.avatar_url
                )}
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

interface PollOptionProps {
  frame: IFrame & {
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
  frame,
  pollOption,
  isOwner,
  voted,
  isOptionSelected,
  handleVoteCheckbox,
}: PollOptionProps) {
  if (frame.config.allowVoteOnMultipleOptions && !isOwner && !voted) {
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
  frame: IFrame & {
    content: {
      question: string
      options: string[]
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votes?: any
  voted?: boolean
  isOwner?: boolean
  onVote?: (frame: IFrame, options: string[]) => void
}

export function Poll({ frame, votes = [], voted, onVote, isOwner }: PollProps) {
  const { options, question } = frame.content
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voteButtonVisible, setVoteButtonVisible] = useState<boolean>(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (
      voted ||
      isOwner ||
      !frame.config.allowVoteOnMultipleOptions ||
      selectedOptions.length === 0
    ) {
      setVoteButtonVisible(false)
    } else {
      setVoteButtonVisible(true)
    }
  }, [voted, isOwner, frame.config.allowVoteOnMultipleOptions, selectedOptions])

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionsVoteCount = votes.reduce((acc: any, vote: any) => {
    vote.response.selected_options?.forEach((option: string) => {
      acc[option] = (acc[option] || 0) + 1
    })

    return acc
  }, {})

  const hasVotedOn = (option: string) =>
    votes.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vote: any) =>
        vote.response.selected_options?.includes(option) &&
        vote.participant.enrollment.user_id === currentUser.id
    )

  const getOptionWidth = (option: string) => {
    if (votes.length === 0 || !optionsVoteCount[option]) return 0

    return Math.round((optionsVoteCount[option] * 100) / votes.length)
  }

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: frame.config.backgroundColor,
      }}>
      <div className="w-4/5 mt-10 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold"
            style={{
              color: frame.config.textColor,
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
                    frame.config.allowVoteOnMultipleOptions
                  ) {
                    return
                  }

                  onVote?.(frame, [option])
                }}>
                <div
                  className={cn(
                    'absolute transition-all left-0 top-0 h-full z-[-1] w-0',
                    { 'bg-purple-500': hasVotedOn(option) || isOwner }
                  )}
                  style={{
                    width: `${getOptionWidth(option)}%`,
                  }}
                />
                <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-xl font-bold text-black/10 pointer-events-none">
                  {getOptionWidth(option)}%
                </div>
                <PollOption
                  frame={frame}
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
                  onClick={() => onVote?.(frame, selectedOptions)}>
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
