/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'

import { IconList, IconLayoutGrid } from '@tabler/icons-react'
import {
  DragDropContext,
  Draggable,
  type DroppableProps,
  Droppable,
  OnDragEndResponder,
  DroppableProvided,
} from 'react-beautiful-dnd'

import { Tooltip } from '@nextui-org/react'

import { MiniSlideManagerCard } from './MiniSlideManagerCard'

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
  mode?: 'edit' | 'present' | 'read'
  slides: ISlide[]
  addSlideRef?: React.RefObject<HTMLDivElement>
  currentSlide: ISlide | null
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentSlide: (slide: ISlide) => void
  reorderSlide: OnDragEndResponder
}

export function MiniSlideManager({
  mode = 'edit',
  slides,
  addSlideRef,
  currentSlide,
  setOpenContentTypePicker,
  setCurrentSlide,
  reorderSlide,
}: IMiniSlideManagerProps) {
  const [miniSlideView, setMiniSlideView] = useState<'thumbnail' | 'list'>(
    'list'
  )

  return (
    <div className={cn('w-full bg-white/95 h-full transition-all', {})}>
      <div className="flex flex-col justify-start items-center w-full px-6">
        <div className="flex items-center gap-4 justify-end w-full pb-4">
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
                className="flex flex-col justify-start items-center gap-4 w-full flex-nowrap scrollbar-none overflow-y-auto max-h-[calc(100vh_-_170px)] pb-2"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {slides.map((slide, index) => (
                  <Draggable
                    key={`slide-draggable-${slide.id}`}
                    draggableId={`slide-draggable-${slide.id}`}
                    index={index}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(_provided: any) => (
                      <div
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                        className="w-full">
                        <MiniSlideManagerCard
                          mode={mode}
                          slide={slide}
                          currentSlide={currentSlide}
                          setCurrentSlide={setCurrentSlide}
                          index={index}
                          draggableProps={_provided.dragHandleProps}
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
        {mode === 'edit' && (
          <div className="flex justify-start items-center gap-2 w-full sticky bottom-3.5">
            <div
              ref={addSlideRef}
              onClick={() => setOpenContentTypePicker?.(true)}
              className={cn(
                'relative rounded-md flex-auto w-full h-12 cursor-pointer transition-all border-2 border-black flex justify-center items-center bg-black/80 text-white'
              )}>
              New Slide
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
