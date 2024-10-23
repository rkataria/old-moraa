import React, { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Textarea,
} from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'

import type { IFrame, IReflectionResponse } from '@/types/frame.type'

import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useTypingUsers } from '@/hooks/useTypingUsers'
import { cn, getAvatarForName } from '@/utils/utils'

type EditableReflectionCardProps = {
  username: string
  // reflection: ReflectionState
  // setReflection: (value: ReflectionState) => void
  editEnabled: boolean
  avatarUrl?: string
  setEditEnabled: (value: boolean) => void
  selfResponse: IReflectionResponse | undefined
}

type ReflectionState = {
  value: string
}

export function EditableReflectionCard({
  username,
  editEnabled,
  avatarUrl,
  setEditEnabled,
  selfResponse,
}: EditableReflectionCardProps) {
  const defaultAnonymous = selfResponse?.response.anonymous ?? false
  const defaultReflectionValue = selfResponse?.response?.reflection ?? ''

  const { addReflection, updateReflection, currentFrame } = useEventSession()
  const { typingUsers, updateTypingUsers } = useTypingUsers()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [anonymous, setAnonymous] = useState(defaultAnonymous)
  const [reflection, setReflection] = useState<ReflectionState>({
    value: defaultReflectionValue,
  })
  const debouncedReflection = useDebounce(reflection.value, 1000)

  const removeTyping = () => {
    updateTypingUsers({
      isTyping: false,
      participantId: selfParticipant.id,
    })
  }

  useEffect(() => {
    if (debouncedReflection) {
      updateTypingUsers({
        isTyping: true,
        participantId: selfParticipant.id,
        participantName: selfParticipant.name,
      })
    } else {
      removeTyping()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReflection])

  const frame = currentFrame as IFrame

  const onChangeReflection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value &&
      !typingUsers.some((user) => user.participantId === selfParticipant.id)
    ) {
      updateTypingUsers({
        isTyping: true,
        participantId: selfParticipant.id,
        participantName: selfParticipant.name,
      })
    }
    setReflection({
      value: event.target.value,
    })
  }

  const handleCancel = () => {
    removeTyping()

    setReflection((prev) => ({
      ...prev,
      value: selfResponse?.response.reflection ?? '',
    }))

    if (selfResponse?.response?.reflection) {
      setEditEnabled(false)
    }

    setAnonymous(selfResponse?.response.anonymous ?? false)
  }

  return (
    <Card className="rounded-2xl shadow-md border border-gray-50">
      <CardHeader className="p-4">
        <div className="flex justify-start items-center gap-2">
          <Avatar
            radius="full"
            size="sm"
            className="min-w-fit w-6 h-6"
            src={getAvatarForName(username, avatarUrl)}
          />
          <h4 className="text-sm text-black/70">{username}</h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 flex flex-col justify-between">
        <Textarea
          className="text-sm"
          placeholder="Enter your reflection here."
          value={reflection.value}
          onChange={onChangeReflection}
        />
      </CardBody>
      <CardFooter className="pt-0">
        <div
          className={cn('flex items-center gap-2 w-full', {
            'justify-between': frame.config?.allowAnonymously,
            'justify-end': !frame.config?.allowAnonymously,
          })}>
          {frame.config?.allowAnonymously && (
            <div>
              <Checkbox
                isSelected={anonymous}
                onValueChange={() => setAnonymous(!anonymous)}>
                <p className="text-xs">Anonymous</p>
              </Checkbox>
            </div>
          )}
          <div className="flex items-center gap-2">
            {editEnabled && (
              <Button color="danger" variant="light" onClick={handleCancel}>
                Reset
              </Button>
            )}
            <Button
              type="button"
              color="primary"
              variant="ghost"
              className="border-1"
              onClick={() => {
                removeTyping()
                if (!selfResponse) {
                  addReflection?.({
                    frame,
                    reflection: reflection.value,
                    username,
                    anonymous: anonymous!,
                  })
                } else {
                  updateReflection?.({
                    id: selfResponse.id,
                    reflection: reflection.value,
                    username,
                    anonymous: anonymous!,
                  })
                }

                setEditEnabled(false)
              }}>
              Save
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
