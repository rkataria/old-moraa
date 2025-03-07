import { HorizontalPreview } from './HorizontalPreview'
import { VerticalPreview } from './VerticalPreview'

import { getAvatar, getProfileName } from '@/components/common/UserAvatar'
import { PollFrame, PollOption, Vote } from '@/types/frame.type'

interface PollProps {
  frame: PollFrame
  votes: Vote[]
  disableAnimation?: boolean
}

export function PollResponse({
  frame,
  votes = [],
  disableAnimation,
}: PollProps) {
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

  const polls = options.map((option: PollOption) => ({
    ...option,
    percentage: getOptionWidth(option.id),
    votedUsers: getVotedUserForOption(option.id),
  }))

  const verticalPreview = frame.config.visualization === 'vertical'

  return (
    <div className="w-full h-full">
      {verticalPreview ? (
        <VerticalPreview options={polls} disableAnimation={disableAnimation} />
      ) : (
        <HorizontalPreview
          options={polls}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}
