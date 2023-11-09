"use client"

import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { IconPlus } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import Slide, { ISlide } from "./Slide"

const slidesData: ISlide[] = [
  {
    id: "1",
    name: "Slide 1",
    deckId: "1",
    config: {
      backgroundColor: "#166534",
    },
  },
]

export default function SlideManager() {
  const [slides, setSlides] = useState<ISlide[]>(slidesData)
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const addSlideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentSlide) return

    const currentSlideElement = document.querySelector(
      `div[data-slide-id="${currentSlide.id}"]`
    )

    if (!currentSlideElement) return

    currentSlideElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    })
    addSlideRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    })
  }, [currentSlide])

  const addNewSlide = () => {
    const newSlide: ISlide = {
      id: Math.floor(Math.random() * 10000).toString(),
      name: "New Slide",
      deckId: "1",
      config: {
        backgroundColor: "#BF360C",
      },
    }

    setSlides((o) => [...o, newSlide])
    setCurrentSlide(newSlide)
  }

  return (
    <div className="pt-32 pb-40 overflow-hidden bg-orange-100">
      <div className="flex flex-col justify-start items-center gap-20 flex-nowrap">
        {slides.map((slide, index) => (
          <Slide key={slide.id} slide={slide} index={index} />
        ))}
      </div>
      <div
        className={clsx(
          "fixed left-0 h-24 bg-white/95 w-full transition-all",
          miniMode ? "bottom-0" : "-bottom-20"
        )}
      >
        <div className="relative w-full h-full px-24 py-4">
          <div className="flex justify-start items-center gap-2 flex-nowrap overflow-x-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
            {slides.map((slide) => (
              <div
                key={`mini-slide-${slide.id}`}
                onClick={() => setCurrentSlide(slide)}
                className={clsx(
                  "rounded-md h-16 aspect-video cursor-pointer border-2 transition-all",
                  currentSlide?.id === slide.id
                    ? "border-black/50"
                    : "border-transparent"
                )}
                style={{
                  backgroundColor: slide.config.backgroundColor || "#166534",
                }}
              ></div>
            ))}

            <div
              ref={addSlideRef}
              className="bg-black/80 text-white rounded-md h-16 aspect-video flex justify-center items-center cursor-pointer"
              onClick={addNewSlide}
            >
              <IconPlus />
            </div>
            <button
              className="absolute right-1 -top-8 cursor-pointer w-8 h-8 p-2 text-white bg-black/50 rounded-sm rounded-b-none"
              onClick={() => setMiniMode((o) => !o)}
            >
              <ArrowDownIcon
                className={clsx("transition-all", miniMode ? "" : "rotate-180")}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
