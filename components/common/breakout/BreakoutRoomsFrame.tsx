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

  console.log(meeting.connectedMeetings.meetings)

  return (
    <div className="m-1 w-full flex-1 pr-12">
      <div className="flex">
        {meeting.connectedMeetings.meetings.map((meet, index) => (
          <div key={meet.id} className="mr-4">
            <Card
              className="overflow-y-auto p-2"
              style={{
                minWidth: '15rem',
                minHeight: '12rem',
                maxHeight: '30rem',
              }}>
              <CardHeader>
                <p className="text-md font-semibold">{meet.title}</p>
              </CardHeader>
              <CardBody className="p-2 py-0">
                <BreakoutActivityCard
                  idx={index}
                  breakout={currentFrame?.content?.breakoutDetails?.[index]}
                  editable={false}
                  hideActivityCard={hideActivityCards}
                  participants={meet.participants?.map((p) => ({
                    displayName: p.displayName || '',
                    id: p.id || '',
                    displayPictureUrl: p.displayPictureUrl || '',
                  }))}
                />
              </CardBody>
              <CardFooter className="p-2 py-0">
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
