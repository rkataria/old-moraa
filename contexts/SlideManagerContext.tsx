import { createContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { useDebounce } from "@uidotdev/usehooks"
import { getDefaultCoverSlide } from "@/utils/content.util"
import { useEvent } from "@/hooks/useEvent"
import { deletePDFFile } from "@/services/pdf.service"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  ContentType,
  INTERACTIVE_SLIDE_TYPES,
} from "@/components/event-content/ContentTypePicker"

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
  const [slideIds, setSlideIds] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const debouncedSlides = useDebounce(slides, 500)
  const supabase = createClientComponentClient()

  useEffect(() => {
    handleSetSlides()
  }, [meetingSlides])

  useEffect(() => {
    updateSlideIds()
  }, [slideIds])

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

  const getSortedSlides = () => {
    const idIndexMap: { [id: string]: number } = {}
    meeting?.slides?.forEach((id: string, index: number) => {
      idIndexMap[id] = index
    })

    // Custom sorting function
    const customSort = (a: any, b: any) => {
      return idIndexMap[a.id] - idIndexMap[b.id]
    }

    return meetingSlides?.slides?.slice().sort(customSort)
  }

  const handleSetSlides = async () => {
    if (!meetingSlides) return
    const sortedSlides = getSortedSlides()
    const slides =
      sortedSlides && sortedSlides.length > 0
        ? sortedSlides
        : [
            // getDefaultCoverSlide({
            //   title: event.name,
            //   description: event.description,
            // }),
          ]
    setSlideIds(meeting?.slides ?? [])
    let filteredSlides = slides
    // check whether the user is owner of event or not
    const currentUser = await supabase.auth.getSession()
    if (currentUser.data.session?.user.id !== event.owner_id) {
      filteredSlides = slides.filter(
        (s) => !INTERACTIVE_SLIDE_TYPES.includes(s.type)
      )
      setIsOwner(false)
    }
    setSlides(filteredSlides)
    setLoading(false)
    setCurrentSlide(filteredSlides?.[0])
  }

  const updateSlideIds = async () => {
    if (!meeting?.id) {
      console.warn("meeting.id is missing")
    }

    const { data, error } = await supabase
      .from("meeting")
      .update({ slides: slideIds })
      .eq("id", meeting?.id)
    if (error) {
      console.error("error while updating slide ids on meeting,error: ", error)
      return
    }
  }

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
    setSlideIds((s) => [...s, data?.id])
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
    const slide = slides.find((slide) => slide.id === id)
    if (slide?.content?.pdfPath) {
      deletePDFFile(slide?.content?.pdfPath)
    }

    const updatedSlides = slides.filter((slide) => slide.id !== id)
    setSlides(updatedSlides)
    setSlideIds((s) => s.filter((slideId) => slideId !== id))

    if (currentSlide?.id === id) {
      if (index !== updatedSlides.length) {
        setCurrentSlide(updatedSlides[index])
        return
      }
      if (updatedSlides.length > 0) {
        setCurrentSlide(updatedSlides[index - 1])
        return
      }
      setCurrentSlide(
        getDefaultCoverSlide({
          title: event.name,
          description: event.description,
        })
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

    // Reorder the slideIds
    const idIndex = slideIds.findIndex((i) => i === id)
    if (idIndex === 0) return
    const newIds = [...slideIds]
    const tempId = newIds[index - 1]
    newIds[index - 1] = newIds[index]
    newIds[index] = tempId
    setSlideIds(newIds)
  }

  const moveDownSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)

    if (index === slides.length - 1) return

    const newSlides = [...slides]
    const temp = newSlides[index + 1]
    newSlides[index + 1] = newSlides[index]
    newSlides[index] = temp

    setSlides(newSlides)

    // Reorder the slideIds
    const idIndex = slideIds.findIndex((i) => i === id)
    if (idIndex === 0) return
    const newIds = [...slideIds]
    const tempId = newIds[index + 1]
    newIds[index + 1] = newIds[index]
    newIds[index] = tempId
    setSlideIds(newIds)
  }

  return (
    <SlideManagerContext.Provider
      value={{
        slides,
        currentSlide,
        loading,
        syncing,
        miniMode,
        isOwner,
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
