import { useDyteSelector } from '@dytesdk/react-web-core'
import { User } from '@nextui-org/react'

import { useTypingUsers } from '@/hooks/useTypingUsers'
import { getAvatarForName } from '@/utils/utils'

export function TypingUserCards() {
  const { typingUsers } = useTypingUsers()
  const selfParticipantId = useDyteSelector((m) => m.self.id)

  if (!typingUsers || typingUsers.length === 0) return null

  return typingUsers
    .filter((user) => user.participantId !== selfParticipantId)
    .map((typingUser, index: number) => (
      <User
        // eslint-disable-next-line react/no-array-index-key
        key={`${typingUser.participantName}-${index}`}
        classNames={{
          base: 'border border-gray-300 rounded-xl justify-start p-2 pr-4 w-fit bg-white h-fit',
          name: 'text-gray-700',
        }}
        name={
          <div className="flex flex-wrap gap-[0.3125rem] items-baseline">
            {typingUser.participantName}
            <div className="flex gap-1 items-center">
              {' is typing'}
              <div className="animate-[typing_1s_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-gray-700 ml-[0.125rem] delay-100" />
              <div className="animate-[typing_1s_ease-in-out_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-gray-700 delay-700" />
              <div className="animate-[typing_1s_ease-in-out_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-gray-700 delay-300" />
            </div>
          </div>
        }
        avatarProps={{
          src: getAvatarForName(typingUser.participantName),
          size: 'sm',
          className: 'flex-shrink-0',
        }}
      />
    ))
}
