import { useEffect } from 'react'

import { Tab, Tabs } from '@nextui-org/react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setActiveTabAction } from '@/stores/slices/layout/studio.slice'
import { FrameStatus } from '@/types/enums'

const VALID_TABS = ['landing-page', 'session-planner', 'content-studio']

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
    <div className="h-full">
      <Tabs
        variant="underlined"
        aria-label="Studio Tabs"
        color="primary"
        selectedKey={activeTab}
        classNames={{
          base: 'h-full',
          tabList: 'h-full p-0',
          tab: '!outline-none h-full',
          tabContent:
            'px-4 text-gray-600 h-full flex justify-center items-center font-medium',
        }}
        onSelectionChange={handleTabChange}>
        <Tab key="landing-page" title="Overview" />
        {permissions.canUpdateFrame && (
          <Tab key="session-planner" title="Plan" />
        )}
        {visibleContentTab && <Tab key="content-studio" title="Content" />}
      </Tabs>
    </div>
  )
}
