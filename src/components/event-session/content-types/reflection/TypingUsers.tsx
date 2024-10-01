import { useDyteSelector } from '@dytesdk/react-web-core'
import { User } from '@nextui-org/react'

import { useTypingUsers } from '@/hooks/useTypingUsers'
import { getAvatarForName } from '@/utils/utils'

export function TypingUsers() {
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
          base: 'border border-[#cbbcbc] rounded-full min-w-max justify-start p-2 pr-3 bg-white h-fit',
          name: 'font-semibold text-black',
        }}
        name={
          <div className="flex gap-[0.3125rem] items-baseline">
            {typingUser.participantName}
            {' is typing'}
            <div className="animate-[typing_1s_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-black ml-[0.125rem] delay-100" />
            <div className="animate-[typing_1s_ease-in-out_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-black delay-700" />
            <div className="animate-[typing_1s_ease-in-out_infinite] w-[0.1875rem] h-[0.1875rem] rounded-full bg-black delay-300" />
          </div>
        }
        avatarProps={{
          src: getAvatarForName(typingUser.participantName),
          size: 'md',
        }}
      />
    ))
}
