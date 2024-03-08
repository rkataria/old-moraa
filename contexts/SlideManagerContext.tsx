import { createContext, useEffect, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { INTERACTIVE_SLIDE_TYPES } from '@/components/event-content/ContentTypePicker'
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

  const getSortedSlides = () => {
    const idIndexMap: { [id: string]: number } = {}
    meeting?.slides?.forEach((id: string, index: number) => {
      idIndexMap[id] = index
    })

    // Custom sorting function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customSort = (a: any, b: any) => idIndexMap[a.id] - idIndexMap[b.id]

    return meetingSlides?.slides?.slice().sort(customSort)
  }

  const handleSetSlides = async () => {
    if (!meetingSlides) return
    const sortedSlides = getSortedSlides()
    if (sortedSlides && sortedSlides.length > 0) {
      let filteredSlides = sortedSlides
      // check whether the user is owner of event or not
      const currentUser = await supabase.auth.getSession()
      if (currentUser.data.session?.user.id !== event.owner_id) {
        filteredSlides = sortedSlides.filter(
          (s) => !INTERACTIVE_SLIDE_TYPES.includes(s.type)
        )
        setIsOwner(false)
      }
      setSlides(filteredSlides)
      setSlideIds(filteredSlides.map((i) => i?.id) ?? [])
      setLoading(false)
      setCurrentSlide(filteredSlides?.[0])

      if (currentUser.data.session?.user.id === event.owner_id) setIsOwner(true)
    } else {
      if (slides.length > 0) {
        setLoading(false)

        return
      }

      addNewSlide(
        getDefaultCoverSlide({
          title: event.name,
          description: event.description,
        })
      )
      setLoading(false)
    }
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
    }
    setSlides((s) => [...s, { ...newSlide, id: data?.id }])
    setCurrentSlide({ ...newSlide, id: data.id })
    await updateSlideIds([...slideIds, data?.id])
    setSlideIds((s) => [...s, data?.id])
  }

  const updateSlide = async (slide: ISlide) => {
    const _slide = { ...slide }
    _slide.meeting_id = slide.meeting_id ?? meeting?.id
    await supabase.from('slide').upsert({
      id: _slide.id,
      content: _slide.content,
      config: _slide.config,
      name: _slide.name,
    })
    setCurrentSlide(_slide)
    setSlides((s) => {
      if (s.findIndex((i) => i.id === _slide.id) >= 0) {
        return s.map((sl) => (sl.id === _slide.id ? _slide : sl))
      }

      return [...s, _slide]
    })
  }

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from('slide').delete().eq('id', id)
    if (error) {
      console.error('failed to delete the slide: ', error)
    }
    const index = slides.findIndex((slide) => slide.id === id)
    const slide = slides.find((_slide) => _slide.id === id)
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
