"use client"
import React, { useEffect, useState } from "react"
import { ISlide } from "@/types/slide.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { IconPencil } from "@tabler/icons-react"

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
      <Stack direction="row" align="center">
        <Avatar
          size="sm"
          name={username}
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
        />
        <Text ml={2} fontSize="sm" fontWeight="medium">
          {username}
        </Text>
      </Stack>
    </CardHeader>
    <CardBody>
      <Text fontSize="md" fontWeight="medium">
        {reflection}
      </Text>
    </CardBody>
    {isOwner && (
      <CardFooter>
        <Button colorScheme="purple" onClick={enableEditReflection}>
          <IconPencil className="text-white w-2 h-2" />
          edit
        </Button>
      </CardFooter>
    )}
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
    setEditEnabled(false)
  }, [])
  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}
    >
      <div className="w-4/5 mt-20 rounded-md relative">
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
            {(!responded || editEnabled) && (
              <Card>
                <CardHeader>
                  <Stack direction="row" align="center">
                    <Avatar
                      size="sm"
                      name={username}
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
                    />
                    <Textarea
                      placeholder="Enter your reflection here."
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                    ></Textarea>
                  </Stack>
                </CardHeader>
                <CardBody>
                  <Text fontSize="md" fontWeight="semibold">
                    {reflection}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="solid"
                    colorScheme="purple"
                    onClick={() => {
                      !responded
                        ? addReflection(slide, reflection, username)
                        : updateReflection(
                            selfResponse.id,
                            reflection,
                            username
                          )
                      setEditEnabled(false)
                    }}
                  >
                    submit
                  </Button>
                </CardFooter>
              </Card>
            )}
            {responded && !editEnabled && (
              <ReflectionCard
                username={username}
                reflection={selfResponse?.response.reflection}
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
