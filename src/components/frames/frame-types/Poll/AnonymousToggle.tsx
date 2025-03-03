import { Dispatch, SetStateAction, useContext } from 'react'

import { Checkbox, CheckboxProps } from '@heroui/react'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { Vote } from '@/types/frame.type'

interface IAnonymouseToggle {
  votes: Vote[]
  currentUserId: string
  setMakeMyVoteAnonymous: Dispatch<SetStateAction<boolean>>
  makeMyVoteAnonymous: boolean
  checkboxProps?: CheckboxProps
}

export function AnonymousToggle({
  votes,
  currentUserId,
  setMakeMyVoteAnonymous,
  makeMyVoteAnonymous,
  checkboxProps,
}: IAnonymouseToggle) {
  const { onUpdateVote } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const selfVote = votes.find(
    (vote: Vote) => vote.participant.enrollment.user_id === currentUserId
  )

  return (
    <Checkbox
      {...checkboxProps}
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
  )
}
