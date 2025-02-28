import { User } from '@heroui/react'

export function SelfPresence({
  presence,
}: {
  presence: {
    id: string
    isHost: boolean
    name: string
    role: string
    avatar: string
  }
}) {
  return (
    <div className="p-2">
      <User
        name={presence.name}
        description={presence.role}
        avatarProps={{
          size: 'sm',
          src: presence.avatar,
        }}
      />
    </div>
  )
}
