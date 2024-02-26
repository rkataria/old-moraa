"use client"
import React, { useEffect, useState } from "react"
import { ISlide } from "@/types/slide.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import { IconPencil } from "@tabler/icons-react"
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
} from "@nextui-org/react"

interface ReflectionProps {
  slide: ISlide
  responses?: any
  responded?: boolean
  user: any
  isHost: boolean
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
  updateReflection?: (id: string, reflection: string, username: string) => void
}

const ReflectionCard = ({
  username,
  reflection,
  isOwner,
  enableEditReflection,
}: {
  username: string
  reflection: string
  isOwner: boolean
  enableEditReflection?: () => void
}) => (
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
          className="text-gray-600 hover:text-gray-800"
        >
          <IconPencil className="w-3 h-3" />
          <span>Edit</span>
        </Button>
      )}
    </CardBody>
  </Card>
)

function Reflection({
  slide,
  responses = [],
  responded,
  user,
  isHost,
  addReflection,
  updateReflection,
}: ReflectionProps) {
  const [reflection, setReflection] = useState("")
  const [editEnabled, setEditEnabled] = useState<boolean>(false)
  const { meeting } = useDyteMeeting()
  const username = meeting.self.name
  const selfResponse = responses.find((res: any) => res.profile_id === user.id)
  const otherResponses = responses.filter(
    (res: any) => res.response.username !== username
  )

  useEffect(() => {
    if (responded) {
      setReflection(selfResponse.response.reflection)
    }
  }, [])

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}
    >
      <div className="w-4/5 mt-2 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.content.textColor,
            }}
          >
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
                  ></Textarea>
                </CardBody>
                <CardFooter>
                  <div className="flex justify-start items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        !responded
                          ? addReflection?.(slide, reflection, username)
                          : updateReflection?.(
                              selfResponse.id,
                              reflection,
                              username
                            )
                        setEditEnabled(false)
                      }}
                    >
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
                username={username + " (you)"}
                reflection={reflection}
                isOwner={true}
                enableEditReflection={() => {
                  setEditEnabled((v) => !v)
                }}
              />
            )}
            {otherResponses?.map(
              (
                res: {
                  response: { username: string; reflection: string }
                },
                index: number
              ) => (
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

export default Reflection
