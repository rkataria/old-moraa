'use client'

import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { ContentTypePicker, ContentType } from './ContentTypePicker'
import { Header } from './Header'
import { MiniSlideManager } from './MiniSlideManager'
import { SettingsSidebar } from './SettingsSidebar'
import { Slide } from './Slide'
import { Loading } from '../common/Loading'
import { SyncingStatus } from '../common/SyncingStatus'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { SlideStatus } from '@/services/types/enums'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { getDefaultContent } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function SlideManager() {
  const { eventId } = useParams()
  const {
    event,
    isLoading: eventLoading,
    meetingSlides,
  } = useEvent({
    id: eventId as string,
    fetchMeetingSlides: true,
  })
  const [leftSidebarVisible, setLeftSidebarVisible] = useState<boolean>(true)
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(false)

  const { currentUser } = useAuth()
  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])

  const {
    slides,
    loading,
    syncing,
    currentSlide,
    setCurrentSlide,
    addNewSlide,
    reorderSlide,
  } = useContext(SlideManagerContext) as SlideManagerContextType
  const addSlideRef = useRef<HTMLDivElement>(null)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  useEffect(() => {
    setRightSidebarVisible(false)
  }, [currentSlide?.id])

  const getSettingsEnabled = () => {
    if (!currentSlide) return false
    if (!isOwner) return false

    return [
      ContentType.POLL,
      ContentType.COVER,
      ContentType.REFLECTION,
      ContentType.TEXT_IMAGE,
    ].includes(currentSlide.type)
  }

  const settingsEnabled = getSettingsEnabled()

  const handleAddNewSlide = (contentType: ContentType) => {
    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${slides.length + 1}`,
      config: {
        backgroundColor: '#fff',
        textColor: '#000',
        allowVoteOnMultipleOptions: false,
      },
      // TODO: Fix any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: getDefaultContent(contentType) as any,
      type: contentType,
      status: SlideStatus.PUBLISHED,
    }

    addNewSlide(newSlide)
    setOpenContentTypePicker(false)
  }

  if (eventLoading || loading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  const renderSlide = () => {
    if (slides.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-50">
          <p className="text-2xl font-semibold">Add a slide to get started</p>
        </div>
      )
    }

    if (!currentSlide) {
      return null
    }

    return (
      <Slide
        isOwner={isOwner}
        slide={currentSlide}
        settingsEnabled={settingsEnabled}
        setSettingsSidebarVisible={setRightSidebarVisible}
      />
    )
  }

  return (
    <SlideManagerLayoutRoot>
      <SlideManagerHeader>
        <Header
          event={event}
          leftSidebarVisible={leftSidebarVisible}
          onLeftSidebarToggle={setLeftSidebarVisible}
          isSlidePublished={
            meetingSlides?.slides?.some(
              (slide) => slide.status === SlideStatus.PUBLISHED
            ) || false
          }
        />
      </SlideManagerHeader>
      <div className="flex flex-auto w-full">
        <SlideManagerLeftSidebarWrapper visible={leftSidebarVisible}>
          <MiniSlideManager
            mode={isOwner ? 'edit' : 'read'}
            slides={slides}
            addSlideRef={addSlideRef}
            currentSlide={currentSlide}
            setOpenContentTypePicker={setOpenContentTypePicker}
            setCurrentSlide={setCurrentSlide}
            reorderSlide={reorderSlide}
          />
        </SlideManagerLeftSidebarWrapper>
        <div className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto">
          {renderSlide()}
        </div>
        <SlideManagerRightSidebarWrapper visible={rightSidebarVisible}>
          {currentSlide ? (
            <SettingsSidebar
              settingsEnabled={settingsEnabled}
              setSettingsSidebarVisible={setRightSidebarVisible}
            />
          ) : null}
        </SlideManagerRightSidebarWrapper>
      </div>
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={handleAddNewSlide}
      />
      <SyncingStatus syncing={syncing} />
    </SlideManagerLayoutRoot>
  )
}

export function SlideManagerLayoutRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col w-full h-screen max-h-screen bg-gray-900 overflow-hidden'
      )}
      style={{
        backgroundColor: 'var(--slide-bg-color)',
      }}>
      {children}
    </div>
  )
}

export function SlideManagerHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sticky left-0 top-0 h-16 flex-none w-full z-10">
      {children}
    </div>
  )
}

export function SlideManagerLeftSidebarWrapper({
  children,
  visible,
}: {
  children: React.ReactNode
  visible: boolean
}) {
  return (
    <div
      className={cn(
        'flex-none transition-all duration-300 ease-in-out max-h-[calc(100vh_-_64px)]',
        {
          'w-0': !visible,
          'w-72': visible,
        }
      )}>
      {children}
    </div>
  )
}

export function SlideManagerRightSidebarWrapper({
  children,
  visible,
}: {
  children: React.ReactNode
  visible: boolean
}) {
  return (
    <div
      className={cn(
        'flex-none transition-all duration-300 ease-in-out overflow-hidden max-h-[calc(100vh_-_64px)]',
        {
          'w-72': visible,
          'w-0': !visible,
        }
      )}>
      {children}
    </div>
  )
}
