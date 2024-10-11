/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Dispatch, SetStateAction, useContext, useState } from 'react'

import { PollBar } from './PollBar'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { PollFrame, PollOption } from '@/types/frame.type'
import { cn } from '@/utils/utils'

interface IPollVotes {
  frame: PollFrame
  voted: boolean | undefined
  canVote: boolean
  makeMyVoteAnonymous: boolean
  selectedOptions: string[]
  setSelectedOptions: Dispatch<SetStateAction<string[]>>
}

export function PollVotes({
  frame,
  voted,
  canVote,
  makeMyVoteAnonymous,
  selectedOptions,
  setSelectedOptions,
}: IPollVotes) {
  const { options } = frame.content
  const [disableVotes, setDisableVotes] = useState(false)

  const { onVote } = useContext(EventSessionContext) as EventSessionContextType

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

  return (
    <div className="grid gap-4">
      {options.map((option: PollOption) => (
        <div
          key={option.name}
          className={cn(
            'relative w-full z-0 flex justify-between  border border-[#ebebeb] items-center gap-2 p-4 h-12 rounded-lg overflow-hidden',
            {
              'cursor-default': voted || !canVote,
            },
            {
              'cursor-pointer': !voted || canVote,
            }
          )}
          onClick={() => {
            if (
              voted ||
              !canVote ||
              frame.config.allowVoteOnMultipleOptions ||
              disableVotes
            ) {
              return
            }

            onVote(frame, {
              selectedOptions: [option.id],
              anonymous: makeMyVoteAnonymous,
            })
            setDisableVotes(true)
          }}>
          <PollBar
            frame={frame}
            pollOption={option}
            voted={voted}
            canVote={canVote}
            isOptionSelected={isOptionSelected}
            handleVoteCheckbox={handleVoteCheckbox}
          />
        </div>
      ))}
    </div>
  )
}
