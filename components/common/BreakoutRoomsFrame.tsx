/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@nextui-org/react'

import {
  useBreakoutRooms,
  useBreakoutRoomsManagerWithLatestMeetingState,
} from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'

export function BreakoutRoomsFrame() {
  const { meeting } = useDyteMeeting()
  const {
    currentFrame,
    presentationStatus,
    setIsBreakoutSlide,
    setBreakoutSlideId,
  } = useEventSession()
  const totalParticipants = meeting.participants.count
  const [participantsPerRoom, setParticipantsPerRoom] = useState(
    totalParticipants / 5 > 1 ? totalParticipants / 5 : 1
  )
  const { isBreakoutActive } = useBreakoutRooms()
  const {
    endBreakoutRooms: _endBreakoutRooms,
    startBreakoutRooms: _startBreakoutRooms,
    joinRoom: _joinRoom,
  } = useBreakoutRoomsManagerWithLatestMeetingState()

  const startBreakoutRooms = () => {
    _startBreakoutRooms({ participantsPerRoom })
    if (presentationStatus === PresentationStatuses.STARTED) {
      setBreakoutSlideId(currentFrame?.id || null)
    }
  }

  const endBreakoutRooms = () => {
    setBreakoutSlideId(null)
    _endBreakoutRooms()
    setIsBreakoutSlide(false)
  }

  const joinRoom = (meetId: string) => {
    _joinRoom(meetId)
  }

  if (!isBreakoutActive) {
    return (
      <Card className="mt-4 mx-20" shadow="none">
        <CardHeader>
          <h4 className="font-semibold text-xl">
            Create breakout rooms{' '}
            {presentationStatus === PresentationStatuses.STARTED &&
            currentFrame?.name
              ? `for ${currentFrame.name}`
              : ''}
          </h4>
        </CardHeader>
        <CardBody>
          <Input
            value={String(participantsPerRoom)}
            onChange={(e) =>
              Number(e.target.value) > totalParticipants
                ? setParticipantsPerRoom(totalParticipants)
                : setParticipantsPerRoom(Number(e.target.value))
            }
            label="Participant per room"
            type="number"
          />
        </CardBody>
        <CardFooter>
          <Button color="primary" variant="solid" onClick={startBreakoutRooms}>
            Start Breakout
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="m-6 w-full flex-1 pr-12">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-semibold text-xl">Breakout in progress</h4>
      </div>
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
