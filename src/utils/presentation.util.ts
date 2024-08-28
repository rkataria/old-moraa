import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'

export const getNewEventSessionMode = ({
  isHost,
  newPresentationStatus,
}: {
  isHost: boolean
  newPresentationStatus: PresentationStatuses
}) => {
  if (newPresentationStatus !== PresentationStatuses.STOPPED) {
    return EventSessionMode.PRESENTATION
  }
  if (isHost) return EventSessionMode.PREVIEW

  return EventSessionMode.LOBBY
}
