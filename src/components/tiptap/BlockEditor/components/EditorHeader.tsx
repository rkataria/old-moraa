import { WebSocketStatus } from '@hocuspocus/provider'

import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
  hideSideBar?: boolean
}

export function EditorHeader({
  characters,
  collabState,
  users,
  words,
  isSidebarOpen,
  toggleSidebar,
  hideSideBar = false,
}: EditorHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between flex-none p-2 sticky top-0 z-[100] bg-white rounded-xl">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <RenderIf isTrue={hideSideBar}>
            <Toolbar.Button
              tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              onClick={toggleSidebar}
              active={isSidebarOpen}
              className={isSidebarOpen ? 'bg-transparent' : ''}>
              <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
            </Toolbar.Button>
          </RenderIf>
        </div>
      </div>
      <EditorInfo
        characters={characters}
        words={words}
        collabState={collabState}
        users={users}
      />
    </div>
  )
}
