import { createContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { useDebounce } from "@uidotdev/usehooks"
import { getDefaultCoverSlide } from "@/utils/content.util"
import { useEvent } from "@/hooks/useEvent"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface SlideManagerProviderProps {
  children: React.ReactNode
}

const SlideManagerContext = createContext<SlideManagerContextType | null>(null)

export const SlideManagerProvider = ({
  children,
}: SlideManagerProviderProps) => {
  const { eventId } = useParams()
  const { event, meeting, meetingSlides } = useEvent({
    id: eventId as string,
    fetchMeetingSlides: true,
  })
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const debouncedSlides = useDebounce(slides, 500)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!meetingSlides) return

    const slides = meetingSlides.slides ?? [
      getDefaultCoverSlide({
        title: event.name,
        description: event.description,
      }),
    ]
    setSlides(slides)
    setLoading(false)
    setCurrentSlide(slides?.[0])
  }, [meetingSlides])

  // useEffect(() => {
  //   if (debouncedSlides.length === 0) return

  //   const syncSlides = async () => {
  //     setSyncing(true)

  //     const { error } = await updateMeetingSlides({
  //       meetingSlidesId: meetingSlides.id,
  //       payload: {
  //         slides: debouncedSlides,
  //       },
  //     })

  //     setSyncing(false)

  //     if (error) {
  //       console.error(error, eventId)
  //       return
  //     }
  //   }

  //   syncSlides()
  // }, [debouncedSlides])

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

  const addNewSlide = async (slide: ISlide) => {
    const newSlide = {
      name: slide.name,
      config: slide.config,
      content: slide.content,
      type: slide.type,
      meeting_id: meeting?.id,
    }
    const { data, error } = await supabase
      .from("slide")
      .insert([newSlide])
      .select("*")
      .single()
    if (error) {
      console.error("error while creating slide: ", error)
    }
    setSlides((s) => [...s, { ...newSlide, id: data?.id }])
    setCurrentSlide({ ...newSlide, id: data.id })
  }

  const updateSlide = async (slide: ISlide) => {
    slide.meeting_id = slide.meeting_id ?? meeting?.id
    const { data, error } = await supabase
      .from("slide")
      .upsert({ id: slide.id, content: slide.content, config: slide.config })

    setSlides((s) => {
      if (s.findIndex((i) => i.id === slide.id) >= 0) {
        return s.map((s) => (s.id === slide.id ? slide : s))
      }
      return [...s, slide]
    })
  }

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from("slide").delete().eq("id", id)
    if (error) {
      console.error("failed to delete the slide: ", error)
    }
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
