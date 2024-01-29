"use client"

import React, { useState } from "react"
import {
  IconChevronDown,
  IconChevronUp,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react"
import clsx from "clsx"
import { ISlide } from "@/types/slide.type"
import { ContentType } from "./ContentTypePicker"
import CoverEditor from "./CoverEditor"
import PollEditor from "./PollEditor"
import GoogleSlidesEditor from "./GoogleSlidesEditor"

interface SlideProps {
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
}: SlideProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
  }

  return (
    <div className="relative group w-full h-full">
      <div className=" relative left-0 w-full">
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
        className="relative w-full h-full rounded-md overflow-auto transition-all"
      >
        {slide.contentType === ContentType.POLL && (
          <PollEditor slide={slide} openSettings={openSettings} />
        )}
        {slide.contentType === ContentType.COVER && (
          <CoverEditor slide={slide} />
        )}
        {slide.contentType === ContentType.GOOGLE_SLIDERS && (
          <GoogleSlidesEditor slide={slide} />
        )}
      </div>
    </div>
  )
}
