import { memo } from 'react'

import { Avatar, AvatarGroup } from '@heroui/react'
import { WebSocketStatus } from '@hocuspocus/provider'

import { EditorUser } from '../types'

import Tooltip from '@/components/tiptap/ui/Tooltip'
import { cn } from '@/utils/utils'

export type EditorInfoProps = {
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorInfo = memo(
  ({ characters, collabState, users, words }: EditorInfoProps) => (
    <div className="flex items-center">
      <div
        className={cn('flex flex-col justify-center text-right', {
          'pr-4 mr-4 border-r border-neutral-200 dark:border-neutral-800':
            collabState === 'connected',
        })}>
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {words} {words === 1 ? 'word' : 'words'}
        </div>
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {characters} {characters === 1 ? 'character' : 'characters'}
        </div>
      </div>

      {collabState === 'connected' && (
        <>
          <div className="flex items-center gap-2 mr-2" />
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
        </>
      )}
    </div>
  )
)

EditorInfo.displayName = 'EditorInfo'
