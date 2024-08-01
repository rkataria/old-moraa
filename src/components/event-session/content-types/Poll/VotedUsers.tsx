import { Avatar, AvatarGroup } from '@nextui-org/react'

interface IVotedUser {
  name: string
  avatar_url: string
  isAnonymous: boolean
}

export function VotedUsers({ users }: { users: IVotedUser[] }) {
  if (!users || users.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      <AvatarGroup
        isBordered
        max={5}
        total={users.length}
        renderCount={(count) =>
          count > 5 && (
            <p className="text-sm font-medium ms-2">+{count - 5} more votes</p>
          )
        }>
        {users.map((user) => {
          if (user.isAnonymous) {
            return (
              <Avatar
                isBordered
                showFallback
                className="h-8 w-8 cursor-pointer"
                classNames={{ base: 'w-6 h-6' }}
              />
            )
          }

          return (
            <Avatar src={user.avatar_url} classNames={{ base: 'w-6 h-6' }} />
          )
        })}
      </AvatarGroup>
    </div>
  )
}
