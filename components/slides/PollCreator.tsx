import React, { useEffect, useState } from "react"
import PollPreview from "@/components/PollPreview"
// @ts-ignore
import { useClickAway } from "@uidotdev/usehooks"
import clsx from "clsx"
import { BlockPicker } from "react-color"
import PollForm from "./PollForm"
import { ISlide } from "@/types/slide.type"

function PollCreator({
  slide,
  openSettings,
  sync,
}: {
  slide: ISlide
  openSettings: boolean
  sync: (data: any) => void
}) {
  const [poll, setPoll] = useState({
    question: "Who is the best YouTuber?",
    options: ["Web Dev Simplified", "Traversy Media", "Dev Ed"],
  })
  const [pollConfig, setPollConfig] = useState({
    backgroundColor: "#166534",
  })
  const [showSettings, setShowSettings] = useState<boolean>(openSettings)
  const settingsRef = useClickAway(() => {
    setShowSettings(false)
  })
  const [preview, setPreview] = useState<boolean>(false)

  useEffect(() => {
    sync({
      ...slide,
      config: {
        ...slide.config,
        ...pollConfig,
      },
      content: {
        ...slide.content,
        ...poll,
      },
    })
  }, [poll, pollConfig])

  useEffect(() => {
    setShowSettings(openSettings)
  }, [openSettings])

  const handlePollChange = (poll: any) => {
    setPoll((prev) => ({ ...prev, ...poll }))
  }

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
        {preview ? (
          <PollPreview {...poll} config={pollConfig} />
        ) : (
          <PollForm
            question={poll.question}
            options={poll.options}
            onChangePoll={handlePollChange}
          />
        )}
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
                color={pollConfig.backgroundColor}
                onChange={(color) => {
                  setPollConfig((prev: any) => ({
                    ...prev,
                    slideBackgroundColor: color.hex,
                  }))
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollCreator
