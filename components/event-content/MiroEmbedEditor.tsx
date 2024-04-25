'use client'

import { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'
import { type ISlide } from '@/types/slide.type'

export type MiroEmbedSlideType = ISlide & {
  content: {
    boardId: string
  }
}
interface MiroEmbedEditorProps {
  slide: MiroEmbedSlideType
}

export function MiroEmbedEditor({ slide }: MiroEmbedEditorProps) {
  const [boardIdentifier, setBoardIdentifier] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const { preview, updateSlide } = useContext(EventContext) as EventContextType

  useEffect(() => {
    setIsEditMode(!slide.content?.boardId)
    setBoardIdentifier(slide.content?.boardId || '')
  }, [slide.content.boardId])

  function isValidURL(url: string) {
    if (
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g.test(
        url
      )
    ) {
      return true
    }

    return false
  }

  const getBoardId = () => {
    if (isValidURL(boardIdentifier)) {
      try {
        const urlObj = new URL(boardIdentifier)
        const pathParts = urlObj.pathname.split('/')
        const boardId = pathParts[pathParts.length - 2]

        return boardId
      } catch (error) {
        console.error('Error parsing URL:', error)

        return undefined
      }
    }

    return boardIdentifier
  }

  const saveMiroUrl = () => {
    const boardId = getBoardId()
    if (!boardId) return

    if (slide.content.boardId === boardId) return

    updateSlide({
      slidePayload: {
        content: {
          boardId,
        },
      },
      slideId: slide.id,
    })
    setIsEditMode(false)
  }

  if (preview || !isEditMode) {
    return <MiroEmbed slide={slide} />
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <Input
        size="sm"
        className="w-1/2 rounded-md"
        placeholder="Enter miro board url or board Id"
        onChange={(e) => setBoardIdentifier(e.target.value)}
        value={boardIdentifier}
      />
      <Button size="lg" color="primary" onClick={saveMiroUrl}>
        Save
      </Button>
    </div>
  )
}
