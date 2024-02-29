"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/utils/utils"
import { ISlide } from "@/types/slide.type"
import { ContentType } from "./ContentTypePicker"
import CoverEditor from "./CoverEditor"
import PollEditor from "./PollEditor"
import GoogleSlidesEditor from "./GoogleSlidesEditor"
import ReflectionEditor from "./ReflectionEditor"
import VideoEmbedEditor from "./VideoEmbedEditor"

const PDFUploader = dynamic(
  () => import("./PDFUploader").then((mod) => mod.PDFUploader),
  {
    ssr: false,
  }
)

interface SlideProps {
  isOwner: boolean
  slide: ISlide
  onChange?: (data: Partial<ISlide>, index: number) => void
  updateSlide: (slide: ISlide) => void
}

export default function Slide({ isOwner = false, slide }: SlideProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const toggleSettings = () => {
    setOpenSettings((o) => !o)
  }

  return (
    <div
      className={cn("relative group w-full h-full", {
        "pointer-events-none": !isOwner,
      })}
    >
      <div
        className={cn("relative left-0 w-full", {
          hidden: !isOwner,
        })}
      ></div>
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto transition-all"
      >
        {slide.type === ContentType.POLL && (
          <PollEditor slide={slide} openSettings={openSettings} />
        )}
        {slide.type === ContentType.COVER && <CoverEditor slide={slide} />}
        {slide.type === ContentType.GOOGLE_SLIDES && (
          <GoogleSlidesEditor slide={slide} />
        )}
        {slide.type === ContentType.REFLECTION && (
          <ReflectionEditor slide={slide} />
        )}
        {slide.type === ContentType.PDF_VIEWER && <PDFUploader slide={slide} />}
        {slide.type === ContentType.VIDEO_EMBED && (
          <VideoEmbedEditor slide={slide} />
        )}
      </div>
    </div>
  )
}
