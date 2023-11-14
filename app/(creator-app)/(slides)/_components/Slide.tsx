"use client"

import React, { useState } from "react"
import ChooseContentType, { ContentType } from "./ChooseContentType"
import PollCreator from "./PollCreator"
import { IconSettings } from "@tabler/icons-react"
import clsx from "clsx"

export interface ISlide {
  id: string
  name: string
  content?: string
  deckId: string
  createdAt?: string
  updatedAt?: string
  config: {
    backgroundColor: string
  }
  contentType?: string
}

interface SlideProps {
  index: number
  slide: ISlide
}

export default function Slide({ index, slide }: SlideProps) {
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const addContentType = (contentType: ContentType) => {
    console.log(contentType)
    setContentType(contentType)
  }

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
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
          {contentType && (
            <>
              {/* {openPreview ? (
                <span onClick={togglePreview}>Edit Poll</span>
              ) : (
                <span onClick={togglePreview}>Preview Poll</span>
              )} */}
              <IconSettings
                onClick={toggleSettings}
                className={clsx("cursor-pointer transition-all", {
                  "rotate-0": !openSettings,
                  "rotate-45": openSettings,
                })}
              />
            </>
          )}
        </div>
      </div>
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 transition-all"
        style={{
          backgroundColor: slide.config.backgroundColor || "#fff",
        }}
      >
        {!contentType && (
          <div className="p-12 bg-black/50 rounded-md absolute left-0 top-0 w-full h-full hidden group-hover:block transition-all">
            <ChooseContentType onChoose={addContentType} />
          </div>
        )}
        {contentType === "poll" && <PollCreator openSettings={openSettings} />}
      </div>
    </div>
  )
}
