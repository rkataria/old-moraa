'use client'

import React, { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { IconPencil } from '@tabler/icons-react'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
} from '@nextui-org/react'

import { ISlide } from '@/types/slide.type'

interface ReflectionProps {
  slide: ISlide & {
    content: {
      backgroundColor: string
      textColor: string
      title: string
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses?: any
  responded?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isHost: boolean
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
  updateReflection?: (id: string, reflection: string, username: string) => void
}

export function ReflectionCard({
  username,
  reflection,
  isOwner,
  enableEditReflection,
}: {
  username: string
  reflection: string
  isOwner: boolean
  enableEditReflection?: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-start items-center gap-2">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
          />
          <span className="semibold">{username}</span>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600">{reflection}</p>
        {isOwner && (
          <Button
            onClick={enableEditReflection}
            className="text-gray-600 hover:text-gray-800">
            <IconPencil className="w-3 h-3" />
            <span>Edit</span>
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export function Reflection({
  slide,
  responses = [],
  responded,
  user,
  isHost,
  addReflection,
  updateReflection,
}: ReflectionProps) {
  const [reflection, setReflection] = useState('')
  const [editEnabled, setEditEnabled] = useState<boolean>(false)
  const { meeting } = useDyteMeeting()

  const username = meeting.self.name
  const selfResponse = responses.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res: any) => res.participant.enrollment.user_id === user.id
  )

  const otherResponses = responses.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res: any) => res.participant.enrollment.user_id !== user.id
  )

  useEffect(() => {
    if (responded) {
      setReflection(selfResponse.response.reflection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}>
      <div className="w-4/5 mt-2 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.content.textColor,
            }}>
            {slide.content.title}
          </h2>

          <div className="mt-4 grid grid-cols-4 gap-4 ">
            {(!responded || editEnabled) && !isHost && (
              <Card>
                <CardHeader>
                  <div className="flex justify-start items-center gap-2">
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
                    />
                    <span className="semibold">{username}</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <Textarea
                    className="text-sm"
                    placeholder="Enter your reflection here."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                </CardBody>
                <CardFooter>
                  <div className="flex justify-start items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!responded) {
                          addReflection?.(slide, reflection, username)
                        } else {
                          updateReflection?.(
                            selfResponse.id,
                            reflection,
                            username
                          )
                        }
                        setEditEnabled(false)
                      }}>
                      submit
                    </Button>
                    {editEnabled && (
                      <Button size="sm" onClick={() => setEditEnabled(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
            {responded && !editEnabled && (
              <ReflectionCard
                username={`${username} (you)`}
                reflection={reflection}
                isOwner
                enableEditReflection={() => {
                  setEditEnabled((v) => !v)
                }}
              />
            )}
            {otherResponses?.map(
              (res: { response: { username: string; reflection: string } }) => (
                <ReflectionCard
                  username={res.response.username}
                  reflection={res.response.reflection}
                  isOwner={false}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
