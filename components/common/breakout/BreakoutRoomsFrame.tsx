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

import { useBreakoutRoomsManagerWithLatestMeetingState } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'

export function BreakoutRoomsWithParticipants() {
  const { meeting } = useDyteMeeting()
  const { setIsBreakoutSlide, setBreakoutSlideId } = useEventSession()
  const { endBreakoutRooms: _endBreakoutRooms, joinRoom: _joinRoom } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  const endBreakoutRooms = () => {
    setBreakoutSlideId(null)
    _endBreakoutRooms()
    setIsBreakoutSlide(false)
  }

  const joinRoom = (meetId: string) => {
    _joinRoom(meetId)
  }

  return (
    <div className="m-1 w-full flex-1 pr-12">
      <div className="flex">
        {meeting.connectedMeetings.meetings.map((meet) => (
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
                {meet.participants.length === 0 ? (
                  <p className="text-sm text-gray-400">No participants</p>
                ) : null}
                {meet.participants.map((participant) => (
                  <div className="flex items-center mb-2">
                    <div>
                      {participant.displayPictureUrl ? (
                        <img
                          className="w-8 h-8 "
                          src={participant.displayPictureUrl}
                          alt={participant.id}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 mr-2">
                          <p className="text-sm">
                            {participant.displayName?.split(' ')[0]?.[0]}
                            {participant.displayName?.split(' ')[1]?.[0]}
                          </p>
                        </div>
                      )}
                    </div>
                    {participant.displayName}
                  </div>
                ))}
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
        <Button onClick={endBreakoutRooms} color="danger">
          End Breakout
        </Button>
      </div>
    </div>
  )
}
