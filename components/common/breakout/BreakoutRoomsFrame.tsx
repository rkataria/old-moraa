/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react'

import { BreakoutActivityCard } from './BreakoutActivityCard'
import { RenderIf } from '../RenderIf/RenderIf'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'

// TODO: Remove this component
export function BreakoutRoomsWithParticipants({
  hideActivityCards,
}: {
  hideActivityCards?: boolean
}) {
  const { meeting } = useDyteMeeting()
  const { currentFrame, setIsBreakoutSlide, setBreakoutSlideId } =
    useEventSession()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  const endBreakoutRooms = () => {
    setBreakoutSlideId(null)
    breakoutRoomsInstance?.endBreakout()
    setIsBreakoutSlide(false)
  }

  const joinRoom = (meetId: string) => {
    breakoutRoomsInstance?.joinRoom(meetId)
  }

  return (
    <div className="m-1 w-full flex-1 pr-12">
      <div className="flex">
        {meeting.connectedMeetings.meetings.map((meet, index) => (
          <div key={meet.id} className="mr-4">
            <Card
              className="p-2 overflow-y-auto"
              style={{
                minWidth: '15rem',
                minHeight: '12rem',
                maxHeight: '30rem',
              }}>
              <CardHeader>
                <p className="text-md font-semibold">{meet.title}</p>
              </CardHeader>
              <CardBody>
                <RenderIf isTrue={!hideActivityCards}>
                  <BreakoutActivityCard
                    idx={index}
                    breakout={currentFrame?.content?.breakoutDetails?.[index]}
                    editable={false}
                    participants={meet.participants}
                  />
                </RenderIf>
              </CardBody>
              <CardFooter>
                {meet.id !== meeting.connectedMeetings.currentMeetingId ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => joinRoom(meet.id || '')}>
                    Join {meet.title}
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <Button onClick={endBreakoutRooms} size="sm" color="danger">
          End Breakout
        </Button>
      </div>
    </div>
  )
}
