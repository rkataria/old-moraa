import { useEffect } from 'react'

import { Tab, Tabs } from '@nextui-org/react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { MdAdd, MdFormatListBulletedAdd } from 'react-icons/md'

import { RenderIf } from '../RenderIf/RenderIf'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setActiveTabAction } from '@/stores/slices/layout/studio.slice'

const VALID_TABS = ['landing-page', 'session-planner', 'content-studio']

export function SecondaryHeader() {
  const router = useRouter()
  const searchParams = useSearch({
    from: '/events/$eventId/',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
  const dispatch = useStoreDispatch()

  const { permissions } = useEventPermissions()

  const { preview } = useEventContext()

  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)
  const editing = useStoreSelector((state) => state.layout.studio.editing)
  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )

  const editable = !preview && permissions.canUpdateFrame

  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  useEffect(() => {
    const queryParamActiveTab = searchParams?.tab

    if (queryParamActiveTab && VALID_TABS.includes(queryParamActiveTab)) {
      dispatch(setActiveTabAction(queryParamActiveTab))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.tab, dispatch])

  const {
    addSection,
    setOpenContentTypePicker,
    setAddedFromSessionPlanner,
    insertInSectionId,
  } = useEventContext()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTabChange = (key: any) => {
    dispatch(setActiveTabAction(key))
    router.navigate({
      search: (prev) => ({ ...prev, tab: key }),
    })
  }

  const renderRightContent = () => {
    if (!editable) return null
    if (activeTab === 'session-planner') {
      return (
        <RenderIf isTrue={!editing}>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="flat"
              isLoading={isAddSectionLoading}
              startContent={<MdFormatListBulletedAdd size={22} />}
              onClick={() =>
                insertInSectionId
                  ? addSection({ afterSectionId: insertInSectionId })
                  : addSection({ addToLast: true })
              }>
              Add Section
            </Button>
            <Button
              size="sm"
              color="default"
              variant="flat"
              isLoading={isAddFrameLoading}
              startContent={<MdAdd size={24} />}
              onClick={() => {
                setAddedFromSessionPlanner(true)
                setOpenContentTypePicker(true)
              }}>
              Add Frame
            </Button>
          </div>
        </RenderIf>
      )
    }

    return null
  }

  return (
    <div className="flex-none h-12 w-full px-2 -mb-[2px] flex justify-between items-center">
      <Tabs
        variant="underlined"
        aria-label="Studio Tabs"
        color="primary"
        selectedKey={activeTab}
        classNames={{
          base: 'h-full',
          tabList: 'bg-transparent border-gray-100 shadow-none h-full pb-0',
          tab: 'text-gray-600 h-full',
          tabContent:
            'px-4 text-gray-600 h-full flex justify-center items-center font-medium',
        }}
        onSelectionChange={handleTabChange}>
        <Tab key="landing-page" title="Course Page" />
        {permissions.canUpdateFrame && (
          <Tab key="session-planner" title="Session Planner" />
        )}

        <Tab key="content-studio" title="Content Studio" />
      </Tabs>

      {renderRightContent()}
    </div>
  )
}
