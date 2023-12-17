import { createContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { useDebounce } from "@uidotdev/usehooks"
import { getDefaultCoverSlide } from "@/utils/content.util"
import { useEvent } from "@/hooks/useEvent"

interface SlideManagerProviderProps {
  children: React.ReactNode
}

const SlideManagerContext = createContext<SlideManagerContextType | null>(null)

export const SlideManagerProvider = ({
  children,
}: SlideManagerProviderProps) => {
  const { eventId } = useParams()
  const { event, eventContent, updateEventContent } = useEvent({
    id: eventId as string,
    fetchEventContent: true,
  })
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const debouncedSlides = useDebounce(slides, 500)

  useEffect(() => {
    if (!eventContent) return

    const slides = eventContent.slides ?? [
      getDefaultCoverSlide({
        title: event.name,
        description: event.description,
      }),
    ]

    setSlides(slides)
    setLoading(false)
    setCurrentSlide(slides?.[0])
  }, [eventContent])

  useEffect(() => {
    if (debouncedSlides.length === 0) return

    const syncSlides = async () => {
      setSyncing(true)

      const { error } = await updateEventContent({
        eventContentId: eventContent.id,
        payload: {
          slides: debouncedSlides,
        },
      })

      setSyncing(false)

      if (error) {
        console.error(error, eventId)
        return
      }
    }

    syncSlides()
  }, [debouncedSlides])

  useEffect(() => {
    if (!currentSlide) return

    const currentSlideElement = document.querySelector(
      `div[data-minislide-id="${currentSlide.id}"]`
    )

    if (!currentSlideElement) return

    currentSlideElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    })
  }, [currentSlide])

  const addNewSlide = (slide: ISlide) => {
    setSlides((s) => [...s, slide])
  }

  const updateSlide = (slide: ISlide) => {
    setSlides((s) => s.map((s) => (s.id === slide.id ? slide : s)))
  }

  const deleteSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)

    setSlides((s) => s.filter((slide) => slide.id !== id))

    if (currentSlide?.id === id) {
      if (index !== slides.length - 1) {
        setCurrentSlide(slides[index + 1])
      } else
        setCurrentSlide(
          slides.length > 1 ? slides[slides.length - 2] : slides[0]
        )
    }
  }

  const moveUpSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)

    if (index === 0) return

    const newSlides = [...slides]
    const temp = newSlides[index - 1]
    newSlides[index - 1] = newSlides[index]
    newSlides[index] = temp

    setSlides(newSlides)
  }

  const moveDownSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)

    if (index === slides.length - 1) return

    const newSlides = [...slides]
    const temp = newSlides[index + 1]
    newSlides[index + 1] = newSlides[index]
    newSlides[index] = temp

    setSlides(newSlides)
  }

  return (
    <SlideManagerContext.Provider
      value={{
        slides,
        currentSlide,
        loading,
        syncing,
        miniMode,
        setMiniMode,
        setCurrentSlide,
        addNewSlide,
        updateSlide,
        deleteSlide,
        moveUpSlide,
        moveDownSlide,
      }}
    >
      {children}
    </SlideManagerContext.Provider>
  )
}

export default SlideManagerContext
