import { useEffect, useState } from 'react'

import { Card } from './Card'
import { EditableCard } from './EditableCard'

import { type IReflectionResponse } from '@/types/frame.type'
import { getAvatarForName } from '@/utils/utils'

type SelfCardProps = {
  username: string
  selfResponse: IReflectionResponse | undefined
  avatarUrl?: string
}

export function SelfCard({ username, selfResponse, avatarUrl }: SelfCardProps) {
  const defaultEditEnabled = !selfResponse

  const [editEnabled, setEditEnabled] = useState<boolean>(defaultEditEnabled)

  useEffect(() => {
    setEditEnabled(defaultEditEnabled)
  }, [defaultEditEnabled])

  if (editEnabled) {
    return (
      <EditableCard
        username={username}
        avatarUrl={avatarUrl}
        editEnabled
        setEditEnabled={setEditEnabled}
        selfResponse={selfResponse as IReflectionResponse}
      />
    )
  }

  if (!selfResponse) return null

  return (
    <Card
      response={selfResponse}
      isOwner
      userName={username}
      avatarUrl={getAvatarForName(username, avatarUrl)}
      enableEditReflection={() => {
        setEditEnabled((v) => !v)
      }}
    />
  )
}
