import React, { useContext, useEffect, useState } from "react"
import Poll from "@/components/slides/content-types/Poll"
// @ts-ignore
import { useClickAway } from "@uidotdev/usehooks"
import clsx from "clsx"
import { BlockPicker } from "react-color"
import PollForm from "./PollForm"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import SlideManagerContext from "@/contexts/SlideManagerContext"

function PollEditor({
  slide,
  openSettings,
}: {
  slide: ISlide
  openSettings: boolean
}) {
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType
  const [showSettings, setShowSettings] = useState<boolean>(openSettings)
  const settingsRef = useClickAway(() => {
    setShowSettings(false)
  })
  const [preview, setPreview] = useState<boolean>(false)

  useEffect(() => {
    setShowSettings(openSettings)
  }, [openSettings])

  return (
    <div className={clsx("relative w-full h-full overflow-hidden")}>
      <div className="absolute right-2 bottom-2 z-10">
        <button
          className="bg-gray-800 text-white px-2 py-1 rounded-sm text-xs mr-2 cursor-pointer"
          onClick={() => setPreview((prev) => !prev)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      <div className="relative w-full h-full overflow-x-hidden overflow-y-auto scrollbar-thin">
        {preview ? <Poll slide={slide} /> : <PollForm slide={slide} />}
      </div>
      <div
        // @ts-ignore
        ref={settingsRef}
        className={clsx(
          "absolute top-0 h-full max-w-[420px] z-20 w-full bg-white transition-all overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20",
          {
            "right-0": showSettings,
            "-right-[420px]": !showSettings,
          }
        )}
      >
        <div className="px-8 py-4">
          <h3 className="text-xl font-bold mb-4">Poll Config</h3>
          <div className="relative">
            <div className="my-4">
              <label className="block mb-2 font-bold">Background Color</label>
              <BlockPicker
                color={slide.config.backgroundColor}
                onChange={(color) => {
                  updateSlide({
                    ...slide,
                    config: {
                      ...slide.config,
                      backgroundColor: color.hex,
                    },
                  })
                }}
              />
            </div>
            <div className="my-4">
              <label className="block mb-2 font-bold">Text Color</label>
              <BlockPicker
                color={slide.config.textColor}
                onChange={(color) => {
                  updateSlide({
                    ...slide,
                    config: {
                      ...slide.config,
                      textColor: color.hex,
                    },
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollEditor
