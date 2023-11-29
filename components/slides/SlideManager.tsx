"use client"
import { useEffect, useRef, useState } from "react"
import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { IconPlus } from "@tabler/icons-react"
import clsx from "clsx"
import Slide, { ISlide } from "./Slide"
import ContentTypePicker, { ContentType } from "./ContentTypePicker"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import Loading from "../common/Loading"
import SyncingStatus from "../common/SyncingStatus"
import { v4 as uuidv4 } from "uuid"
import { getDefaultContent } from "@/utils/content.util"

const slidesData: ISlide[] = []

export default function SlideManager() {
  const params = useParams()
  const [slides, setSlides] = useState<ISlide[]>(slidesData)
  const [slideLoaded, setSlideLoaded] = useState<boolean>(false)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const addSlideRef = useRef<HTMLDivElement>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from("event_content")
        .select("slides")
        .eq("event_id", params.eventId)

      if (error) {
        console.error(error)
        return
      }

      const slides = data?.[0].slides || []

      // @ts-ignore
      setSlides(slides)
      setSlideLoaded(true)
    }

    fetchSlides()
  }, [params.eventId])

  useEffect(() => {
    if (!slides || !slideLoaded) return

    const syncSlides = async () => {
      setSyncing(true)

      const { error } = await supabase
        .from("event_content")
        .update({ slides })
        .eq("event_id", params.eventId)

      setSyncing(false)

      if (error) {
        console.error(error, params.eventId)
        return
      }
    }

    syncSlides()
  }, [slides])

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

  const addNewSlide = (contentType: ContentType) => {
    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${slides.length + 1}`,
      config: {
        backgroundColor: "#fff",
      },
      content: getDefaultContent(contentType),
      contentType: contentType,
    }

    setSlides((o) => [...o, newSlide])
    setCurrentSlide(newSlide)
    setOpenContentTypePicker(false)
  }

  if (!slideLoaded)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )

  return (
    <>
      <div>
        <div
          className={clsx(
            "py-32 bg-orange-100 transition-all min-h-screen",
            miniMode ? "pl-28" : "pl-0"
          )}
        >
          <div className="flex flex-col justify-start items-center gap-20 flex-nowrap">
            {slides.map((slide, index) => (
              <Slide key={slide.id} slide={slide} index={index} />
            ))}
            <button
              className="min-w-[75%] w-[75%] p-6 -mt-6 rounded-md flex justify-center items-center gap-2 cursor-pointer bg-black text-white"
              onClick={() => setOpenContentTypePicker(true)}
            >
              <IconPlus /> <span>Add Slide</span>
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "fixed top-0 w-56 bg-white/95 h-full transition-all",
            miniMode ? "left-0" : "-left-52"
          )}
        >
          <div className="relative w-full h-full pt-16 pb-6">
            <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
              {slides.map((slide) => (
                <div
                  key={`mini-slide-${slide.id}`}
                  onClick={() => setCurrentSlide(slide)}
                  className={clsx(
                    "relative rounded-md flex-none w-full aspect-video cursor-pointer transition-all border-2 flex justify-center items-center capitalize",
                    currentSlide?.id === slide.id
                      ? "drop-shadow-md border-black"
                      : "drop-shadow-none border-black/20"
                  )}
                  style={{
                    backgroundColor: slide.config?.backgroundColor || "#166534",
                  }}
                >
                  {slide.contentType}
                </div>
              ))}

              <div
                ref={addSlideRef}
                className="relative bg-black/80 text-white rounded-md flex-none w-full aspect-video flex justify-center items-center cursor-pointer"
                onClick={() => setOpenContentTypePicker(true)}
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
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={addNewSlide}
      />
      <SyncingStatus syncing={syncing} />
    </>
  )
}
