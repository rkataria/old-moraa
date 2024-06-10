import { Dispatch, SetStateAction } from 'react'

import { DyteSidebar } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'

import { DyteStates } from './MeetingHeader'
import { AIChat } from '../common/AIChat'

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

  if (rightSidebarVisiblity === 'ai-chat') {
    return <AIChat onClose={() => setRightSidebarVisiblity(null)} />
  }

  return (
    <DyteSidebar
      meeting={meeting}
      states={dyteStates}
      className="bg-white w-full h-full max-w-full"
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
