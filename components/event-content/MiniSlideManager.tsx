import { ISlide } from "@/types/slide.type"
import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarRightCollapseFilled,
} from "@tabler/icons-react"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import {
  DragDropContext,
  Draggable,
  type DroppableProps,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd"
import { MiniSlideManagerCard } from "./MiniSlideManagerCard"

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
  mode?: "edit" | "present" | "read"
  slides: ISlide[]
  addSlideRef?: React.RefObject<HTMLDivElement>
  currentSlide: ISlide | null
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentSlide: (slide: ISlide) => void
  onMiniModeChange: (miniMode: boolean) => void
  reorderSlide: OnDragEndResponder
}

function MiniSlideManager({
  mode = "edit",
  slides,
  addSlideRef,
  currentSlide,
  setOpenContentTypePicker,
  setCurrentSlide,
  onMiniModeChange,
  reorderSlide,
}: IMiniSlideManagerProps) {
  const [miniMode, setMiniMode] = useState<boolean>(true)
  useEffect(() => {
    onMiniModeChange(miniMode)
  }, [miniMode])

  return (
    <div
      className={clsx(
        "fixed top-0 w-72 bg-white/95 h-full transition-all pt-16 pb-4",
        miniMode ? "left-0" : "-left-64"
      )}
    >
      <div className="flex flex-col justify-start items-center w-full pt-4 px-6">
        <DragDropContext onDragEnd={reorderSlide}>
          <StrictModeDroppable droppableId="droppable-1" type="slide">
            {(provided: any) => (
              <div
                className="flex flex-col justify-start items-center gap-4 w-full flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-auto max-h-[calc(100vh_-_142px)] mb-1"
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
                          slide={slide}
                          currentSlide={currentSlide}
                          setCurrentSlide={setCurrentSlide}
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
        {mode === "edit" && (
          <div className="flex justify-start items-center gap-2 w-full">
            <span className="w-5"></span>
            <div
              ref={addSlideRef}
              onClick={() => setOpenContentTypePicker?.(true)}
              className={clsx(
                "relative rounded-md flex-auto w-full h-12 cursor-pointer transition-all border-2 flex justify-center items-center bg-black/80 text-white"
              )}
            >
              New Slide
            </div>
          </div>
        )}
        <button
          className="absolute right-0 bottom-0 flex justify-center items-center cursor-pointer w-8 h-8 text-black rounded-sm rounded-b-none"
          onClick={() => {
            setMiniMode(!miniMode)
          }}
        >
          {miniMode ? (
            <IconLayoutSidebarLeftCollapseFilled size={20} />
          ) : (
            <IconLayoutSidebarRightCollapseFilled size={20} />
          )}
        </button>
      </div>
    </div>
  )
}

export default MiniSlideManager
