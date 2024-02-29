import {
  IMiniSlideManagerType,
  ISlide,
  SlideManagerContextType,
} from "@/types/slide.type"
import { cn } from "@/utils/utils"
import { IconDots, IconGripVertical } from "@tabler/icons-react"
import SlideActions from "./SlideActions"
import { contentTypes } from "./ContentTypePicker"
import { DeleteSlideModal } from "./DeleteSlideModal"
import { useContext, useState } from "react"
import SlideManagerContext from "@/contexts/SlideManagerContext"

export const MiniSlideManagerCard = ({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  draggableProps,
  mode,
  miniSlideView,
}: IMiniSlideManagerType) => {
  const { deleteSlide, moveUpSlide, moveDownSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const Icon = contentTypes.find(
    (type) => type.contentType === slide.type
  )?.icon

  const handleActions = (
    action: { key: string; label: string },
    id: string
  ) => {
    if (action.key === "delete") {
      setIsModalOpen(true)
      return
    }
    if (action.key === "move_up") {
      moveUpSlide(id)
      return
    }
    if (action.key === "move_down") {
      moveDownSlide(id)
      return
    }
  }

  const handleDelete = (slide: ISlide) => {
    deleteSlide(slide.id)
    setIsModalOpen(false)
  }

  if (miniSlideView === "thumbnail") {
    return (
      <div
        data-minislide-id={slide.id}
        key={`mini-slide-${slide.id}`}
        className="flex justify-start items-center gap-2 w-full"
        {...(mode === "edit" && draggableProps)}
      >
        <span className="w-5">{index + 1}.</span>
        <div
          onClick={() => setCurrentSlide(slide)}
          className={cn(
            "relative rounded-md flex-auto w-full aspect-video cursor-pointer transition-all border-2 flex justify-center items-center capitalize",
            currentSlide?.id === slide.id
              ? "drop-shadow-md border-black"
              : "drop-shadow-none border-black/20"
          )}
          style={{
            backgroundColor: slide.config?.backgroundColor || "#166534",
          }}
        >
          <div className="absolute left-0 bottom-0 p-2">{slide.name}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      data-minislide-id={slide.id}
      key={`mini-slide-${slide.id}`}
      className="flex justify-start items-center gap-2 w-full"
    >
      <span className="w-5">{index + 1}.</span>
      <div className="text-slate-500">{Icon}</div>
      <div
        {...(mode === "edit" && draggableProps)}
        className={cn(
          "rounded-md flex-auto w-full transition-all border-2 flex items-center justify-between capitalize group",
          currentSlide?.id === slide.id
            ? "drop-shadow-md border-black"
            : "drop-shadow-none border-black/20"
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || "#166534",
        }}
      >
        <div
          className="flex items-center gap-1 w-full cursor-pointer py-1"
          onClick={() => setCurrentSlide(slide)}
        >
          <IconGripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
          <p className="line-clamp-1">{slide.name}</p>
        </div>
        <SlideActions
          triggerIcon={
            <div className="h-full w-fit bg-slate-100 rounded">
              <IconDots className="h-6 w-6 text-slate-500 px-1" />
            </div>
          }
          handleActions={(action) => handleActions(action, slide.id)}
        />
      </div>
      <DeleteSlideModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={handleDelete}
        slide={slide}
      />
    </div>
  )
}
export default MiniSlideManagerCard
