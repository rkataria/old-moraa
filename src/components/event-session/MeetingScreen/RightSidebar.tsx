import { Dispatch, SetStateAction } from 'react'

import { DyteSidebar } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { motion } from 'framer-motion'
import { IoChatbubblesOutline, IoPeopleOutline } from 'react-icons/io5'
import { LuClipboardEdit } from 'react-icons/lu'
import { useDispatch } from 'react-redux'

import { RightSidebarHeader } from './RightSidebarHeader'

import { NoteOverlay } from '@/components/common/NotesOverlay'
import { useStoreSelector } from '@/hooks/useRedux'
import { closeRightSidebarAction } from '@/stores/slices/layout/live.slice'
import { DyteStates } from '@/types/event-session.type'

type RightSidebarProps = {
  dyteStates: DyteStates
  setDyteStates: Dispatch<SetStateAction<DyteStates>>
}

const RIGHT_SIDEBAR_WIDTH = 320

const HeaderMap = {
  chat: {
    title: 'Chats',
    icon: <IoChatbubblesOutline size={20} />,
  },
  participants: {
    title: 'Participants',
    icon: <IoPeopleOutline size={20} />,
  },
  plugins: {
    title: 'Plugins',
    icon: <IoPeopleOutline size={20} />,
  },
  'frame-notes': {
    title: 'Notes',
    icon: <LuClipboardEdit size={20} strokeWidth={1.7} />,
  },
}

export function RightSidebar({ dyteStates, setDyteStates }: RightSidebarProps) {
  const { meeting } = useDyteMeeting()
  const dispatch = useDispatch()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)

  const renderContent = () => {
    if (['chat', 'participants', 'plugins'].includes(rightSidebarMode!)) {
      return (
        <>
          <div className="absolute left-0 top-0 h-11 w-full bg-gray-100 z-[1]">
            <RightSidebarHeader
              title={HeaderMap[rightSidebarMode!].title}
              icon={HeaderMap[rightSidebarMode!].icon}
            />
          </div>
          <DyteSidebar
            meeting={meeting}
            states={dyteStates}
            className="absolute top-0 right-0 h-full w-full z-0 bg-white"
            onDyteStateUpdate={(e) => {
              if (!e.detail.activeSidebar) {
                dispatch(closeRightSidebarAction())
              }
              setDyteStates((prevDyteStates) => ({
                ...prevDyteStates,
                ...e.detail,
              }))
            }}
          />
        </>
      )
    }

    if (rightSidebarMode === 'frame-notes') {
      return (
        <>
          <div className="absolute left-0 top-0 h-11 w-full bg-gray-100 z-[1]">
            <RightSidebarHeader
              title={HeaderMap[rightSidebarMode!].title}
              icon={HeaderMap[rightSidebarMode!].icon}
            />
          </div>
          <NoteOverlay
            className="p-4"
            editable={false}
            onClose={() => {
              dispatch(closeRightSidebarAction())
            }}
          />
        </>
      )
    }

    return null
  }

  return (
    <motion.div
      initial={{ marginRight: -RIGHT_SIDEBAR_WIDTH }}
      animate={{
        marginRight: rightSidebarMode ? 16 : -RIGHT_SIDEBAR_WIDTH,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative w-80 h-full bg-white mr-4 p-2 border-1 border-gray-200 rounded-md overflow-hidden">
      {renderContent()}
    </motion.div>
  )
}
