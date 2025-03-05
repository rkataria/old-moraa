import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { useDyteParticipants } from './useDyteParticipants'

import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'

export function useParticipantsGrid(): {
  panelConfig: {
    direction: string
    panels: {
      participants: (DyteParticipant | Readonly<DyteSelf>)[]
      minSize: number
      defaultSize: number
      maxSize: number
    }[]
  }
} {
  const { presentationStatus } = useEventSession()
  const {
    pinnedParticipants,
    sortedParticipants,
    sortedParticipantsWithOutPinned,
  } = useDyteParticipants()
  const isPresentationStarted =
    presentationStatus === PresentationStatuses.STARTED
  const isSpeakerView = pinnedParticipants.length > 0

  if (isSpeakerView && !isPresentationStarted) {
    return {
      panelConfig: {
        direction: isPresentationStarted ? 'vertical' : 'horizontal',
        panels: [
          {
            participants: pinnedParticipants,
            minSize: 50,
            defaultSize: 60,
            maxSize: 80,
          },
          {
            participants: sortedParticipantsWithOutPinned,
            minSize: 20,
            defaultSize: 40,
            maxSize: 50,
          },
        ],
      },
    }
  }

  return {
    panelConfig: {
      direction: 'horizontal',
      panels: [
        {
          participants: sortedParticipants,
          minSize: 100,
          defaultSize: 100,
          maxSize: 100,
        },
      ],
    },
  }
}
