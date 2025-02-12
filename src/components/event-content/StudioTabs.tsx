import { ReactNode, useEffect } from 'react'

import { Tab, Tabs } from '@nextui-org/react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { BsCollectionPlay } from 'react-icons/bs'
import { GoHome } from 'react-icons/go'
import { RiNewsLine } from 'react-icons/ri'
import { TbListDetails } from 'react-icons/tb'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setActiveTabAction } from '@/stores/slices/layout/studio.slice'
import { FrameStatus } from '@/types/enums'
import { STUDIO_TABS } from '@/types/event.type'

function Title({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <p className="text-[10px] font-medium">{title}</p>
    </div>
  )
}

const VALID_TABS = [
  STUDIO_TABS.LANDING_PAGE,
  STUDIO_TABS.SESSION_PLANNER,
  STUDIO_TABS.CONTENT_STUDIO,
  STUDIO_TABS.RECORDINGS,
]

export function StudioTabs() {
  const router = useRouter()
  const searchParams = useSearch({
    from: '/events/$eventId/',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
  const dispatch = useStoreDispatch()

  const { permissions } = useEventPermissions()

  const { sections } = useEventContext()

  const anyFramePublished = sections.some((section) =>
    section.frames.some((frame) => frame.status === FrameStatus.PUBLISHED)
  )

  const visibleContentTab = permissions.canUpdateFrame
    ? true
    : anyFramePublished

  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)

  useEffect(() => {
    const queryParamActiveTab = searchParams?.tab

    if (queryParamActiveTab && VALID_TABS.includes(queryParamActiveTab)) {
      dispatch(setActiveTabAction(queryParamActiveTab))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.tab, dispatch])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTabChange = (key: any) => {
    dispatch(setActiveTabAction(key))
    router.navigate({
      search: (prev) => ({ ...prev, tab: key }),
    })
  }

  const secondKey = permissions.canUpdateFrame
    ? 'session-planner'
    : 'content-studio'

  useHotkeys('1', () => handleTabChange('landing-page'))
  useHotkeys('2', () => handleTabChange(secondKey))
  useHotkeys('3', () =>
    permissions.canUpdateFrame ? handleTabChange('content-studio') : {}
  )

  return (
    <div className="h-full w-[64px] min-w-[64px] bg-white pt-4 z-[11]">
      <Tabs
        placement="start"
        keyboardActivation="manual"
        aria-label="Studio Tabs"
        selectedKey={activeTab}
        variant="light"
        classNames={{
          base: 'h-full w-full',
          tabList: 'h-full w-full p-0 rounded-none gap-4',
          tab: '!outline-none h-full px-0 data-[selected=true]:!bg-primary/10 rounded-none',
          cursor: 'hidden',
          tabContent:
            '!px-0 text-gray-600 h-full flex justify-center bg-transparent items-center font-medium group-data-[selected=true]:text-primary px-2',
        }}
        onSelectionChange={handleTabChange}>
        <Tab
          key="landing-page"
          title={<Title icon={<GoHome size={24} />} title="Home" />}
        />
        {permissions.canUpdateFrame && (
          <Tab
            key="session-planner"
            title={<Title icon={<TbListDetails size={24} />} title="Plan" />}
          />
        )}
        {visibleContentTab && (
          <Tab
            key="content-studio"
            title={<Title icon={<RiNewsLine size={24} />} title="Content" />}
          />
        )}
        <Tab
          key="recordings"
          title={<Title icon={<BsCollectionPlay size={24} />} title="Recaps" />}
        />
      </Tabs>
    </div>
  )
}
