import { useContext, useEffect, useRef, useState } from 'react'

import { IconTrash } from '@tabler/icons-react'
import { useThrottle } from '@uidotdev/usehooks'
import clsx from 'clsx'
import isEqual from 'lodash.isequal'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { FrameText } from './FrameText'
import { FrameTextBlock } from './FrameTextBlock'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

interface PollFormProps {
  frame: IFrame & {
    content: {
      question: string
      options: string[]
    }
  }
}

export function PollForm({ frame: frameFromRemote }: PollFormProps) {
  // const [successiveEnterPressCount, setSuccessiveEnterPressCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionsRef = useRef<any>([])

  const { updateFrame } = useContext(EventContext) as EventContextType
  // const question = frameFromRemote?.content?.question
  // const [question, setQuestion] = useState<string>(
  //   frameFromRemote.content.question
  // )
  const [options, setOptions] = useState<string[]>(
    frameFromRemote.content.options
  )
  // const throttledQuestion = useThrottle(question, 500)
  const throttledOptions = useThrottle(options, 500)

  // const updateQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setQuestion(e.target.value)
  // }

  const updateOption = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newOptions = [...options]
    newOptions[index] = e.target.value
    setOptions(newOptions)
  }

  const deleteOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const addNewOption = () => {
    setOptions([...options, ''])
  }

  const focusOnFirstEmptyOption = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      const indexOfFirstEmptyOption = options.findIndex(
        (option) => option?.length === 0
      )
      if (indexOfFirstEmptyOption !== -1) {
        optionsRef.current[indexOfFirstEmptyOption].focus()
        e.preventDefault()

        return
      }
      addNewOption()
      e.preventDefault()
    }
  }

  // const onQuestionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key !== 'Enter') {
  //     setSuccessiveEnterPressCount(0)

  //     return
  //   }
  //   if (successiveEnterPressCount < 1) {
  //     setSuccessiveEnterPressCount(successiveEnterPressCount + 1)

  //     return
  //   }
  //   if (successiveEnterPressCount === 1) {
  //     setQuestion(question.trim())
  //     focusOnFirstEmptyOption(e)
  //     setSuccessiveEnterPressCount(0)
  //   }
  // }

  useEffect(() => {
    if (isEqual(throttledOptions, frameFromRemote.content.options)) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frameFromRemote.content,
          // question: throttledQuestion,
          options: throttledOptions,
        },
      },
      frameId: frameFromRemote.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledOptions])

  return (
    <>
      <FrameText
        type="title"
        className="pl-4"
        disableEnter
        onSuccessiveEnters={focusOnFirstEmptyOption}
      />
      <FrameTextBlock blockType="paragraph" />
      <div
        className={clsx(
          'absolute w-4/5 h-auto flex justify-start items-start mt-4'
        )}>
        <ul className="w-full">
          {options.map((option: string, index: number) => (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="flex justify-between items-center mb-2 rounded-md font-semibold bg-primary-50 text-foreground">
              <ReactTextareaAutosize
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(el: any) => {
                  optionsRef.current[index] = el
                }}
                // autoFocus={option.length === 0 && question?.length !== 0} // FIXME: focus is conflicting with the arrow key navigation for agenda panel
                className={clsx(
                  'w-full text-left p-4 bg-transparent  border-0 outline-none focus:border-0 focus:ring-0 hover:outline-none resize-none'
                )}
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => updateOption(e, index)}
                onKeyDown={focusOnFirstEmptyOption}
              />
              <button
                type="button"
                aria-label="delete"
                className="p-4"
                onClick={() => deleteOption(index)}>
                <IconTrash size={16} />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={clsx(
                'w-full text-center p-4 border-2 border-black rounded-md mb-2 font-semibold cursor-pointer text-black outline-none hover:outline-none'
              )}
              onClick={addNewOption}>
              Add option
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
