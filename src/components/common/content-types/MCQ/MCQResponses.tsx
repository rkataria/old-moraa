import { Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { RxCrossCircled } from 'react-icons/rx'

import { RenderIf } from '../../RenderIf/RenderIf'
import { getAvatar, getProfileName } from '../../UserAvatar'
import { VotedUsers } from '../Poll/VotedUsers'

import { useAuth } from '@/hooks/useAuth'
import { MCQFrame, MCQOption, Vote } from '@/types/frame.type'
import { cn, isColorDark } from '@/utils/utils'

interface MCQProps {
  frame: MCQFrame
  votes: Vote[]
  disableAnimation?: boolean
}

export function AllResponses({
  frame,
  votes = [],
  disableAnimation,
}: MCQProps) {
  const { options } = frame.content

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

  const getOptionWidth = (optionname: string) => {
    if (votes.length === 0 || !optionsVoteCount[optionname]) return 0

    const totalVotesCount = Object.values(optionsVoteCount).reduce(
      (total, quantity) => total + quantity,
      0
    )

    return Math.round((optionsVoteCount[optionname] * 100) / totalVotesCount)
  }

  const getVotedUserForOption = (optionName: string) => {
    const users = votes.filter((vote) =>
      vote.response.selected_options?.includes(optionName)
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users_ = users.map((user: any) => {
      const userprofile = user.participant.enrollment.profile

      return {
        name: getProfileName(userprofile),
        avatar_url: getAvatar(userprofile),
        isAnonymous: user.response?.anonymous,
      }
    })

    return users_
  }

  const mcqs = options.map((option: MCQOption) => ({
    ...option,
    percentage: getOptionWidth(option.id),
    votedUsers: getVotedUserForOption(option.id),
  }))

  const animatedProps = (width: number) =>
    disableAnimation
      ? {
          initial: { width: `${width}%` },
          animate: { width: `${width}%` },
        }
      : {
          initial: { width: 0 },
          animate: { width: `${width}%` },
        }

  return (
    <div className="w-full h-full">
      <div className={cn('rounded-md relative')}>
        <div className="grid gap-4">
          {mcqs.map((option) => (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-400  w-[42px] font-medium">
                {option.percentage}%
              </p>
              <div className="relative w-full min min-h-[60px] bg-white z-0 flex justify-between items-center gap-2 p-4 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3">
                  <RenderIf isTrue={!option.selected}>
                    <div className="relative z-[10] w-5 h-5 rounded-full border border-gray-400" />
                  </RenderIf>
                  <RenderIf isTrue={!!option.selected}>
                    <IoCheckmarkCircle
                      className="relative z-[10]  rounded-full text-green-500 shadow-[0_0_10px_-4px] bg-white"
                      size={22}
                    />
                  </RenderIf>
                  <p
                    className={cn('font-bold z-[1]', {
                      'text-white':
                        isColorDark(option.color) && option.percentage !== 0,
                    })}>
                    {option.name}
                  </p>
                </div>

                <motion.div
                  className={cn('absolute left-0 h-full rounded-xl', {
                    'bg-green-200': option.selected,
                    'bg-red-200': !option.selected,
                  })}
                  key={option.id}
                  {...animatedProps(option.percentage)}
                  transition={{
                    duration: 1,
                    type: 'spring',
                  }}
                />
                <div className="absolute right-4">
                  <VotedUsers users={option.votedUsers} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MCQResponsesProps {
  frame: MCQFrame
  votes: Vote[]
  disableAnimation?: boolean
  showIndividualResponses?: boolean
}

export function MCQResponses({
  showIndividualResponses,
  frame,
  votes = [],
  disableAnimation,
}: MCQResponsesProps) {
  const { currentUser } = useAuth()
  const { options } = frame.content

  const userVotedOptions =
    votes.find((vote) => vote.participant.enrollment.user_id === currentUser.id)
      ?.response.selected_options || []

  const correctOptions = options
    .filter((option) => option.selected)
    .map((option) => option.id)

  const getUserCorrect = () => {
    // Check if the user selected exactly the correct options
    const isUserCorrect = userVotedOptions.every((id) =>
      correctOptions.includes(id)
    )

    return isUserCorrect
  }

  const isUserCorrectVoted = getUserCorrect()

  if (showIndividualResponses) {
    return (
      <div className={cn('rounded-md relative')}>
        <div className="grid gap-4">
          {options.map((option) => {
            const optionIsVotedAndCorrect =
              isUserCorrectVoted && userVotedOptions.includes(option.id)

            const optionIsVotedAndWrong =
              !isUserCorrectVoted && userVotedOptions.includes(option.id)
            const optionIsNotVotedAndCorrect =
              !userVotedOptions.includes(option.id) &&
              correctOptions.includes(option.id)

            const optionIsNotVotedAndWrong =
              !userVotedOptions.includes(option.id) &&
              !correctOptions.includes(option.id)

            return (
              <div
                className={cn(
                  'relative w-full min min-h-[60px]  bg-white z-0 flex items-center gap-2 p-4 rounded-xl overflow-hidden',
                  {
                    'bg-green-100': optionIsVotedAndCorrect,
                    'bg-red-100': optionIsVotedAndWrong,
                    'opacity-50': optionIsNotVotedAndWrong,
                  }
                )}>
                <div className="flex items-center gap-3">
                  <RenderIf isTrue={optionIsVotedAndCorrect}>
                    <IoCheckmarkCircle
                      className="relative z-[10] rounded-full text-green-500 shadow-[0_0_10px_-4px] bg-white"
                      size={20}
                    />
                  </RenderIf>

                  <RenderIf isTrue={optionIsVotedAndWrong}>
                    <RxCrossCircled
                      className="relative z-[10] rounded-full text-red-500 shadow-[0_0_10px_-4px] bg-white"
                      size={20}
                    />
                  </RenderIf>

                  <RenderIf isTrue={!userVotedOptions.includes(option.id)}>
                    <div className="relative z-[10] w-5 h-5 rounded-full border border-gray-400" />
                  </RenderIf>

                  <p
                    className={cn('font-bold z-[1]', {
                      'text-white': isColorDark(option.color),
                    })}>
                    {option.name}
                  </p>
                </div>
                <RenderIf
                  isTrue={
                    optionIsVotedAndCorrect || optionIsNotVotedAndCorrect
                  }>
                  <Chip
                    size="sm"
                    variant="solid"
                    color="success"
                    radius="sm"
                    className="absolute right-4 text-white">
                    Correct
                  </Chip>
                </RenderIf>
                <RenderIf isTrue={optionIsVotedAndWrong}>
                  <Chip
                    size="sm"
                    variant="solid"
                    color="danger"
                    radius="sm"
                    className="absolute right-4 text-white">
                    Wrong
                  </Chip>
                </RenderIf>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <AllResponses
      frame={frame}
      votes={votes}
      disableAnimation={disableAnimation}
    />
  )
}
