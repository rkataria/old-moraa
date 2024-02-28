import { IMiniSlideManagerType } from "@/types/slide.type"
import { IconGripVertical, IconDots } from "@tabler/icons-react"
import { contentTypes } from "./ContentTypePicker"
import { cn } from "@/utils/utils"
import SlideActions from "./SlideActions"

export const MiniSlideManageList = ({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  draggableProps,
  mode,
  handleActions,
}: IMiniSlideManagerType) => {
  const Icon = contentTypes.find(
    (type) => type.contentType === slide.type
  )?.icon

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
          <p className="line-clamp-1">{slide.type}</p>
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
    </div>
  )
}
