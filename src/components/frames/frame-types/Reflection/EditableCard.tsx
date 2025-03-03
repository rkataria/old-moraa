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
} from '@heroui/react'
import { useDebounce } from '@uidotdev/usehooks'
import { IoIosInformationCircleOutline } from 'react-icons/io'

import type { IFrame, IReflectionResponse } from '@/types/frame.type'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useTypingUsers } from '@/hooks/useTypingUsers'
import { cn, getAvatarForName } from '@/utils/utils'

type EditableCardProps = {
  username: string
  // reflection: ReflectionState
  // setReflection: (value: ReflectionState) => void
  editEnabled: boolean
  avatarUrl?: string
  totalResponsesCount?: number
  selfResponse: IReflectionResponse | undefined
  setEditEnabled: (value: boolean) => void
}

type ReflectionState = {
  value: string
}

export function EditableCard({
  username,
  editEnabled,
  avatarUrl,
  selfResponse,
  totalResponsesCount,
  setEditEnabled,
}: EditableCardProps) {
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

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const isInBreakoutMeeting = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  const getReflectionDisabled = () => {
    const reflectionStartedInMainRoom =
      session?.data?.framesConfig?.[frame.id]?.reflectionStarted

    if (!isInBreakoutMeeting && !reflectionStartedInMainRoom) {
      return true
    }

    return false
  }

  const reply = selfResponse?.response.reply

  const shouldReflectionDisabled = getReflectionDisabled()

  const maxReflectionAllowed = currentFrame?.config?.maxReflectionsPerUser

  const hasReachedMaxCount = maxReflectionAllowed === totalResponsesCount

  if (hasReachedMaxCount) return null

  return (
    <Card
      className={cn('rounded-2xl shadow-md border border-gray-50', {
        'opacity-50 pointer-events-none': shouldReflectionDisabled,
      })}>
      <CardHeader className="p-4">
        <div className="flex justify-start items-center gap-2">
          <Avatar
            radius="full"
            size="sm"
            className="min-w-6 w-6 h-6"
            src={getAvatarForName(username, avatarUrl)}
          />
          <h4 className="text-sm text-black/70">{username}</h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 flex flex-col justify-between">
        <RenderIf
          isTrue={
            !!(
              maxReflectionAllowed > 1 &&
              (!totalResponsesCount ||
                maxReflectionAllowed - totalResponsesCount > 1)
            )
          }>
          <p className="flex items-center gap-1 text-xs mb-2 pl-1 text-gray-400">
            <IoIosInformationCircleOutline size={18} />
            You can add{' '}
            {totalResponsesCount
              ? maxReflectionAllowed - totalResponsesCount
              : maxReflectionAllowed}{' '}
            cards
          </p>
        </RenderIf>
        <Textarea
          className="text-sm"
          placeholder="Enter your reflection here."
          value={reflection.value}
          onChange={onChangeReflection}
          isDisabled={shouldReflectionDisabled}
        />
      </CardBody>
      <CardFooter className="pt-0">
        <div
          className={cn('flex items-center gap-2 w-full', {
            'justify-between': frame.config?.allowAnonymously,
            'justify-end': !frame.config?.allowAnonymously,
          })}>
          <RenderIf
            isTrue={
              frame.config?.allowAnonymously && !shouldReflectionDisabled
            }>
            <div>
              <Checkbox
                isSelected={anonymous}
                onValueChange={() => setAnonymous(!anonymous)}>
                <p className="text-xs">Anonymous</p>
              </Checkbox>
            </div>
          </RenderIf>

          <div className="flex items-center gap-2">
            {editEnabled && (
              <Button variant="light" onClick={handleCancel}>
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
                  handleCancel()
                } else {
                  updateReflection?.({
                    id: selfResponse.id,
                    reflection: reflection.value,
                    username,
                    anonymous: anonymous!,
                    reply,
                  })
                  setEditEnabled(false)
                }
              }}>
              {selfResponse ? 'Save' : 'Add'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
