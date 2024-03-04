import SlideManagerContext from "@/contexts/SlideManagerContext"
import { ISlide } from "@/types/slide.type"
import React, { useContext, useEffect, useState } from "react"
import {
  DragDropContext,
  Draggable,
  type DroppableProps,
  Droppable,
} from "react-beautiful-dnd"
import MiniSlideManagerCard from "./MiniSlideManagerCard"
import { cn } from "@/utils/utils"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
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
  mode?: "edit" | "present"
  slides: ISlide[]
  addSlideRef?: React.RefObject<HTMLDivElement>
  currentSlide: ISlide | null
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentSlide: (slide: ISlide) => void
}

function MiniSlideManager({
  isHost,
  visible = true,
  slides,
}: IMiniSlideManagerProps) {
  const { reorderSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  return (
    <div
      className={cn("bg-white/95 transition-all duration-200 relative", {
        "w-72 opacity-1": visible,
        "w-0 opacity-0": !visible,
      })}
    >
      <DragDropContext onDragEnd={reorderSlide}>
        <StrictModeDroppable droppableId="droppable-1" type="slide">
          {(provided: any) => (
            <div
              className="flex flex-col justify-start items-center gap-4 w-full px-2 pt-4 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-auto mb-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {slides.map((slide, index) => (
                <Draggable
                  key={`slide-draggable-${slide.id}`}
                  draggableId={`slide-draggable-${slide.id}`}
                  index={index}
                >
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="w-full"
                    >
                      <MiniSlideManagerCard
                        mode={isHost ? "present" : "read"}
                        slide={slide}
                        index={index}
                        draggableProps={provided.dragHandleProps}
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
  )
}

export default MiniSlideManager
