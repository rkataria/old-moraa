import { ISlide } from "@/types/slide.type"
import clsx from "clsx"
import React from "react"

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
  mode = "present",
  slides,
  addSlideRef,
  currentSlide,
  setOpenContentTypePicker,
  setCurrentSlide,
}: IMiniSlideManagerProps) {
  return (
    <div
      className={clsx("bg-white/95 transition-all duration-200", {
        "w-72 opacity-1": visible,
        "w-0 opacity-0": !visible,
      })}
    >
      <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-2 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
        {slides.map((slide, index) => (
          <div
            data-minislide-id={slide.id}
            key={`mini-slide-${slide.id}`}
            className="flex justify-start items-center gap-2 w-full"
          >
            <span className="w-5">{index + 1}.</span>
            <div
              onClick={() => {
                if (isHost) setCurrentSlide(slide)
              }}
              className={clsx(
                "relative rounded-md flex-auto w-full aspect-video transition-all border-2 flex justify-center items-center capitalize",
                {
                  "cursor-pointer": isHost,
                  "drop-shadow-md border-black": currentSlide?.id === slide.id,
                  "drop-shadow-none border-black/20":
                    currentSlide?.id !== slide.id,
                }
              )}
              style={{
                backgroundColor: slide.config?.backgroundColor || "#166534",
              }}
            >
              {slide.contentType}
            </div>
          </div>
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
      </div>
    </div>
  )
}

export default MiniSlideManager
