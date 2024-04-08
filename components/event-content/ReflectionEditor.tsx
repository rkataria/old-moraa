'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useThrottle } from '@uidotdev/usehooks'
import TextareaAutosize from 'react-textarea-autosize'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

interface ReflectionEditorProps {
  slide: ISlide
}

export function ReflectionEditor({ slide }: ReflectionEditorProps) {
  const [title, setTitle] = useState(slide.content?.title)
  const throttledTitle = useThrottle(title, 500)

  const { updateSlide } = useContext(EventContext) as EventContextType
  useEffect(() => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        title: throttledTitle,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledTitle])

  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8">
      <TextareaAutosize
        placeholder="Title"
        defaultValue={slide.content?.title}
        maxLength={TITLE_CHARACTER_LIMIT}
        onChange={updateTitle}
        className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800 resize-none"
      />
    </div>
  )
}
