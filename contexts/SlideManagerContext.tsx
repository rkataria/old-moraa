import { createContext, useEffect, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { INTERACTIVE_SLIDE_TYPES } from '@/components/event-content/ContentTypePicker'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { deletePDFFile } from '@/services/pdf.service'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { getDefaultCoverSlide } from '@/utils/content.util'

interface SlideManagerProviderProps {
  children: React.ReactNode
}

export const SlideManagerContext =
  createContext<SlideManagerContextType | null>(null)

export function SlideManagerProvider({ children }: SlideManagerProviderProps) {
  const { eventId } = useParams()
  const { event, meeting, meetingSlides } = useEvent({
    id: eventId as string,
    fetchMeetingSlides: true,
  })
  const { currentUser } = useAuth()
  const [slides, setSlides] = useState<ISlide[]>([])
  const [slideIds, setSlideIds] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [miniMode, setMiniMode] = useState<boolean>(true)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    handleSetSlides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingSlides])

  useEffect(() => {
    if (!currentSlide) return

    const currentSlideElement = document.querySelector(
      `div[data-minislide-id="${currentSlide.id}"]`
    )

    if (!currentSlideElement) return

    currentSlideElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [currentSlide])

  const handleSetSlides = async () => {
    if (!meetingSlides) return

    const meetingSlidesWithContent: ISlide[] = meeting?.slides?.map(
      (slide: ISlide) => meetingSlides?.slides?.find((s) => s.id === slide)
    )

    if (!meetingSlidesWithContent || meetingSlidesWithContent.length === 0) {
      const firstSlide = getDefaultCoverSlide({
        name: event.name,
        title: event.name,
        description: event.description,
      }) as ISlide

      await addNewSlide(firstSlide)
      setLoading(false)

      return
    }

    if (currentUser.id === event.owner_id) {
      setIsOwner(true)
      setSlides(meetingSlidesWithContent)
      setSlideIds(meeting?.slides ?? [])
      setCurrentSlide(meetingSlidesWithContent[0])
      setLoading(false)

      return
    }

    const nonInteractiveSlides = meetingSlidesWithContent.filter(
      (s) => !INTERACTIVE_SLIDE_TYPES.includes(s.type)
    )
    setSlides(nonInteractiveSlides)
    setSlideIds(nonInteractiveSlides.map((slide) => slide?.id) ?? [])
    setLoading(false)
    setCurrentSlide(nonInteractiveSlides[0])
  }

  const updateSlideIds = async (ids: string[]) => {
    if (!meeting?.id) {
      console.warn('meeting.id is missing')
    }

    const { error } = await supabase
      .from('meeting')
      .update({ slides: ids })
      .eq('id', meeting?.id)
    if (error) {
      console.error('error while updating slide ids on meeting,error: ', error)
    }
  }

  // TODO: These queries should be moved to transaction when supabase supports it
  const addNewSlide = async (slide: ISlide) => {
    const newSlide = {
      name: slide.name,
      config: slide.config,
      content: slide.content,
      type: slide.type,
      meeting_id: meeting?.id,
    }
    const { data, error } = await supabase
      .from('slide')
      .insert([newSlide])
      .select('*')
      .single()

    if (error) {
      console.error('error while creating slide: ', error)

      return
    }

    await updateSlideIds([...slideIds, data?.id])

    setSlides((s) => [...s, { ...newSlide, id: data?.id }])
    setCurrentSlide({ ...newSlide, id: data.id })
    setSlideIds((s) => [...s, data?.id])
  }

  const updateSlide = async (slide: Partial<ISlide>) => {
    if (isSlideChanged(slide)) {
      setSyncing(true)
      const { data, error } = await supabase
        .from('slide')
        .upsert({
          id: slide.id,
          content: slide.content,
          config: slide.config,
          name: slide.name,
        })
        .select('*')
        .single()

      if (error) {
        console.error('error while updating slide: ', error)

        return
      }

      setCurrentSlide(data)
      setSlides((_slides) => _slides.map((s) => (s.id === data?.id ? data : s)))
      setSyncing(false)
    }
  }

  const isSlideChanged = (slide: Partial<ISlide>) => {
    const _slide = slides.find((s) => s.id === slide.id)
    if (!_slide) return false
    if (JSON.stringify(_slide) !== JSON.stringify(slide)) return true

    return false
  }

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from('slide').delete().eq('id', id)
    if (error) {
      console.error('failed to delete the slide: ', error)
    }
    const index = slides.findIndex((slide) => slide.id === id)
    // TODO: Implement block pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slide: any = slides.find((_slide) => _slide.id === id)
    if (slide?.content?.pdfPath) {
      deletePDFFile(slide?.content?.pdfPath)
    }

    const updatedSlides = slides.filter((_slide) => _slide.id !== id)
    setSlides(updatedSlides)
    setSlides((s) => s.filter((_slide) => _slide.id !== id))
    await updateSlideIds(slideIds.filter((slideId) => slideId !== id))
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
      setCurrentSlide(null)
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
    updateSlideIds(newIds)
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

  const reorder = (list: ISlide[], startIndex: number, endIndex: number) => {
    const result = list
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderSlide = async (result: OnDragEndResponder | any) => {
    if (!result.destination) {
      return
    }
    const items = reorder(slides, result.source.index, result.destination.index)
    setSlides(items)
    setSyncing(true)
    await updateSlideIds(items.map((i) => i.id))
    setSyncing(false)
  }

  return (
    <SlideManagerContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
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
        reorderSlide,
      }}>
      {children}
    </SlideManagerContext.Provider>
  )
}
