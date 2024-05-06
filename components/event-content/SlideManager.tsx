/* eslint-disable react/button-has-type */
import { Fragment, useContext, useMemo, useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { Header } from './Header'
import { SettingsSidebar } from './SettingsSidebar'
import { Slide } from './Slide'
import { AgendaPanel } from '../common/AgendaPanel'
import { AIChat } from '../common/AIChat'
import { Loading } from '../common/Loading'
import { SlideControls } from '../common/SlideControls'
import { SyncingStatus } from '../common/SyncingStatus'
import { FlyingEmojisOverlay } from '../event-session/FlyingEmojisOverlay'

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
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(true)
  const [aiChatOverlay, setAiChatOverlay] = useState<boolean>(false)

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

  // useEffect(() => {
  //   setRightSidebarVisible(false)
  // }, [currentSlide?.id])

  const getSettingsEnabled = () => {
    if (!currentSlide) return false
    if (!isOwner) return false

    return true
  }

  const settingsEnabled = getSettingsEnabled()

  const handleAddNewSlide = (contentType: ContentType) => {
    const insertInSection = sections.find((s) => s.id === insertInSectionId)

    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${(insertInSection?.slides?.length || 0) + 1}`,
      config: {
        textColor: '#000',
        allowVoteOnMultipleOptions: false,
        showTitle: true,
        showDescription: [ContentType.COVER, ContentType.TEXT_IMAGE].includes(
          contentType
        ),
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

  // const getIsSlidePublished = () => {
  //   const allSlides = sections.flatMap((s) => s.slides)

  //   return allSlides.some((slide) => slide.status === SlideStatus.PUBLISHED)
  // }

  const renderRightSidebar = () => {
    if (aiChatOverlay) {
      return <AIChat />
    }
    if (currentSlide) {
      return (
        <SettingsSidebar
          settingsEnabled={settingsEnabled}
          setSettingsSidebarVisible={setRightSidebarVisible}
        />
      )
    }

    return null
  }

  const renderSlide = () => {
    const slideCount = getSlideCount(sections)

    if (slideCount === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-2xl font-semibold">Add a slide to get started</p>
        </div>
      )
    }

    if (!currentSlide) {
      return null
    }

    return (
      <Fragment key={currentSlide.id}>
        <Slide
          isOwner={isOwner}
          slide={currentSlide}
          settingsEnabled={settingsEnabled}
          setSettingsSidebarVisible={() => {
            setAiChatOverlay(false)
            setRightSidebarVisible(true)
          }}
        />
        {preview && <SlideControls />}
      </Fragment>
    )
  }

  return (
    <SlideManagerLayoutRoot>
      <SlideManagerHeader>
        <Header
          event={event}
          onAiChatOverlayToggle={() => {
            if (aiChatOverlay) {
              setAiChatOverlay(false)
              setRightSidebarVisible(false)
            } else {
              setAiChatOverlay(true)
              setRightSidebarVisible(true)
            }
          }}
        />
      </SlideManagerHeader>
      <div className="flex flex-auto w-full">
        <SlideManagerLeftSidebarWrapper
          visible={leftSidebarVisible}
          setLeftSidebarVisible={setLeftSidebarVisible}>
          <AgendaPanel setOpenContentTypePicker={setOpenContentTypePicker} />
        </SlideManagerLeftSidebarWrapper>
        <div className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100">
          {renderSlide()}
        </div>
        <SlideManagerRightSidebarWrapper visible={rightSidebarVisible}>
          {renderRightSidebar()}
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
    <div className="sticky left-0 top-0 h-16 flex-none w-full z-10 border-b-2 border-gray-200">
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
  setLeftSidebarVisible,
}: {
  children: React.ReactNode
  visible: boolean
  setLeftSidebarVisible: (visible: boolean) => void
}) {
  return (
    <div
      className={cn(
        'relative flex-none transition-all duration-300 ease-in-out max-h-[calc(100vh_-_64px)] border-r-2 border-gray-200 bg-white',
        {
          'w-5': !visible,
          'w-72': visible,
        }
      )}>
      {visible ? children : null}

      <button
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-[1] p-1 aspect-square rounded-full border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out"
        onClick={() => setLeftSidebarVisible(!visible)}>
        {visible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
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
        'flex-none transition-all duration-300 ease-in-out overflow-hidden max-h-[calc(100vh_-_64px)] bg-white',
        {
          'w-72': visible,
          'w-0': !visible,
        }
      )}>
      {children}
    </div>
  )
}

export function SlideManagerAIChatOverlay({
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
