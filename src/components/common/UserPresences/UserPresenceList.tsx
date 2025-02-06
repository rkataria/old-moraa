/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'

import { UserPresence } from './UserPresence'
import { SearchInput } from '../SearchInput'

export function UserPresenceList({
  presences,
  followingUserId,
  onFollowUser,
}: {
  presences: any[]
  followingUserId?: string
  onFollowUser?: (userId: string) => void
}) {
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 300)

  if (!presences || presences.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-16 pb-4 text-gray-400">
        No one else is here yet
      </div>
    )
  }

  const filteredPresences = presences.filter((presence) =>
    presence.name.toLowerCase().includes(debounceQuery?.trim().toLowerCase())
  )

  return (
    <div className="w-full flex flex-col gap-2">
      <SearchInput
        onSearch={(v) => {
          setQuery(v)
        }}
      />
      {filteredPresences.map((presence) => (
        <UserPresence
          key={presence.id}
          presence={presence as any}
          following={followingUserId === presence.id}
          onFollowUser={onFollowUser}
        />
      ))}
    </div>
  )
}
