"use client"

import React, { useState } from "react"
import { ContentType } from "./ContentTypePicker"
import PollCreator from "./PollCreator"
import {
  IconArrowBarToUp,
  IconChevronDown,
  IconChevronUp,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react"
import clsx from "clsx"
import ContentTypeBasic from "./content-types/Basic"
import BasicSlide from "./content-types/Basic"

export interface ISlide {
  id: string
  name: string
  content?: any
  createdAt?: string
  updatedAt?: string
  config: {
    backgroundColor: string
  }
  contentType: (typeof ContentType)[keyof typeof ContentType]
}

interface SlideProps {
  index: number
  slide: ISlide
  onChange?: (data: Partial<ISlide>, index: number) => void
  onDelete: (index: number) => void
}

export default function Slide({ index, slide, onDelete }: SlideProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
  }

  const syncSlide = (data: Partial<ISlide>) => {
    console.log("syncing slide", data)
  }

  const deleteSlide = () => {
    console.log("deleting slide")
    onDelete(index)
  }

  return (
    <div className="relative group w-full h-full">
      <div className="absolute -top-8 left-0 w-full">
        <div className="relative flex justify-center items-center gap-2">
          <IconChevronUp
            size={20}
            className={clsx(
              "text-gray-300 cursor-pointer hover:text-black transition-all duration-500"
            )}
          />
          <IconChevronDown
            size={20}
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
            onClick={deleteSlide}
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
          <PollCreator openSettings={openSettings} />
        )}
        {slide.contentType === "basic" && (
          <BasicSlide slide={slide} mode="edit" sync={syncSlide} />
        )}
      </div>
    </div>
  )
}
