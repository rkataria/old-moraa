import { useContext, useState, useEffect } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'
import TextareaAutosize from 'react-textarea-autosize'

import { ContentType } from '../common/ContentTypePicker'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getFrameName } from '@/utils/getFrameName'
import { cn } from '@/utils/utils'

export function FrameText({
  type,
  className,
  disableEnter,
  onSuccessiveEnters,
}: {
  type: string
  className?: string
  disableEnter?: boolean
  onSuccessiveEnters?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const { preview, updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  const placeholder =
    currentFrame?.type === ContentType.POLL
      ? "What's the question?"
      : "What's the title?"

  const getChangedKey = () => {
    if (currentFrame?.type === ContentType.POLL && type === 'title') {
      return 'question'
    }

    return type
  }

  const changedKey: string = getChangedKey()

  const [updatedText, setUpdatedText] = useState<string | undefined>(
    currentFrame?.content?.[changedKey] as string
  )
  const debouncedText = useDebounce(updatedText, 500)
  const [successiveEnterPressCount, setSuccessiveEnterPressCount] = useState(0)

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (preview) return
    setUpdatedText(e.target.value)
  }

  const onTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disableEnter && e.key === 'Enter') {
      e.preventDefault()

      return
    }

    if (e.key !== 'Enter') {
      setSuccessiveEnterPressCount(0)

      return
    }
    if (successiveEnterPressCount < 1) {
      setSuccessiveEnterPressCount(successiveEnterPressCount + 1)

      return
    }
    if (successiveEnterPressCount === 1) {
      setUpdatedText(updatedText?.trim())
      onSuccessiveEnters?.(e)
      setSuccessiveEnterPressCount(0)
    }
  }

  useEffect(() => {
    if (!currentFrame) return

    if (isEqual(debouncedText, currentFrame?.content?.[changedKey])) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...currentFrame.content,
          [changedKey]: debouncedText,
        },
        name: getFrameName({
          frame: {
            ...currentFrame,
            content: {
              ...currentFrame.content,
              [changedKey]: debouncedText,
            },
          },
        }),
      },
      frameId: currentFrame.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText])

  if (!currentFrame?.config.showTitle && type === 'header') {
    return null
  }

  if (!currentFrame?.config.showDescription && type === 'description') {
    return null
  }

  return (
    <TextareaAutosize
      placeholder={placeholder}
      disabled={preview}
      // autoFocus={updatedText?.length === 0 || !updatedText} // FIXME: This conflicts with the arrow key navigation for agenda panel
      value={updatedText}
      maxLength={TITLE_CHARACTER_LIMIT}
      onChange={updateText}
      onKeyDown={onTextKeyDown}
      className={cn(
        'w-full text-start border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 font-bold text-gray-800 placeholder-gray-500 resize-none',
        className,
        {
          'text-4xl': ['question', 'title'].includes(changedKey),
        }
      )}
    />
  )
}
