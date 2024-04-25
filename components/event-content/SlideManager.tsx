'use client'

import { useContext, useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { Header } from './Header'
import { SettingsSidebar } from './SettingsSidebar'
import { Slide } from './Slide'
import { Loading } from '../common/Loading'
import { SlideControls } from '../common/SlideControls'
import { SyncingStatus } from '../common/SyncingStatus'
import { FlyingEmojisOverlay } from '../event-session/FlyingEmojisOverlay'

import { AgendaPanel } from '@/components/common/AgendaPanel'
import {
  ContentTypePicker,
  ContentType,
} from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { SlideStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { getDefaultContent } from '@/utils/content.util'
import { cn, getSlideCount } from '@/utils/utils'

export function SlideManager() {
  const { eventId } = useParams()
  const { event, isLoading: eventLoading } = useEvent({
    id: eventId as string,
  })
  const [leftSidebarVisible, setLeftSidebarVisible] = useState<boolean>(true)
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(false)

  const { currentUser } = useAuth()
  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])

  const {
    preview,
    loading,
    syncing,
    currentSlide,
    sections,
    insertAfterSlideId,
    insertInSectionId,
    addSlideToSection,
  } = useContext(EventContext) as EventContextType
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
      ContentType.MORAA_BOARD,
    ].includes(currentSlide.type)
  }

  const settingsEnabled = getSettingsEnabled()

  const handleAddNewSlide = (contentType: ContentType) => {
    const insertInSection = sections.find((s) => s.id === insertInSectionId)

    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${(insertInSection?.slides?.length || 0) + 1}`,
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

    addSlideToSection({
      slide: newSlide,
      section: insertInSection,
      afterSlideId: insertAfterSlideId!,
    })
    setOpenContentTypePicker(false)
  }

  if (eventLoading || loading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  const getIsSlidePublished = () => {
    const allSlides = sections.flatMap((s) => s.slides)

    return allSlides.some((slide) => slide.status === SlideStatus.PUBLISHED)
  }

  const renderSlide = () => {
    const slideCount = getSlideCount(sections)

    if (slideCount === 0) {
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
      <>
        <Slide
          isOwner={isOwner}
          slide={currentSlide}
          settingsEnabled={settingsEnabled}
          setSettingsSidebarVisible={setRightSidebarVisible}
        />
        {preview && <SlideControls />}
      </>
    )
  }

  return (
    <SlideManagerLayoutRoot>
      <SlideManagerHeader>
        <Header
          event={event}
          leftSidebarVisible={leftSidebarVisible}
          onLeftSidebarToggle={setLeftSidebarVisible}
          isSlidePublished={getIsSlidePublished()}
        />
      </SlideManagerHeader>
      <div className="flex flex-auto w-full">
        <SlideManagerLeftSidebarWrapper visible={leftSidebarVisible}>
          <AgendaPanel setOpenContentTypePicker={setOpenContentTypePicker} />
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
      <FlyingEmojisOverlay />
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

export function SlideManagerBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-auto w-full h-[calc(100vh_-_64px)]">
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
