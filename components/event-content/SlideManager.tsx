'use client'

import { useContext, useMemo, useRef, useState } from 'react'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { ContentTypePicker, ContentType } from './ContentTypePicker'
import { MiniSlideManager } from './MiniSlideManager'
import { Slide } from './Slide'
import { Loading } from '../common/Loading'
import { SyncingStatus } from '../common/SyncingStatus'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { getDefaultContent } from '@/utils/content.util'

export function SlideManager() {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })

  const { currentUser } = useAuth()
  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])

  const {
    slides,
    loading,
    syncing,
    miniMode,
    currentSlide,
    setCurrentSlide,
    setMiniMode,
    addNewSlide,
    reorderSlide,
  } = useContext(SlideManagerContext) as SlideManagerContextType
  const addSlideRef = useRef<HTMLDivElement>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const handleAddNewSlide = (contentType: ContentType) => {
    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${slides.length + 1}`,
      config: {
        backgroundColor: '#fff',
        textColor: '#000',
      },
      content: getDefaultContent(contentType),
      type: contentType,
    }

    addNewSlide(newSlide)
    setOpenContentTypePicker(false)
  }

  if (loading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div>
        <div
          className={clsx(
            'relative bg-white transition-all w-full h-screen flex justify-center items-center',
            {
              'p-8 pl-80': miniMode,
              'p-24': !miniMode,
            }
          )}>
          <div
            className={clsx('relative aspect-video rounded-md bg-white mt-16', {
              'w-full': miniMode,
              'w-[90%]': !miniMode,
              'flex justify-center items-center border-2 border-black/10':
                !currentSlide,
            })}>
            {currentSlide ? (
              <Slide
                key={`slide-${currentSlide.id}`}
                slide={currentSlide}
                isOwner={isOwner}
              />
            ) : (
              <div>Add a slide to continue</div>
            )}
          </div>
        </div>
        <MiniSlideManager
          mode={isOwner ? 'edit' : 'read'}
          slides={slides}
          addSlideRef={addSlideRef}
          currentSlide={currentSlide}
          setOpenContentTypePicker={setOpenContentTypePicker}
          setCurrentSlide={setCurrentSlide}
          onMiniModeChange={setMiniMode}
          reorderSlide={reorderSlide}
        />
      </div>
      (
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={handleAddNewSlide}
      />
      )
      <SyncingStatus syncing={syncing} />
    </div>
  )
}
