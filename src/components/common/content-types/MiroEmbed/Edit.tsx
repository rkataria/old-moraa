import { useEffect, useState } from 'react'

import { Input } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { SiMiro } from 'react-icons/si'

import { Embed } from './Embed'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setFrameSettingsViewAction } from '@/stores/slices/layout/studio.slice'
import { type IFrame } from '@/types/frame.type'

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
  const [boardIdentifier, setBoardIdentifier] = useState('')
  const { updateFrame } = useEventContext()
  const isEditMode = useStoreSelector(
    (state) => state.layout.studio.frameSettings.view === 'form'
  )
  const dispatch = useStoreDispatch()

  useEffect(() => {
    setBoardIdentifier(frame.content?.boardId || '')

    if (frame.content?.boardId) {
      dispatch(setFrameSettingsViewAction('preview'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.content.boardId])

  const saveMiroUrl = () => {
    const boardId = getBoardId(boardIdentifier)

    if (!boardId) {
      toast.error('Invalid Miro board URL or ID')

      return
    }

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

    dispatch(setFrameSettingsViewAction('preview'))
  }

  const isUpdating = isEditMode && frame.content?.boardId?.length > 0

  if (!isEditMode) {
    return <Embed frame={frame} />
  }

  return (
    <FrameFormContainer
      headerIcon={<SiMiro size={72} className="text-primary" />}
      headerTitle={`${isUpdating ? 'Edit' : 'Embed'} Miro Board`}
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
        {isUpdating ? 'Save' : 'Embed'} Miro Board
      </Button>
    </FrameFormContainer>
  )
}
