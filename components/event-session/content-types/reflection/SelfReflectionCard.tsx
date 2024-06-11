'use client'

import React, { useEffect, useState } from 'react'

import { EditableReflectionCard } from './EditableReflectionCard'
import { ReflectionCard } from './ReflectionCard'

import { type IReflectionResponse } from '@/types/slide.type'

type SelfReflectionCardProps = {
  username: string
  selfResponse: IReflectionResponse | undefined
  avatarUrl?: string
}

export function SelfReflectionCard({
  username,
  selfResponse,
  avatarUrl,
}: SelfReflectionCardProps) {
  const defaultEditEnabled = !selfResponse

  const [editEnabled, setEditEnabled] = useState<boolean>(defaultEditEnabled)

  useEffect(() => {
    setEditEnabled(defaultEditEnabled)
  }, [defaultEditEnabled])

  if (editEnabled) {
    return (
      <EditableReflectionCard
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
    <ReflectionCard
      response={selfResponse}
      isOwner
      avatarUrl={avatarUrl}
      enableEditReflection={() => {
        setEditEnabled((v) => !v)
      }}
    />
  )
}
