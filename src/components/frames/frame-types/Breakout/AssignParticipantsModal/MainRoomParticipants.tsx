import { Draggable, Droppable } from 'react-beautiful-dnd'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import { Participant } from './Participant'
import { ParticipantLive } from './ParticipantLive'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventContext } from '@/contexts/EventContext'

export function MainRoomParticipants({
  participants,
}: {
  participants: {
    id: string
    name: string
    email: string | null
    avatar: string | null | undefined
  }[]
}) {
  const { eventMode } = useEventContext()

  return (
    <div className="w-full p-2">
      <Droppable droppableId="main-room" type="participants">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <RenderIf isTrue={participants.length === 0}>
              <EmptyPlaceholder isDraggingOver={snapshot.isDraggingOver} />
            </RenderIf>
            {participants.map((item, index) => (
              <div key={item.id}>
                <Draggable index={index} draggableId={item.id}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className="mb-2 items-center mr-2">
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
        )}
      </Droppable>
    </div>
  )
}
