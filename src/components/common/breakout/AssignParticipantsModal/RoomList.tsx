/* eslint-disable @typescript-eslint/no-explicit-any */

import { Accordion, AccordionItem } from '@heroui/react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import { Participant } from './Participant'
import { ParticipantLive } from './ParticipantLive'
import { RenderIf } from '../../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { cn } from '@/utils/utils'

type RoomListProps = {
  rooms: {
    name: string
    id: string
    participants: {
      id: string
      name: string
      email: string | null
      avatar: string | null | undefined
    }[]
  }[]
}

export function RoomList({ rooms }: RoomListProps) {
  const { eventMode } = useEventContext()

  return (
    <Accordion
      variant="splitted"
      className="p-4 !shadow-none"
      selectionMode="multiple"
      defaultSelectedKeys="all">
      {rooms.map((room) => (
        <AccordionItem
          title={room.name}
          classNames={{
            base: 'shadow-none border-2 border-gray-200 mb-4',
            title: 'text-sm font-semibold',
          }}>
          <Droppable droppableId={room.id} type="participants">
            {(provided, participantDroppableSnapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn('pb-2 bg-gray-50 rounded-md', {
                  'min-h-24': participantDroppableSnapshot.isDraggingOver,
                })}
                {...provided.droppableProps}>
                <RenderIf isTrue={room.participants.length === 0}>
                  <EmptyPlaceholder
                    isDraggingOver={participantDroppableSnapshot.isDraggingOver}
                  />
                </RenderIf>
                <RenderIf isTrue={room.participants.length > 0}>
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {room.participants.map((item, index) => (
                      <div key={item.id}>
                        <Draggable index={index} draggableId={item.id}>
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}>
                              {eventMode === 'present' ? (
                                <ParticipantLive participant={item} hideEmail />
                              ) : (
                                <Participant participant={item} hideEmail />
                              )}
                            </div>
                          )}
                        </Draggable>
                      </div>
                    ))}
                  </div>
                </RenderIf>
              </div>
            )}
          </Droppable>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
