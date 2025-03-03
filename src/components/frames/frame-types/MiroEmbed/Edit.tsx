/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { Input } from '@heroui/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { SiMiro } from 'react-icons/si'

import { Embed } from './Embed'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { type IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export type MiroEmbedFrameType = IFrame & {
  content: {
    boardId: string
  }
}
interface EditProps {
  frame: MiroEmbedFrameType
}

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

const getBoardId = (boardIdentifier: string): string | undefined => {
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

export function Edit({ frame }: EditProps) {
  const [editable, setEditable] = useState(false)
  const [boardIdentifier, setBoardIdentifier] = useState('')
  const { updateFrame } = useEventContext()
  useEffect(() => {
    setBoardIdentifier(frame.content?.boardId || '')
  }, [frame.content.boardId])

  const saveMiroUrl = () => {
    const boardId = getBoardId(boardIdentifier)

    if (!boardId) {
      toast.error('Invalid Miro board URL or ID')

      return
    }

    if (frame.content.boardId === boardId) {
      setEditable(false)

      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          boardId,
        },
      },
      frameId: frame.id,
    })
  }

  if (frame.content.boardId && !editable) {
    return (
      <div className="relative h-full rounded-md overflow-hidden">
        <Embed frame={frame} />
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: -50, x: '-50%' }}
          transition={{
            duration: 0.3,
          }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className={cn(
            'absolute left-1/2 bottom-0',
            'bg-black text-white py-2 px-6 rounded-full shadow-sm cursor-pointer transition-all duration-300',
            'flex justify-start gap-2'
          )}
          onClick={() => setEditable(true)}>
          <p>Do you want to replace this board?</p>
          <span className="underline">Click here</span>
        </motion.div>
      </div>
    )
  }

  return (
    <FrameFormContainer
      headerIcon={<SiMiro size={72} className="text-primary" />}
      headerTitle={`${frame.content?.boardId ? 'Edit' : 'Embed'} Miro Board`}
      headerDescription="Easily embed Miro board into Moraa Frame for seamless collaboration and smooth editing."
      footerNote="Make sure the Miro board is publically accessible or shared with participants.">
      <Input
        variant="faded"
        color="primary"
        label="Miro Board URL(or ID)"
        placeholder="Enter Miro board url or board id"
        value={boardIdentifier}
        classNames={{
          inputWrapper: 'shadow-none',
        }}
        onChange={(e) => setBoardIdentifier(e.target.value)}
      />
      <Button
        color="primary"
        variant="flat"
        size="md"
        fullWidth
        onClick={saveMiroUrl}
        disabled={!boardIdentifier}>
        {frame.content?.boardId ? 'Update' : 'Embed'} Miro Board
      </Button>
    </FrameFormContainer>
  )
}
