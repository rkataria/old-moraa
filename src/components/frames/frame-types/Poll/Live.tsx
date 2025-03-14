/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { Chip } from '@heroui/react'

import { AnonymousToggle } from './AnonymousToggle'
import { PollResponse } from './PollResponse'
import { PollVotes } from './PollVotes'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { useStoreSelector } from '@/hooks/useRedux'
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

export function Polls({ frame }: LiveProps) {
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

  const pollStarted = session?.data?.framesConfig?.[frame.id]?.pollStarted

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

  const renderContent = () => {
    if (showResponses || !pollStarted) {
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
            color={pollStarted ? 'success' : 'warning'}>
            {pollStarted ? 'Poll is active' : 'Poll is closed'}
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

export function Live({ frame }: { frame: PollFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div className="p-4">
        <Polls frame={frame} />
      </div>
    </SideImageLayout>
  )
}
