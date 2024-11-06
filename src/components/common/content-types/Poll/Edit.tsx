/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

import { useThrottle } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'
import { BsTrash3 } from 'react-icons/bs'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { v4 as uuidv4 } from 'uuid'

import { ColorPicker } from '@/components/common/ColorPicker'
import { FrameText } from '@/components/event-content/FrameText'
import { FrameTextBlock } from '@/components/event-content/FrameTextBlock'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { PollFrame, PollOption } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type EditProps = {
  frame: PollFrame
}

export function Edit({ frame: frameFromRemote }: EditProps) {
  const optionsRef = useRef<any>([])

  const { updateFrame } = useEventContext()
  const [options, setOptions] = useState<PollOption[]>(
    frameFromRemote.content?.options || []
  )
  const throttledOptions = useThrottle(options, 500)

  const updateOption = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newOptions = [...options]
    // TODO: any normal way to update this was not triggering update frame
    newOptions[index] = {
      name: `${e.target.value}`,
      color: newOptions[index].color,
      id: newOptions[index].id,
    }
    setOptions(newOptions)
  }

  const handlePollColor = (updatedColor: string, index: number) => {
    const newOptions = [...options]
    // TODO: any normal way to update this was not triggering update frame
    newOptions[index] = {
      name: newOptions[index].name,
      color: updatedColor,
      id: newOptions[index].id,
    }
    setOptions(newOptions)
  }

  const deleteOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const addNewOption = () => {
    setOptions([...options, { name: '', color: '#E7E0FF', id: uuidv4() }])
  }

  const focusOnFirstEmptyOption = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      const indexOfFirstEmptyOption = options.findIndex(
        (option) => option?.name?.length === 0
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
        key={frameFromRemote.id}
        type="title"
        disableEnter
        onSuccessiveEnters={focusOnFirstEmptyOption}
      />
      <FrameTextBlock blockType="paragraph" />
      <div className={cn('w-full h-auto flex justify-start items-start mt-8')}>
        <div className="w-[46rem]">
          <ul className="mb-4 grid gap-4">
            {options.map(
              (option: { name: string; color: string }, index: number) => (
                <li
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="relative flex items-center gap-4 text-foreground group/poll">
                  <div className="w-full py-2.5 rounded-md bg-white">
                    <ReactTextareaAutosize
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ref={(el: any) => {
                        optionsRef.current[index] = el
                      }}
                      className={cn(
                        'w-full text-md text-left pl-4 bg-transparent font-medium border-0 outline-none focus:border-0 focus:ring-0 hover:outline-none resize-none'
                      )}
                      value={option.name}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => updateOption(e, index)}
                      onKeyDown={focusOnFirstEmptyOption}
                    />
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover/poll:opacity-100 duration-100">
                    <BsTrash3
                      onClick={() => deleteOption(index)}
                      className="text-black/25 hover:text-black/50 text-lg cursor-pointer"
                    />
                    <ColorPicker
                      onchange={(color) => handlePollColor(color, index)}
                      defaultColor={option.color}
                      className="w-4 h-4 rounded-sm cursor-pointer max-w-4 overflow-hidden"
                    />
                  </div>
                </li>
              )
            )}
          </ul>
          <Button
            variant="solid"
            color="primary"
            radius="md"
            onClick={addNewOption}>
            + Add option
          </Button>
        </div>
      </div>
    </>
  )
}
