import { useContext, useEffect, useState } from 'react'

import { Button } from '@nextui-org/react'

import { AnonymousToggle } from './AnonymousToggle'
import { PollVotes } from './PollVotes'

import { PollResponse } from '@/components/common/content-types/Poll/PollResponse'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { type EventSessionContextType } from '@/types/event-session.type'
import { PollFrame, Vote } from '@/types/frame.type'
import { cn } from '@/utils/utils'

interface PollProps {
  frame: PollFrame
  votes?: Vote[]
  voted?: boolean
  canVote?: boolean
}

export function Poll({ frame, votes = [], voted, canVote = true }: PollProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voteButtonVisible, setVoteButtonVisible] = useState<boolean>(false)
  const { currentUser } = useAuth()
  const { onVote } = useContext(EventSessionContext) as EventSessionContextType
  const [makeMyVoteAnonymous, setMakeMyVoteAnonymous] = useState<boolean>(
    votes.find((vote) => vote.participant.enrollment.user_id === currentUser.id)
      ?.response.anonymous || false
  )

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
    if (showResponses) {
      return <PollResponse frame={frame} votes={votes} />
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
      })}
      style={{
        backgroundColor: frame.config.backgroundColor,
      }}>
      <RenderIf isTrue={showAnonymousToggle}>
        <AnonymousToggle
          votes={votes}
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
  )
}
