"use client"
import { useContext, useRef, useState } from "react"
import clsx from "clsx"
import Slide from "./Slide"
import ContentTypePicker, { ContentType } from "./ContentTypePicker"
import Loading from "../common/Loading"
import SyncingStatus from "../common/SyncingStatus"
import SlideManagerContext from "@/contexts/SlideManagerContext"
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
    addNewSlide,
    deleteSlide,
    moveUpSlide,
    moveDownSlide,
    updateSlide,
  } = useContext(SlideManagerContext) as SlideManagerContextType
  const addSlideRef = useRef<HTMLDivElement>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const handleAddNewSlide = (contentType: ContentType) => {
    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${slides.length + 1}`,
      config: {
        backgroundColor: "#fff",
        textColor: "#000",
      },
      content: getDefaultContent(contentType),
      contentType: contentType,
    }

    addNewSlide(newSlide)
    setOpenContentTypePicker(false)
    setCurrentSlide(newSlide)
  }

  if (loading)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )

  return (
    <div className="w-full">
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
      </div>
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={handleAddNewSlide}
      />
      <SyncingStatus syncing={syncing} />
    </div>
  )
}
