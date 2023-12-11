import { createContext, useEffect, useState } from "react"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useDebounce } from "@uidotdev/usehooks"
import { getDefaultCoverSlide } from "@/utils/content.util"

interface SlideManagerProviderProps {
  children: React.ReactNode
}

const SlideManagerContext = createContext<SlideManagerContextType | null>(null)

export const SlideManagerProvider = ({
  children,
}: SlideManagerProviderProps) => {
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const debouncedSlides = useDebounce(slides, 500)

  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("id", params.eventId)

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setEvent(data[0])
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEvent()
  }, [params.eventId])

  useEffect(() => {
    if (!event?.id) return

    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from("event_content")
        .select("*")
        .eq("event_id", event.id)

      if (error) {
        console.error(error)
        return
      }

      const eventContent = data?.[0]

      const slides = eventContent.slides ?? [
        getDefaultCoverSlide({
          title: event.name,
          description: event.description,
        }),
      ]

      // @ts-ignore
      setSlides(slides)
      setLoading(true)
      setCurrentSlide(slides?.[0])
    }

    fetchSlides()
  }, [event?.id])

  useEffect(() => {
    if (debouncedSlides.length === 0) return

    const syncSlides = async () => {
      setSyncing(true)

      const { error } = await supabase
        .from("event_content")
        .update({ slides: debouncedSlides })
        .eq("event_id", params.eventId)

      setSyncing(false)

      if (error) {
        console.error(error, params.eventId)
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
