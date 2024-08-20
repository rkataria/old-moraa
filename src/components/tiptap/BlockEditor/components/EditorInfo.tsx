import { memo } from 'react'

import { WebSocketStatus } from '@hocuspocus/provider'
import { Avatar, AvatarGroup } from '@nextui-org/react'

import { EditorUser } from '../types'

import Tooltip from '@/components/tiptap/ui/Tooltip'

export type EditorInfoProps = {
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorInfo = memo(
  ({ characters, collabState, users, words }: EditorInfoProps) => (
    <div className="flex items-center">
      <div className="flex flex-col justify-center pr-4 mr-4 text-right border-r border-neutral-200 dark:border-neutral-800">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {words} {words === 1 ? 'word' : 'words'}
        </div>
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {characters} {characters === 1 ? 'character' : 'characters'}
        </div>
      </div>
      <div className="flex items-center gap-2 mr-2" />
      {collabState === 'connected' && (
        <AvatarGroup
          max={3}
          total={users.length > 3 ? users.length : undefined}>
          {users.map((user: EditorUser) => (
            <Tooltip title={user.name}>
              <Avatar
                id={user.clientId}
                src={user.avatar}
                radius="lg"
                size="sm"
                classNames={{ base: 'w-7 h-7 border', img: 'w-7 h-7' }}
              />
            </Tooltip>
          ))}
        </AvatarGroup>
      )}
    </div>
  )
)

EditorInfo.displayName = 'EditorInfo'
