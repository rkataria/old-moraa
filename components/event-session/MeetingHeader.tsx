import { Dispatch, SetStateAction } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { MeetingControls } from './MeetingControls'

import { useStudioLayout } from '@/hooks/useStudioLayout'

export type DyteStates = {
  [key: string]: string | boolean
}

type MeetingHeaderProps = {
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
}

export function MeetingHeader({
  dyteStates,
  setDyteStates,
}: MeetingHeaderProps) {
  const { rightSidebarVisiblity, setRightSidebarVisiblity, toggleLeftSidebar } =
    useStudioLayout()

  useHotkeys('ctrl + [', toggleLeftSidebar, [])
  useHotkeys('ctrl + ]', () => setRightSidebarVisiblity(null), [])

  return (
    <div className="h-16 px-4 z-[9] border-b-2 border-gray-200 bg-white">
      <MeetingControls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rightSidebar={rightSidebarVisiblity as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDyteStateUpdate={(data: any) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...data,
          }))
        }}
        onSidebarOpen={(data) => {
          if (rightSidebarVisiblity === data.sidebar) {
            setRightSidebarVisiblity(null)
            setDyteStates({
              ...dyteStates,
              [rightSidebarVisiblity]: false,
            })

            return
          }

          if (['participants', 'chat', 'plugins'].includes(data.sidebar)) {
            setDyteStates(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setRightSidebarVisiblity(data.sidebar as any)
          }
        }}
        onAiChatOverlayToggle={() => {
          if (rightSidebarVisiblity === 'ai-chat') {
            setRightSidebarVisiblity(null)
          } else {
            setRightSidebarVisiblity('ai-chat')
          }
        }}
        dyteStates={dyteStates}
        setDyteStates={setDyteStates}
      />
    </div>
  )
}
