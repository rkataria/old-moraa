import { Dispatch, SetStateAction } from 'react'

import { DyteSidebar } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'

import { DyteStates } from './MeetingHeader'
import { NoteOverlay } from '../common/NotesOverlay'

import { useStudioLayout } from '@/hooks/useStudioLayout'

type MeetingRightSidebarProps = {
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
}

export function MeetingRightSidebar({
  dyteStates,
  setDyteStates,
}: MeetingRightSidebarProps) {
  const { meeting } = useDyteMeeting()
  const { rightSidebarVisiblity } = useStudioLayout()

  if (!rightSidebarVisiblity) return null

  if (rightSidebarVisiblity === 'frame-notes') {
    return <NoteOverlay editable={false} />
  }

  return (
    <DyteSidebar
      meeting={meeting}
      states={dyteStates}
      className="bg-white w-64 h-full max-w-full"
      // Bug: Applying this show only the sidebar and not the main content
      // config={{
      //   styles: {
      //     'dyte-sidebar-ui': {
      //       backgroundColor: 'white',
      //     },
      //   },
      // }}
      onDyteStateUpdate={(e) => {
        setDyteStates((prevDyteStates) => ({
          ...prevDyteStates,
          ...e.detail,
        }))
      }}
    />
  )
}
