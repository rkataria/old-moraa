/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { AnonymousToggle } from './AnonymousToggle'
import { PollResponse } from './PollResponse'
import { PollVotes } from './PollVotes'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'
import { RenderIf } from '../../RenderIf/RenderIf'

import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { Vote, type PollFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type LiveProps = {
  frame: PollFrame
}

const isCurrentUserVoted = (votes: Vote[], currentUser: any) => {
  if (!votes || !Array.isArray(votes)) return false

  if (votes.length === 0) return false

  return votes.some(
    (vote) => vote.participant.enrollment.user_id === currentUser.id
  )
}

const isVoteAnonymous = (votes: Vote[], currentUser: any) => {
  if (!isCurrentUserVoted(votes, currentUser)) return false

  return (
    votes.find((vote) => vote.participant.enrollment.user_id === currentUser.id)
      ?.response.anonymous || false
  )
}

export function Live({ frame }: LiveProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voteButtonVisible, setVoteButtonVisible] = useState<boolean>(false)
  const { currentUser } = useAuth()
  const { onVote, currentFrameResponses, isHost } = useEventSession()
  const votes = currentFrameResponses || []
  const [makeMyVoteAnonymous, setMakeMyVoteAnonymous] = useState<boolean>(
    isVoteAnonymous(votes as Vote[], currentUser)
  )

  const canVote = !isHost

  const voted = isCurrentUserVoted(votes as Vote[], currentUser)

  useEffect(() => {
    if (
      voted ||
      !canVote ||
      !frame.config.allowVoteOnMultipleOptions ||
      selectedOptions.length === 0
    ) {
      setVoteButtonVisible(false)
    } else {
      setVoteButtonVisible(true)
    }
  }, [voted, canVote, frame.config.allowVoteOnMultipleOptions, selectedOptions])

  const showResponses = !canVote || voted
  console.log('votes', votes)
  const renderContent = () => {
    if (showResponses) {
      return <PollResponse frame={frame} votes={votes as Vote[]} />
    }

    return (
      <PollVotes
        voted={voted}
        canVote={canVote}
        frame={frame}
        makeMyVoteAnonymous={makeMyVoteAnonymous}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    )
  }

  const showAnonymousToggle = canVote && frame.config.allowVoteAnonymously

  return (
    <div>
      <FrameTitleDescriptionPreview frame={frame} />
      <div
        className={cn('w-full h-full rounded-md relative', {
          'h-[31.875rem]':
            frame.config.visualization === 'vertical' && showResponses,
          'w-full max-w-[46rem]':
            frame.config.visualization !== 'vertical' && showResponses,
          'mt-6':
            !showAnonymousToggle && frame.config.visualization !== 'vertical',

          'mt-16':
            !showAnonymousToggle && frame.config.visualization === 'vertical',
        })}>
        <RenderIf isTrue={showAnonymousToggle}>
          <AnonymousToggle
            votes={votes as Vote[]}
            currentUserId={currentUser.id}
            makeMyVoteAnonymous={makeMyVoteAnonymous}
            setMakeMyVoteAnonymous={setMakeMyVoteAnonymous}
            checkboxProps={{
              classNames: {
                base: cn('w-full flex justify-end py-8 max-w-none', {
                  'mb-8':
                    frame.config.visualization === 'vertical' && showResponses,
                }),
              },
            }}
          />
        </RenderIf>

        {renderContent()}
        <RenderIf isTrue={voteButtonVisible}>
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              color="primary"
              onClick={() => {
                onVote(frame, {
                  selectedOptions,
                  anonymous: makeMyVoteAnonymous,
                })
                setVoteButtonVisible(false)
              }}>
              Submit
            </Button>
          </div>
        </RenderIf>
      </div>
    </div>
  )
}
