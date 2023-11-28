"use client"

import React, { useState } from "react"
import { ContentType } from "./ContentTypePicker"
import PollCreator from "./PollCreator"
import { IconSettings } from "@tabler/icons-react"
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
}

export default function Slide({ index, slide }: SlideProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
  }

  const syncSlide = (data: Partial<ISlide>) => {
    console.log("syncing slide", data)
  }

  return (
    <div className="relative min-w-[75%] w-[75%] aspect-video m-auto group">
      <div className="absolute -top-8 left-0 w-full flex justify-between items-center">
        <div className="flex justify-start items-center gap-2">
          <h3 className="font-sm font-semibold">{`Slide ${index + 1} - `}</h3>
          <input
            placeholder="Add slide name"
            className="font-sm font-semibold p-0 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0"
          />
        </div>
        <div className={clsx("flex justify-end items-center gap-2")}>
          <IconSettings
            onClick={toggleSettings}
            className={clsx("cursor-pointer transition-all", {
              "rotate-0": !openSettings,
              "rotate-45": openSettings,
            })}
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
