import { useContext, useEffect, useState } from 'react'

import { IconLayoutGrid, IconList } from '@tabler/icons-react'
import {
  DragDropContext,
  Draggable,
  type DroppableProps,
  Droppable,
  type DroppableProvided,
} from 'react-beautiful-dnd'

import { Tooltip } from '@nextui-org/react'

import { MiniSlideManagerCard } from './MiniSlideManagerCard'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

function StrictModeDroppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) return null

  return <Droppable {...props}>{children}</Droppable>
}
interface IMiniSlideManagerProps {
  isHost?: boolean
  visible?: boolean
  slides: ISlide[]
}

export function MiniSlideManager({
  isHost,
  visible = true,
  slides,
}: IMiniSlideManagerProps) {
  const { reorderSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const [miniSlideView, setMiniSlideView] = useState<'thumbnail' | 'list'>(
    'list'
  )

  return (
    <div
      className={cn(
        'bg-white/95 transition-all duration-200 relative overflow-y-auto scrollbar-none h-[calc(100vh_-_64px)]',
        {
          'w-72 opacity-100 pr-4': visible,
          'w-0 opacity-0': !visible,
        }
      )}>
      <div className="flex flex-col justify-start items-center w-full  pl-4">
        <div className="flex items-center gap-4 justify-end w-full pb-4 pt-2">
          <Tooltip content="Thumbnail View">
            <IconLayoutGrid
              className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
                'text-slate-500': miniSlideView === 'thumbnail',
                'text-slate-300': miniSlideView !== 'thumbnail',
              })}
              onClick={() => setMiniSlideView('thumbnail')}
            />
          </Tooltip>
          <Tooltip content="List View">
            <IconList
              className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
                'text-slate-500': miniSlideView === 'list',
                'text-slate-300': miniSlideView !== 'list',
              })}
              onClick={() => setMiniSlideView('list')}
            />
          </Tooltip>
        </div>
        <DragDropContext onDragEnd={reorderSlide}>
          <StrictModeDroppable droppableId="droppable-1" type="slide">
            {(provided: DroppableProvided) => (
              <div
                className="flex flex-col justify-start items-center gap-4 w-full flex-nowrap scrollbar-none overflow-y-auto"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {slides.map((slide, index) => (
                  <Draggable
                    key={`slide-draggable-${slide.id}`}
                    draggableId={`slide-draggable-${slide.id}`}
                    index={index}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(draggableProvided: any) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className="w-full">
                        <MiniSlideManagerCard
                          mode={isHost ? 'present' : 'read'}
                          slide={slide}
                          index={index}
                          draggableProps={draggableProvided.dragHandleProps}
                          miniSlideView={miniSlideView}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
    </div>
  )
}
