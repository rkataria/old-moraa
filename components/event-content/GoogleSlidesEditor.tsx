"use client"

import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import React, { useContext, useState } from "react"
import ReactGoogleSlides from "react-google-slides"
import { Button } from "../ui/button"
import SlideManagerContext from "@/contexts/SlideManagerContext"
import { useHotkeys } from "@/hooks/useHotkeys"
import { Input } from "../ui/input"

interface GoogleSlidesEditorProps {
  slide: ISlide
}

export default function GoogleSlidesEditor({ slide }: GoogleSlidesEditorProps) {
  const [slideLink, setSlideLink] = useState(slide.content.googleSlideURL || "")
  const [position, setPosition] = useState<number>(slide.content.position || 1)
  const [isEditMode, setIsEditMode] = useState(!slide.content.googleSlideURL)
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType
  useHotkeys("ArrowLeft", () => {
    setPosition((pos) => (pos > 1 ? pos - 1 : pos))
  })
  useHotkeys("ArrowRight", () => {
    setPosition((pos) => pos + 1)
  })

  const saveGoogleSlidesLink = () => {
    updateSlide({
      ...slide,
      content: {
        googleSlideURL: slideLink,
        startPosition: position
      },
    })
    setIsEditMode(false)
  }

  return (
    <div className="flex justify-center">
      {isEditMode ? (
        <div className="flex items-center justify-center flex-col mt-4">
          <div>
            <label>Google slide URL</label>
            <Input
              className="w-96 outline-none mb-4"
              placeholder="Enter Google slide URL"
              onChange={(e) => setSlideLink(e.target.value)}
              value={slideLink}
            />
          </div>
          <div>
            <label>Presentation start position</label>
            <Input
              className="w-96 outline-none mb-4"
              placeholder="Presentation start position"
              value={position}
              onChange={(e) =>
                setPosition(
                  isNaN(Number(e.target.value)) ? position : Number(e.target.value)
                )
              }
            />
          </div>
          <Button className="mt-4" onClick={saveGoogleSlidesLink}>
            Embed Slides
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="py-4">
            <ReactGoogleSlides
              width={640}
              height={480}
              slidesLink={slideLink}
              position={position}
            />
          </div>
          <div className="flex mb-4 mt-2">
            <Button
              onClick={() => setPosition((pos) => (pos > 1 ? pos - 1 : pos))}
              variant="secondary"
              disabled={position === 1}
              className="mx-2"
            >
              Prev
            </Button>
            <Button
              onClick={() => setPosition((pos) => pos + 1)}
              variant="secondary"
              className="mx-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
