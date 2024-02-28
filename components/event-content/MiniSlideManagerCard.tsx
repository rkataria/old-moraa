import { IMiniSlideManagerType } from "@/types/slide.type"
import { cn } from "@/utils/utils"

export const MiniSlideManagerCard = ({
  slide,
  index,
  currentSlide,
  setCurrentSlide,
  draggableProps,
  mode,
  handleActions,
}: IMiniSlideManagerType) => {
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
        {slide.type}
      </div>
    </div>
  )
}
export default MiniSlideManagerCard
