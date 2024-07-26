import { useContext, useEffect, useState } from 'react'

import { Button, Input } from '@nextui-org/react'
import { SiMiro } from 'react-icons/si'

import { FrameFormContainer } from './FrameFormContainer'

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
    <FrameFormContainer
      headerIcon={<SiMiro size={72} className="text-primary" />}
      headerTitle="Embed Miro Board"
      headerDescription="Easily embed Miro board into Moraa Frame for seamless collaboration and smooth editing."
      footerNote="Make sure the Miro board is publically accessible or shared with participants.">
      <Input
        variant="bordered"
        color="primary"
        label="Miro Board URL(or ID)"
        className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
        placeholder="Enter Miro board url or board id"
        value={boardIdentifier}
        onChange={(e) => setBoardIdentifier(e.target.value)}
      />
      <Button color="primary" variant="ghost" fullWidth onClick={saveMiroUrl}>
        Embed Miro Board
      </Button>
    </FrameFormContainer>
  )
}
