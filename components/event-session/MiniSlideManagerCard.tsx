import { ISlide } from "@/types/slide.type"
import { cn } from "@/utils/utils"
import { IconDots } from "@tabler/icons-react"
import { useContext } from "react"
import { SlideActions } from "./SlideActions"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"

interface SlideThumbnailViewProps {
  slide: ISlide
  draggableProps: any
  index: number
  mode: "edit" | "present" | "read"
  handleActions: any
}

const SlideThumbnailView = ({
  slide,
  draggableProps,
  index,
  mode,
  handleActions,
}: SlideThumbnailViewProps) => {
  const { currentSlide, setCurrentSlide, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full"
      {...(mode === "present" && draggableProps)}
    >
      <span className="w-5">{index + 1}</span>
      <div
        onClick={() => {
          if (isHost) setCurrentSlide(slide)
        }}
        className={cn(
          "relative rounded-md w-full aspect-video transition-all border-2 capitalize group",
          currentSlide?.id === slide.id
            ? "drop-shadow-md border-black"
            : "drop-shadow-none border-black/20",
          { "cursor-pointer": isHost }
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || "#FFFFFF",
        }}
      >
        <div className="absolute left-0 px-2 bottom-1 flex items-center justify-between w-full">
          <div className="shrink w-full">
            <p className="line-clamp-1 py-1">{slide.name}</p>
          </div>
          {isHost && (
            <SlideActions
              triggerIcon={
                <div className="h-full w-fit bg-slate-100 rounded hidden group-hover:block">
                  <IconDots className="h-6 w-6 text-slate-500 px-1" />
                </div>
              }
              handleActions={(action) => handleActions(action, slide.id)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

type SlideActionKey = "moveUp" | "moveDown"

interface IMiniSlideManagerCardProps {
  slide: ISlide
  index: number
  draggableProps: any
  mode: "edit" | "present" | "read"
}

export const MiniSlideManagerCard = ({
  slide,
  index,
  draggableProps,
  mode,
}: IMiniSlideManagerCardProps) => {
  const { moveUpSlide, moveDownSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const handleActions = (
    action: { key: SlideActionKey; label: string },
    id: string
  ) => {
    const actions: Record<SlideActionKey, any> = {
      moveUp: () => moveUpSlide(id),
      moveDown: () => moveDownSlide(id),
    }

    actions[action.key]()
  }

  return (
    <SlideThumbnailView
      slide={slide}
      draggableProps={draggableProps}
      index={index}
      mode={mode}
      handleActions={handleActions}
    />
  )
}
export default MiniSlideManagerCard
