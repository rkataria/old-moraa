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
        base: 'bg-[#DAC8FA] min-w-max bg-primary rounded-xl justify-start p-3 h-fit',
        name: 'font-semibold text-white',
      }}
      name={`${typingUser.participantName} is typing...`}
      avatarProps={{
        src: getAvatarForName(typingUser.participantName),
      }}
    />
  ))
}
