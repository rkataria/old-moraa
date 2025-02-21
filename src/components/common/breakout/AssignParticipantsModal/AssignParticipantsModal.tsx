/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { MainRoomParticipants } from './MainRoomParticipants'
import { RoomList } from './RoomList'
import { RenderIf } from '../../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { useEvent } from '@/hooks/useEvent'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { cn } from '@/utils/utils'

type AssignParticipantsModalProps = {
  open: boolean
  actions?: React.ReactNode | null
  setOpen: (open: boolean) => void
}

export function AssignParticipantsModal({
  open,
  actions,
  setOpen,
}: AssignParticipantsModalProps) {
  const { updateFrame } = useEventContext()
  const currentFrame = useCurrentFrame() as any
  const { eventId } = useParams({ strict: false })
  const { participants } = useEvent({
    id: eventId as string,
  })
  const [assignments, setAssignments] = useState<Record<string, string[]>>(
    currentFrame?.content?.breakoutRoomAssignments || {}
  )
  const breakoutActivityQuery = useBreakoutActivities({
    frameId: currentFrame.id!,
  })

  useEffect(() => {
    if (
      JSON.stringify(assignments) ===
      JSON.stringify(currentFrame?.content?.breakoutRoomAssignments)
    ) {
      return
    }

    handleUpdatedAssignments(assignments)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments])

  if (!currentFrame) return null

  const handleUpdatedAssignments = (
    newAssignments: Record<string, string[]>
  ) => {
    updateFrame({
      framePayload: {
        content: {
          ...currentFrame?.content,
          breakoutRoomAssignments: newAssignments,
        },
      },
      frameId: currentFrame.id,
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === destination.droppableId) return

    if (source.droppableId === 'main-room') {
      const participantId = result.draggableId
      const destinationRoomId = destination.droppableId

      setAssignments((prevAssignments) => ({
        ...prevAssignments,
        [destinationRoomId]: [
          ...(prevAssignments[destinationRoomId] || []),
          participantId,
        ],
      }))

      return
    }

    if (destination.droppableId === 'main-room') {
      const participantId = result.draggableId
      const sourceRoomId = source.droppableId

      setAssignments((prevAssignments) => {
        const updatedAssignments = { ...prevAssignments }

        updatedAssignments[sourceRoomId] = prevAssignments[sourceRoomId].filter(
          (id: string) => id !== participantId
        )

        return updatedAssignments
      })

      return
    }

    const sourceRoomId = source.droppableId
    const destinationRoomId = destination.droppableId
    const participantId = result.draggableId

    setAssignments((prevAssignments) => {
      const updatedAssignments = { ...prevAssignments }

      updatedAssignments[sourceRoomId] = prevAssignments[sourceRoomId].filter(
        (id: string) => id !== participantId
      )

      updatedAssignments[destinationRoomId] = [
        ...(prevAssignments[destinationRoomId] || []),
        participantId,
      ]

      return updatedAssignments
    })
  }

  const rooms = breakoutActivityQuery.data || []

  const participantsList = (participants || []).map((participant) => ({
    id: participant.id,
    name: `${participant.profile?.first_name} ${participant.profile?.last_name}`,
    email: participant.email,
    avatar: participant.profile?.avatar_url,
  }))

  const assignedParticipantIds = Object.values(assignments).flat()
  const unassignedParticipants = participantsList.filter(
    (participant) => !assignedParticipantIds.includes(participant.id)
  )

  const roomsWithParticipants = rooms.map((room: any) => ({
    ...room,
    participants:
      assignments[room.id]?.map((id) =>
        participantsList.find((p) => p.id === id)
      ) || [],
  }))

  return (
    <Modal
      size="4xl"
      placement="top"
      isOpen={open}
      style={{
        height: '80vh',
      }}
      classNames={{
        closeButton: 'text-white bg-black/10 hover:bg-black/20 top-5 right-5',
      }}
      onOpenChange={setOpen}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white p-6">
              <div className="flex flex-col gap-2">
                <span>Assign Participants</span>
                <span className="text-sm font-normal text-gray-200">
                  Assign participants to breakout rooms
                </span>
              </div>
            </ModalHeader>
            <ModalBody
              className={cn('px-4 h-full', {
                'max-h-[calc(80vh_-_104px)]': !actions,
                'max-h-[calc(80vh_-_104px_-_56px)]': !!actions,
              })}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="h-full flex flex-row justify-start items-start">
                  <div className="border-r-2 border-r-gray-100 h-full w-72 flex flex-col justify-start items-start">
                    <div className="flex-1 h-14 w-full p-4 border-b-2 border-b-gray-100 font-semibold">
                      Participants ({unassignedParticipants.length})
                    </div>
                    <div className="flex-auto overflow-y-auto h-full w-full">
                      <MainRoomParticipants
                        participants={unassignedParticipants}
                      />
                    </div>
                  </div>
                  <div className="flex-auto h-full flex flex-col justify-start items-start">
                    <div className="flex-1 h-14 w-full p-4 border-b-2 border-b-gray-100 font-semibold">
                      Rooms ({rooms.length})
                    </div>
                    <div className="flex-auto overflow-y-auto h-full w-full scrollbar-thin">
                      <RoomList rooms={roomsWithParticipants} />
                    </div>
                  </div>
                </div>
              </DragDropContext>
            </ModalBody>
            <RenderIf isTrue={!!actions}>
              <ModalFooter>{actions}</ModalFooter>
            </RenderIf>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
