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
                    breakout={currentFrame?.content?.breakoutDetails?.[index]}
                    deleteRoomGroup={() => null}
                    idx={0}
                    editable={false}
                    onAddNewActivity={() => null}
                    updateBreakoutGroupRoomNameName={() => null}
                  />
                </RenderIf>
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
