import { ISlide } from "@/types/slide.type"
import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarRightCollapseFilled,
} from "@tabler/icons-react"
import clsx from "clsx"
import React, { useEffect, useRef, useState } from "react"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import { type DroppableProps, Droppable } from "react-beautiful-dnd"

interface IMiniSlideManagerCard {
  id: string
  slide: ISlide
  index: number
  reorderSlide: (dragIndex: number, hoverIndex: number) => void
  currentSlide: ISlide
  setCurrentSlide: (slide: ISlide) => void
}

const MiniSlideManagerCard = ({
  id,
  slide,
  index,
  reorderSlide,
  currentSlide,
  setCurrentSlide,
}: IMiniSlideManagerCard) => {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      reorderSlide(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <span className="w-5">{index + 1}.</span>
      <div
        onClick={() => setCurrentSlide(slide)}
        className={clsx(
          "relative rounded-md flex-auto w-full aspect-video cursor-pointer transition-all border-2 flex justify-center items-center capitalize",
          currentSlide?.id === slide.id
            ? "drop-shadow-md border-black"
            : "drop-shadow-none border-black/20"
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || "#166534",
        }}
      >
        {slide.type}
      </div>
    </div>
  )
}

interface IMiniSlideManagerProps {
  mode?: "edit" | "present" | "read"
  slides: ISlide[]
  addSlideRef?: React.RefObject<HTMLDivElement>
  currentSlide: ISlide | null
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentSlide: (slide: ISlide) => void
  onMiniModeChange: (miniMode: boolean) => void
  reorderSlide: (dragIndex: number, hoverIndex: number) => void
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
      <div className="flex flex-col justify-start items-center gap-4 w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-auto h-[calc(100vh_-_50px)]">
        {slides.map((slide, index) => (
          // <div
          //   data-minislide-id={slide.id}
          //   key={`mini-slide-${slide.id}`}
          //   className="flex justify-start items-center gap-2 w-full"
          // >
          //   <span className="w-5">{index + 1}.</span>
          //   <div
          //     onClick={() => setCurrentSlide(slide)}
          //     className={clsx(
          //       "relative rounded-md flex-auto w-full aspect-video cursor-pointer transition-all border-2 flex justify-center items-center capitalize",
          //       currentSlide?.id === slide.id
          //         ? "drop-shadow-md border-black"
          //         : "drop-shadow-none border-black/20"
          //     )}
          //     style={{
          //       backgroundColor: slide.config?.backgroundColor || "#166534",
          //     }}
          //   >
          //     {slide.type}
          //   </div>
          // </div>
          <DragDropContext onDragEnd={handleDragDropEndCategories}>
            <StrictModeDroppable
              droppableId="droppable-1"
              type="PERSON"
            ></StrictModeDroppable>
          </DragDropContext>
          // <MiniSlideManagerCard
          //   key={slide.id}
          //   slide={slide}
          //   index={index}
          //   reorderSlide={reorderSlide}
          //   id={slide.id}
          //   currentSlide={currentSlide}
          //   setCurrentSlide={setCurrentSlide}
          // />
        ))}
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
