/* eslint-disable jsx-a11y/control-has-associated-label */

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useMutation } from '@tanstack/react-query'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react'

import {
  useBreakoutRooms,
  useBreakoutRoomsManagerWithLatestMeetingState,
} from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import {
  moveHostToRoom,
  stopBreakoutRooms,
} from '@/services/dyte/breakout-room-manager.service'

export function BreakoutRoomsFrame() {
  const { setIsBreakoutSlide } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { breakoutRoomsManager } =
    useBreakoutRoomsManagerWithLatestMeetingState()
  const { isCurrentDyteMeetingInABreakoutRoom } = useBreakoutRooms()
  const stopBreakoutMutation = useMutation({
    mutationFn: () =>
      stopBreakoutRooms({
        meeting,
        stateManager: breakoutRoomsManager,
      }),
    onSuccess: () => setIsBreakoutSlide(false),
  })
  const moveHostToRoomMutation = useMutation({
    mutationFn: (destinationMeetingId: string) =>
      moveHostToRoom({
        meeting,
        stateManager: breakoutRoomsManager,
        destinationMeetingId,
      }),
  })

  const joinRoom = (meetId: string) => {
    moveHostToRoomMutation.mutate(meetId)
  }
  const joinMainRoom = () => {
    if (!meeting.connectedMeetings.parentMeeting?.id) return
    moveHostToRoomMutation.mutate(meeting.connectedMeetings.parentMeeting.id)
  }

  return (
    <div className="m-6 w-full flex-1 pr-12">
      <h4 className="mb-6 font-semibold text-xl">Breakout in progress</h4>
      <div className="flex">
        {meeting.connectedMeetings.meetings.map((meet) => (
          <div key={meet.id} className="mr-4">
            <Card className="p-2" style={{ minWidth: 100 }}>
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
                  <Button size="sm" onClick={() => joinRoom(meet.id || '')}>
                    Join room
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        {isCurrentDyteMeetingInABreakoutRoom ? (
          <Button size="sm" onClick={() => joinMainRoom()}>
            Back to Main Room
          </Button>
        ) : (
          <div />
        )}
        <Button
          size="sm"
          onClick={() => stopBreakoutMutation.mutate()}
          isLoading={stopBreakoutMutation.isPending}
          color="danger">
          Stop Breakout
        </Button>
      </div>
    </div>
  )
}
