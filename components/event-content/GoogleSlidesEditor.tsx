import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import React, { useContext, useState } from "react"
import ReactGoogleSlides from "react-google-slides"
import ReactTextareaAutosize from "react-textarea-autosize"
import { Button } from "../ui/button"
import SlideManagerContext from "@/contexts/SlideManagerContext"

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

  const saveGoogleSlidesLink = () => {
    updateSlide({
      ...slide,
      content: {
        googleSlideURL: slideLink,
      },
    })
    setIsEditMode(false)
  }

  return (
    <div className="flex justify-center">
      {isEditMode ? (
        <div className="flex items-center justify-center flex-col">
          <ReactTextareaAutosize
            maxLength={300}
            placeholder="Enter Google slide URL"
            className="w-full p-2 text-center border-0 bg-transparent outline-none text-gray-400 hover:outline-none focus:ring-0 focus:border-0 text-xl resize-none"
            onChange={(e) => setSlideLink(e.target.value)}
            value={slideLink}
          />
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
