'use client'

import React from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'

import { User } from '@nextui-org/react'

import { useEventSession } from '@/contexts/EventSessionContext'
import { getAvatarForName } from '@/utils/utils'

type TypingUser = {
  participantId: string
  participantName: string
}

export function TypingUsers() {
  const { activeSession } = useEventSession()
  const selfParticipant = useDyteSelector((m) => m.self)

  const typingUsers: TypingUser[] | undefined =
    activeSession?.data?.typingUsers?.filter(
      (typingUser: TypingUser) =>
        typingUser.participantId !== selfParticipant.id
    )

  if (!typingUsers || typingUsers.length === 0) return null

  return typingUsers.map((typingUser, index: number) => (
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
