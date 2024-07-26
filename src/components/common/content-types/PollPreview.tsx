import { Avatar, AvatarGroup, Checkbox } from '@nextui-org/react'

import { useAuth } from '@/hooks/useAuth'
import { IFrame } from '@/types/frame.type'
import { cn, getAvatarForName } from '@/utils/utils'

export type PollFrame = IFrame & {
  content: {
    question: string
    options: string[]
  }
}

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
        avatar_url?: string
      }
    }
  }
  response: VoteResponse
}
interface VoteUsersProps {
  votes: Vote[]
  option: string
}

interface PollProps {
  frame: IFrame & {
    content: {
      question: string
      options: string[]
    }
  }
  votes?: Vote[]
  voted?: boolean
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
            const url = getAvatarForName(
              `${enrollment.profile.first_name} ${enrollment.profile.last_name}`,
              enrollment.profile.avatar_url
            )

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

function PollOption({ frame, pollOption, voted }: PollOptionProps) {
  if (frame.config.allowVoteOnMultipleOptions && !voted) {
    return (
      <Checkbox
        isReadOnly
        radius="sm"
        classNames={{
          label: 'font-bold text-black',
          wrapper: 'border-2 border-primary-500 rounded',
        }}>
        {pollOption}
      </Checkbox>
    )
  }

  return <p className="font-bold">{pollOption}</p>
}

export function PollPreview({ frame, votes = [], voted }: PollProps) {
  const { options } = frame.content
  const { currentUser } = useAuth()

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

  return (
    <div
      className="w-full min-h-full flex justify-start items-start"
      style={{
        backgroundColor: frame.config.backgroundColor,
      }}>
      <div className="w-4/5 rounded-md relative">
        <div className="mt-4 grid grid-cols-1 gap-2">
          {options.map((option: string) => (
            <div
              key={option}
              className={cn(
                'relative w-full h-14 px-4 z-0 flex justify-between items-center gap-2 bg-primary-50 rounded-lg overflow-hidden'
              )}>
              <div
                className={cn(
                  'absolute transition-all left-0 top-0 h-full z-[-1] w-0',
                  {
                    'bg-primary-500': votedOptions.includes(option),
                  }
                )}
                style={{
                  width: `${getOptionWidth(option)}%`,
                }}
              />
              <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-xl font-bold text-black/10 pointer-events-none">
                {getOptionWidth(option)}%
              </div>
              <PollOption frame={frame} pollOption={option} voted={voted} />
              <div className="absolute right-4">
                <VoteUsers votes={votes} option={option} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
