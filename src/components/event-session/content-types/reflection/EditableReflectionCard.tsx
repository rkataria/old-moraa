import React, { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Textarea,
} from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'

import type { IFrame, IReflectionResponse } from '@/types/frame.type'

import { useEventSession } from '@/contexts/EventSessionContext'
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
  typedValue: null | string
  isTyping: boolean
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

  const { updateTypingUsers, addReflection, updateReflection, currentFrame } =
    useEventSession()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [anonymous, setAnonymous] = useState(defaultAnonymous)
  const [reflection, setReflection] = useState<ReflectionState>({
    typedValue: null,
    value: defaultReflectionValue,
    isTyping: false,
  })
  const debouncedReflection = useDebounce(reflection.typedValue, 15000)

  const removeTyping = () => {
    setReflection((prev) => ({
      ...prev,
      isTyping: false,
    }))
    updateTypingUsers({
      isTyping: false,
      participantId: selfParticipant.id,
    })
  }

  useEffect(() => {
    if (debouncedReflection !== null) {
      removeTyping()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReflection])

  const frame = currentFrame as IFrame

  const onChangeReflection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!reflection.isTyping) {
      updateTypingUsers({
        isTyping: true,
        participantId: selfParticipant.id,
        participantName: selfParticipant.name,
      })
    }
    setReflection({
      typedValue: event.target.value,
      isTyping: true,
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
    <Card
      shadow="none"
      className={cn('border-2 border-primary-200 rounded-md')}>
      <CardHeader>
        <div className="flex justify-start items-center gap-2">
          <Avatar
            isBordered
            radius="full"
            size="md"
            className="min-w-fit"
            color="primary"
            src={getAvatarForName(username, avatarUrl)}
          />
          <h4 className="text-small font-semibold leading-none text-primary-500">
            {username}
          </h4>
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
              Submit
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
