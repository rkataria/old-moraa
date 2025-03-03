/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { Chip } from '@heroui/react'

import { MCQResponses } from './MCQResponses'
import { MCQVotes } from './MCQVotes'
import { AnonymousToggle } from '../Poll/AnonymousToggle'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useStoreSelector } from '@/hooks/useRedux'
import { MCQFrame, Vote, type PollFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type LiveProps = {
  frame: MCQFrame
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

export function MCQs({ frame }: LiveProps) {
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

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const mcqStarted = session?.data?.framesConfig?.[frame.id]?.mcqStarted

  useEffect(() => {
    if (voted || !canVote) {
      setVoteButtonVisible(false)
    } else {
      setVoteButtonVisible(true)
    }
  }, [voted, canVote, frame.config.allowVoteOnMultipleOptions, selectedOptions])

  const showResponses = !canVote || voted
  const renderContent = () => {
    if (showResponses) {
      return (
        <MCQResponses
          showIndividualResponses={!isHost}
          frame={frame}
          votes={votes as Vote[]}
        />
      )
    }

    return (
      <MCQVotes
        voted={voted}
        canVote={canVote}
        frame={frame}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        disabled={!mcqStarted}
      />
    )
  }

  const showAnonymousToggle = canVote && frame.config.allowVoteAnonymously

  const withImage = frame.config?.image?.url

  return (
    <div className="flex flex-col h-full">
      <FrameTitleDescriptionPreview
        frame={frame}
        afterTitle={
          <Chip
            variant="flat"
            size="sm"
            className="rounded-lg -translate-y-1.5 translate-x-4"
            color={mcqStarted ? 'success' : 'warning'}>
            {mcqStarted ? 'MCQ is active' : 'MCQ is closed'}
          </Chip>
        }
      />
      <div
        className={cn('w-full h-full rounded-md relative', {
          'h-[31.875rem]':
            frame.config.visualization === 'vertical' && showResponses,
          'w-full max-w-[46rem]':
            frame.config.visualization !== 'vertical' &&
            showResponses &&
            !withImage,
          'mt-6':
            !showAnonymousToggle && frame.config.visualization !== 'vertical',

          'mt-16':
            !showAnonymousToggle && frame.config.visualization === 'vertical',
        })}>
        {renderContent()}
        <RenderIf
          isTrue={showAnonymousToggle && voteButtonVisible && mcqStarted}>
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
        <RenderIf isTrue={voteButtonVisible && mcqStarted}>
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

export function Live({ frame }: { frame: PollFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div className="p-4">
        <MCQs frame={frame} />
      </div>
    </SideImageLayout>
  )
}
