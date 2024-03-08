'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useThrottle } from '@uidotdev/usehooks'
import TextareaAutosize from 'react-textarea-autosize'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'

interface CoverEditorProps {
  slide: ISlide
}

export function CoverEditor({ slide }: CoverEditorProps) {
  const [title, setTitle] = useState<string>(slide.content.title)
  const [description, setDescription] = useState<string>(
    slide.content.description
  )
  const throttledTitle = useThrottle(title, 500)
  const throttledDescription = useThrottle(description, 500)

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        title: throttledTitle,
        description: throttledDescription,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledTitle, throttledDescription])

  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }

  const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8">
      <TextareaAutosize
        maxLength={100}
        placeholder="Title"
        defaultValue={slide.content.title}
        onChange={updateTitle}
        className="w-full p-2 text-center border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800 resize-none"
      />
      <TextareaAutosize
        maxLength={300}
        placeholder="This is a description"
        defaultValue={slide.content.description}
        className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl resize-none"
        onChange={updateDescription}
      />
    </div>
  )
}
