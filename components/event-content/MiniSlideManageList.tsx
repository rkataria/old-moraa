import { IMiniSlideManagerType } from "@/types/slide.type"
import { IconGripVertical } from "@tabler/icons-react"
import { contentTypes } from "./ContentTypePicker"
import { cn } from "@/utils/utils"

export const MiniSlideManageList = ({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  draggableProps,
  mode,
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
        onClick={() => setCurrentSlide(slide)}
        {...(mode === "edit" && draggableProps)}
        className={cn(
          "relative rounded-md flex-auto w-full cursor-pointer transition-all border-2 flex items-center gap-1 capitalize group py-2",
          currentSlide?.id === slide.id
            ? "drop-shadow-md border-black"
            : "drop-shadow-none border-black/20"
        )}
        style={{
          backgroundColor: slide.config?.backgroundColor || "#166534",
        }}
      >
        <IconGripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
        <p>{slide.type}</p>
      </div>
    </div>
  )
}
