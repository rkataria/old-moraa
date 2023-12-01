"use client"
import { useEffect, useRef, useState } from "react"
import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { IconArrowLeft, IconPlus } from "@tabler/icons-react"
import clsx from "clsx"
import Slide, { ISlide } from "./Slide"
import ContentTypePicker, { ContentType } from "./ContentTypePicker"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import Loading from "../common/Loading"
import SyncingStatus from "../common/SyncingStatus"
import { v4 as uuidv4 } from "uuid"
import { getDefaultContent } from "@/utils/content.util"
import Link from "next/link"

const slidesData: ISlide[] = []

export default function SlideManager({ event }: any) {
  const params = useParams()
  const [slides, setSlides] = useState<ISlide[]>(slidesData)
  const [slideLoaded, setSlideLoaded] = useState<boolean>(false)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<ISlide>(slidesData[0])
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
            "relative bg-orange-100 transition-all w-full h-screen flex justify-center items-center",
            {
              "p-8 pl-80": miniMode,
              "p-24": !miniMode,
            }
          )}
        >
          <div className="relative bg-red-500 w-full aspect-video rounded-md">
            {currentSlide && (
              <Slide slide={currentSlide} index={1} onDelete={() => {}} />
            )}
          </div>
        </div>
        <div
          className={clsx(
            "fixed top-0 w-72 bg-white/95 h-full transition-all",
            miniMode ? "left-0" : "-left-64"
          )}
        >
          <div className="px-6 py-2 mt-6 flex justify-start items-start gap-2">
            <Link href="/events">
              <IconArrowLeft size={20} />
            </Link>
            <span className="font-bold">{event.name}</span>
          </div>
          <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
            {slides.map((slide, index) => (
              <div
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
                  {slide.contentType}
                </div>
              </div>
            ))}
            <div className="flex justify-start items-center gap-2 w-full">
              <span className="w-5"></span>
              <div
                ref={addSlideRef}
                onClick={() => setOpenContentTypePicker(true)}
                className={clsx(
                  "relative rounded-md flex-auto w-full h-12 cursor-pointer transition-all border-2 flex justify-center items-center bg-black/80 text-white"
                )}
              >
                New Slide
              </div>
            </div>
            <button
              className="absolute -right-8 top-1 cursor-pointer w-8 h-8 p-2 text-white bg-black/50 rounded-sm rounded-b-none"
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
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={addNewSlide}
      />
      <SyncingStatus syncing={syncing} />
    </>
  )
}
