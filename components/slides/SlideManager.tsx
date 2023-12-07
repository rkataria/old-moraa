"use client"
import { useContext, useRef, useState } from "react"
import { IconArrowBarLeft, IconArrowBarRight } from "@tabler/icons-react"
import clsx from "clsx"
import Slide from "./Slide"
import ContentTypePicker, { ContentType } from "./ContentTypePicker"
import Loading from "../common/Loading"
import SyncingStatus from "../common/SyncingStatus"
import { SlideManagerContext } from "@/contexts/SlideManagerContext"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { getDefaultContent } from "@/utils/content.util"
import { v4 as uuidv4 } from "uuid"
import MiniSlideManager from "./MiniSlideManager"

export default function SlideManager({}: any) {
  const {
    slides,
    loading,
    syncing,
    miniMode,
    currentSlide,
    setCurrentSlide,
    setMiniMode,
    addSlide,
    deleteSlide,
    moveUpSlide,
    moveDownSlide,
    updateSlide,
  } = useContext(SlideManagerContext) as SlideManagerContextType
  const addSlideRef = useRef<HTMLDivElement>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

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

    addSlide(newSlide)
    setOpenContentTypePicker(false)
    setCurrentSlide(newSlide)
  }

  if (!loading)
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
            "relative bg-gray-100 transition-all w-full h-screen flex justify-center items-center",
            {
              "p-8 pl-80": miniMode,
              "p-24": !miniMode,
            }
          )}
        >
          <div
            className={clsx("relative aspect-video rounded-md bg-white mt-16", {
              "w-full": miniMode,
              "w-[90%]": !miniMode,
              "flex justify-center items-center border-2 border-black/10":
                !currentSlide,
            })}
          >
            {currentSlide ? (
              <Slide
                key={`slide-${currentSlide.id}`}
                slide={currentSlide}
                deleteSlide={deleteSlide}
                moveUpSlide={moveUpSlide}
                moveDownSlide={moveDownSlide}
                updateSlide={updateSlide}
              />
            ) : (
              <div>Add a slide to continue</div>
            )}
          </div>
        </div>
        <MiniSlideManager
          slides={slides}
          addSlideRef={addSlideRef}
          currentSlide={currentSlide}
          setOpenContentTypePicker={setOpenContentTypePicker}
          setCurrentSlide={setCurrentSlide}
          onMiniModeChange={setMiniMode}
        />
        {/* <div
          className={clsx(
            "fixed top-0 w-72 bg-white/95 h-full transition-all pt-16 pb-4",
            miniMode ? "left-0" : "-left-64"
          )}
        >
          <div className="flex flex-col justify-start items-center gap-4 h-full w-full pt-4 px-6 flex-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent overflow-y-scroll">
            {slides.map((slide, index) => (
              <div
                data-minislide-id={slide.id}
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
              className="absolute right-0 top-16 flex justify-center items-center cursor-pointer w-8 h-8 text-black rounded-sm rounded-b-none"
              onClick={() => {
                setMiniMode(!miniMode)
              }}
            >
              {miniMode ? (
                <IconArrowBarLeft size={20} />
              ) : (
                <IconArrowBarRight size={20} />
              )}
            </button>
          </div>
        </div> */}
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
