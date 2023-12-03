import React, { useContext, useState } from "react"
import PollCreator from "./PollCreator"
import {
  IconChevronDown,
  IconChevronUp,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react"
import clsx from "clsx"
import BasicSlide from "./content-types/Basic"
import { ISlide } from "@/types/slide.type"

interface SlideProps {
  index: number
  slide: ISlide
  onChange?: (data: Partial<ISlide>, index: number) => void
  deleteSlide: (id: string) => void
  moveUpSlide: (id: string) => void
  moveDownSlide: (id: string) => void
  updateSlide: (slide: ISlide) => void
}

export default function Slide({
  slide,
  deleteSlide,
  moveUpSlide,
  moveDownSlide,
  updateSlide,
}: SlideProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
  }

  const syncSlide = (data: ISlide) => {
    console.log("syncing slide", data)
    updateSlide(data)
  }

  return (
    <div className="relative group w-full h-full">
      <div className="absolute -top-8 left-0 w-full">
        <div className="relative flex justify-center items-center gap-2">
          <IconChevronUp
            size={20}
            onClick={() => moveUpSlide(slide.id)}
            className={clsx(
              "text-gray-300 cursor-pointer hover:text-black transition-all duration-500"
            )}
          />
          <IconChevronDown
            size={20}
            onClick={() => moveDownSlide(slide.id)}
            className={clsx(
              "text-gray-300 cursor-pointer hover:text-black transition-all duration-500"
            )}
          />
          <IconSettings
            size={20}
            onClick={toggleSettings}
            className={clsx(
              "text-gray-300 cursor-pointer hover:text-black transition-all duration-500"
            )}
          />
          <IconTrash
            size={20}
            onClick={() => deleteSlide(slide.id)}
            className={clsx(
              "text-gray-300 cursor-pointer hover:text-red-500 transition-all duration-500"
            )}
          />
        </div>
      </div>
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 transition-all"
        style={{
          backgroundColor: slide.config?.backgroundColor || "#fff",
        }}
      >
        {slide.contentType === "poll" && (
          <PollCreator
            slide={slide}
            openSettings={openSettings}
            sync={syncSlide}
          />
        )}
        {slide.contentType === "basic" && (
          <BasicSlide slide={slide} mode="edit" sync={syncSlide} />
        )}
      </div>
    </div>
  )
}
