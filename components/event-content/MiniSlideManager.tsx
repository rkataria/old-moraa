import { ISlide } from "@/types/slide.type"
import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarRightCollapseFilled,
} from "@tabler/icons-react"
import clsx from "clsx"
import React, { useEffect, useState } from "react"

interface IMiniSlideManagerProps {
  mode?: "edit" | "present"
  slides: ISlide[]
  addSlideRef?: React.RefObject<HTMLDivElement>
  currentSlide: ISlide | null
  setOpenContentTypePicker?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentSlide: (slide: ISlide) => void
  onMiniModeChange: (miniMode: boolean) => void
}

function MiniSlideManager({
  mode = "edit",
  slides,
  addSlideRef,
  currentSlide,
  setOpenContentTypePicker,
  setCurrentSlide,
  onMiniModeChange,
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
      <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
        {slides.map((slide, index) => (
          <div
            data-minislide-id={slide.id}
            key={`mini-slide-${slide.id}`}
            className="flex justify-start items-center gap-2 w-full"
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
