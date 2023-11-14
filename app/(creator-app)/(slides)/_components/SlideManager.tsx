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
      backgroundColor: "#fff",
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
      block: "end",
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
    <div>
      <div
        className={clsx(
          "py-32 bg-orange-100 transition-all",
          miniMode ? "pl-28" : "pl-0"
        )}
      >
        <div className="flex flex-col justify-start items-center gap-20 flex-nowrap">
          {slides.map((slide, index) => (
            <Slide key={slide.id} slide={slide} index={index} />
          ))}
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 w-48 bg-white/95 h-full transition-all",
          miniMode ? "left-0" : "-left-44"
        )}
      >
        <div className="relative w-full h-full pt-16 pb-6">
          <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
            {slides.map((slide) => (
              <div
                key={`mini-slide-${slide.id}`}
                onClick={() => setCurrentSlide(slide)}
                className={clsx(
                  "relative rounded-md flex-none w-full aspect-video cursor-pointer transition-all border-2",
                  currentSlide?.id === slide.id
                    ? "drop-shadow-md border-black"
                    : "drop-shadow-none border-black/20"
                )}
                style={{
                  backgroundColor: slide.config.backgroundColor || "#166534",
                }}
              ></div>
            ))}

            <div
              ref={addSlideRef}
              className="relative bg-black/80 text-white rounded-md flex-none w-full aspect-video flex justify-center items-center cursor-pointer"
              onClick={addNewSlide}
            >
              <IconPlus />
            </div>
            <button
              className="absolute -right-8 bottom-1 cursor-pointer w-8 h-8 p-2 text-white bg-black/50 rounded-sm rounded-b-none"
              onClick={() => setMiniMode((o) => !o)}
            >
              <ArrowDownIcon
                className={clsx(
                  "transition-all",
                  miniMode ? "rotate-90" : "-rotate-90"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
