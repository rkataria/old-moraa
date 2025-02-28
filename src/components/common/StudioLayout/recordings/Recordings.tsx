import { useState } from 'react'

import { useRouter } from '@tanstack/react-router'

import { itemsPerPage } from './constants'
import { RecordingDetails } from './RecordingDetails'
import { RecordingsList } from './RecordingsList'

import { useGetRecordings } from '@/hooks/useEventRecordings'
import { useStoreSelector } from '@/hooks/useRedux'

export function Recordings() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortType, setSortType] = useState('DESC')
  const { recordingId = '' } = router.latestLocation.search as {
    recordingId?: string
  }

  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )

  const {
    recordings = [],
    totalItems,
    isFetching: fetchingRecordings,
  } = useGetRecordings({
    meetingId: meeting?.id,
    from: (currentPage - 1) * itemsPerPage,
    to: currentPage * itemsPerPage - 1,
    order: { ascending: sortType === 'ASC' },
  })

  console.log('recordings', recordings)

  const activeRecording = recordings.find(
    (recording) => recording.id === recordingId
  )

  if (recordingId && activeRecording) {
    return (
      <RecordingDetails
        isLoading={fetchingRecordings}
        recording={activeRecording}
      />
    )
  }

  return (
    <RecordingsList
      isLoading={fetchingRecordings}
      recordings={recordings}
      currentPage={currentPage}
      totalItems={totalItems}
      sortType={sortType}
      setCurrentPage={setCurrentPage}
      setSortType={setSortType}
    />
  )
}
