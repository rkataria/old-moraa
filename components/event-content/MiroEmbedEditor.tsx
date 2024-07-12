'use client'

import { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'
import { type IFrame } from '@/types/frame.type'

export type MiroEmbedFrameType = IFrame & {
  content: {
    boardId: string
  }
}
interface MiroEmbedEditorProps {
  frame: MiroEmbedFrameType
  viewOnly?: boolean
}

export function MiroEmbedEditor({
  frame,
  viewOnly = false,
}: MiroEmbedEditorProps) {
  const [boardIdentifier, setBoardIdentifier] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const { preview, updateFrame } = useContext(EventContext) as EventContextType

  const isEmbedView = !isEditMode || preview || viewOnly

  useEffect(() => {
    setIsEditMode(!frame.content?.boardId)
    setBoardIdentifier(frame.content?.boardId || '')
  }, [frame.content.boardId])

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

    if (frame.content.boardId === boardId) return

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          boardId,
        },
      },
      frameId: frame.id,
    })
    setIsEditMode(false)
  }

  if (isEmbedView) {
    return <MiroEmbed frame={frame} />
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
