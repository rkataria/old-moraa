/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Dispatch, SetStateAction } from 'react'

import { Radio, RadioGroup } from '@nextui-org/react'

import { MCQFrame, MCQOption } from '@/types/frame.type'
import { cn } from '@/utils/utils'

interface IPollVotes {
  frame: MCQFrame
  voted: boolean | undefined
  canVote: boolean
  selectedOptions: string[]
  disabled?: boolean
  setSelectedOptions: Dispatch<SetStateAction<string[]>>
}

export function MCQVotes({
  frame,
  voted,
  canVote,
  selectedOptions,
  disabled = false,
  setSelectedOptions,
}: IPollVotes) {
  const { options } = frame.content
  console.log('selectedOptions', selectedOptions)

  return (
    <RadioGroup
      isDisabled={disabled}
      onValueChange={(selectedId) => setSelectedOptions([selectedId])}
      className="ml-2">
      {options.map((option: MCQOption) => (
        <Radio
          value={option.id}
          classNames={{
            base: cn(
              'bg-white items-center mb-4 rounded-lg overflow-hidden',
              'w-full max-w-full cursor-pointer gap-4 p-4 border-2 border-transparent',
              {
                'cursor-default': voted || !canVote,
              },
              {
                'cursor-pointer': !voted || canVote,
              }
            ),
          }}>
          {option.name}
        </Radio>
      ))}
    </RadioGroup>
  )
}
