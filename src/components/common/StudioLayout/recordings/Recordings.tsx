import { useRouter } from '@tanstack/react-router'

import { RecordingDetails } from './RecordingDetails'
import { RecordingsList } from './RecordingsList'

export function Recordings() {
  const router = useRouter()
  const { recordingId = '' } = router.latestLocation.search as {
    recordingId?: string
  }

  if (recordingId) {
    return <RecordingDetails />
  }

  return <RecordingsList />
}
