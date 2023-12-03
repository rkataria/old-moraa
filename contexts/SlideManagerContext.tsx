import { createContext, useEffect, useState } from "react"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { useDebounce } from "@uidotdev/usehooks"

interface SlideManagerProviderProps {
  children: React.ReactNode
}

export const SlideManagerContext =
  createContext<SlideManagerContextType | null>(null)

const SlideManagerProvider = ({ children }: SlideManagerProviderProps) => {
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const debouncedSlides = useDebounce(slides, 300)

  const params = useParams()
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

      console.log("slides fetched", slides)

      // @ts-ignore
      setSlides(slides)
      setLoading(true)
      setCurrentSlide(slides?.[0])
    }

    fetchSlides()
  }, [params.eventId])

  useEffect(() => {
    console.log("slides", debouncedSlides, loading)

    if (!debouncedSlides || !loading) return

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

  const addSlide = (slide: ISlide) => {
    setSlides((s) => [...s, slide])
  }

  const updateSlide = (slide: ISlide) => {
    console.log("updating slide", slide)
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
        addSlide,
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

export default SlideManagerProvider
