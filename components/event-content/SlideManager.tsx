/* eslint-disable react/button-has-type */
import {
  Fragment,
  useContext,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Panel,
  PanelGroup,
  ImperativePanelHandle,
} from 'react-resizable-panels'
import { v4 as uuidv4 } from 'uuid'

import { Header } from './Header'
import { SettingsSidebar } from './SettingsSidebar'
import { Slide } from './Slide'
import { AgendaPanel } from '../common/AgendaPanel'
import { AIChat } from '../common/AIChat'
import { Loading } from '../common/Loading'
import { PanelResizer } from '../common/PanelResizer'
import { SlideControls } from '../common/SlideControls'
import { SyncingStatus } from '../common/SyncingStatus'

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
  const { event, isLoading: eventLoading } = useEvent({ id: eventId as string })
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
    addSlideToSection,
  } = useContext(EventContext) as EventContextType
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [mainLayoutPanelSizes, setMainLayoutPanelSizes] = useState([2, 98]) // [leftSidebar, mainContent, rightSidebar]
  const debouncedMainLayoutPanelSizes = useDebounce(mainLayoutPanelSizes, 500)

  useEffect(() => {
    const leftPanelSize = debouncedMainLayoutPanelSizes[0]

    if (leftPanelSize > 5) {
      setLeftSidebarVisible(true)
      leftPanelRef.current?.resize(leftPanelSize)
    } else {
      setLeftSidebarVisible(false)
      leftPanelRef.current?.resize(2)
    }
  }, [debouncedMainLayoutPanelSizes])

  const getSettingsEnabled = () => {
    if (!currentSlide || !isOwner) return false

    return true
  }

  const settingsEnabled = getSettingsEnabled()

  const handleAddNewSlide = (contentType: ContentType) => {
    const currentSection = sections.find(
      (s) => s.id === currentSlide?.section_id
    )
    const insertInSection = currentSection || sections[0]

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
      afterSlideId: currentSlide?.id,
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

  const renderRightSidebar = () => {
    if (preview || !isOwner) return null
    if (aiChatOverlay) {
      return <AIChat onClose={() => setRightSidebarVisible(false)} />
    }
    if (currentSlide && settingsEnabled) {
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
    if (!currentSlide) return null

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
        <SlideControls />
      </Fragment>
    )
  }

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible((prev) => {
      const newState = !prev
      if (leftPanelRef.current) {
        leftPanelRef.current.resize(newState ? 20 : 2)
      }

      return newState
    })
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
      <div className="flex flex-auto w-full h-full relative bg-gray-100">
        <PanelGroup
          direction="horizontal"
          autoSaveId="slideManagerLayout"
          onLayout={(layout) => {
            setMainLayoutPanelSizes(layout)
          }}>
          {/* Left Sidebar */}
          <Panel
            minSize={2}
            maxSize={25}
            defaultSize={leftSidebarVisible ? 20 : 0}
            ref={leftPanelRef}
            className={cn('pr-5', {
              'bg-transparent': leftSidebarVisible,
            })}>
            <SlideManagerLeftSidebarWrapper
              visible={leftSidebarVisible}
              toggleLeftSidebar={toggleLeftSidebar}>
              {leftSidebarVisible && (
                <AgendaPanel
                  setOpenContentTypePicker={setOpenContentTypePicker}
                />
              )}
            </SlideManagerLeftSidebarWrapper>
          </Panel>

          <PanelResizer className="right-6" />
          <Panel
            minSize={20}
            defaultSize={
              leftSidebarVisible && rightSidebarVisible
                ? 60
                : rightSidebarVisible
                  ? 80
                  : 100
            }
            maxSize={rightSidebarVisible ? 70 : 100}>
            <div className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100">
              {renderSlide()}
            </div>
          </Panel>

          {rightSidebarVisible && !preview && isOwner && (
            <>
              <PanelResizer className="-right-[4px]" />
              <Panel
                minSize={
                  leftSidebarVisible && rightSidebarVisible
                    ? 23
                    : rightSidebarVisible
                      ? 18
                      : 0
                }
                maxSize={25}
                defaultSize={
                  leftSidebarVisible && rightSidebarVisible
                    ? 23
                    : rightSidebarVisible
                      ? 18
                      : 0
                }
                ref={rightPanelRef}
                className="bg-white">
                <SlideManagerRightSidebarWrapper visible>
                  {renderRightSidebar()}
                </SlideManagerRightSidebarWrapper>
              </Panel>
            </>
          )}
        </PanelGroup>
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
      style={{ backgroundColor: 'var(--slide-bg-color)' }}>
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
  toggleLeftSidebar,
}: {
  children: React.ReactNode
  visible: boolean
  toggleLeftSidebar: () => void
}) {
  return (
    <div
      className={cn(
        'w-full h-full relative flex-none transition-all duration-300 ease-in-out max-h-[calc(100vh_-_64px)] border-r-2 border-gray-200 bg-white'
      )}>
      {visible ? children : null}

      <button
        className="absolute -right-4 top-20 -translate-y-1/2 z-[1] p-1 aspect-square rounded-full border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out"
        onClick={toggleLeftSidebar}>
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
        'h-full flex-none transition-all duration-300 ease-in-out overflow-hidden max-h-[calc(100vh_-_64px)] bg-white',
        { 'w-full': visible, 'w-0': !visible }
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
        { 'w-72': visible, 'w-0': !visible }
      )}>
      {children}
    </div>
  )
}
