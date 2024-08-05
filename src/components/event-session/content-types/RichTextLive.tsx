import { useContext } from 'react'

import { RichTextEditor } from '../../common/content-types/RichText/Editor'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'

export function RichTextLive({ frame }: { frame: IFrame }) {
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const canEditInLive = () => {
    if (isHost) return true

    if (frame.config.allowToCollaborate) {
      return true
    }

    return false
  }

  return <RichTextEditor frame={frame} editable={canEditInLive()} />
}
