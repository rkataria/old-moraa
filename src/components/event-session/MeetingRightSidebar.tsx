import { Dispatch, SetStateAction } from 'react'

import { DyteSidebar } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { IoChatbubblesOutline, IoPeopleOutline } from 'react-icons/io5'

import { DyteStates } from './MeetingHeader'
import { NoteOverlay } from '../common/NotesOverlay'
import { RightSidebarHeader } from '../common/StudioLayout/RightSidebarHeader'

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
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  if (!rightSidebarVisiblity) return null

  if (rightSidebarVisiblity === 'frame-notes') {
    return <NoteOverlay editable={false} />
  }

  const renderHeader = () => {
    if (dyteStates.sidebar === 'chat') {
      return (
        <RightSidebarHeader
          title="Chats"
          icon={<IoChatbubblesOutline size={20} />}
        />
      )
    }

    if (dyteStates.sidebar === 'participants') {
      return (
        <RightSidebarHeader
          title="Participants"
          icon={<IoPeopleOutline size={20} />}
        />
      )
    }

    return null
  }

  return (
    <div className="relative bg-white w-64 h-full max-w-full">
      <DyteSidebar
        meeting={meeting}
        states={dyteStates}
        className="absolute top-0 right-0 h-full w-full z-0"
        // Bug: Applying this show only the sidebar and not the main content
        // config={{
        //   styles: {
        //     'dyte-sidebar-ui': {
        //       backgroundColor: 'white',
        //     },
        //   },
        // }}
        onDyteStateUpdate={(e) => {
          // Close the right sidebar if the active dyte sidebar is closed
          if (!e.detail.activeSidebar) {
            setRightSidebarVisiblity(null)
          }
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
      <div className="absolute left-0 top-0 h-11 w-full bg-gray-100 z-[1]">
        {renderHeader()}
      </div>
    </div>
  )
}
