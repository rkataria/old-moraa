/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import toast from 'react-hot-toast'

import { NumberInput } from '../common/NumberInput'
import { Tooltip } from '../common/ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useUserPreferences } from '@/hooks/userPreferences'
import {
  changeContentTilesLayoutConfigAction,
  closeChangeContentTilesLayoutModalAction,
  ContentTilesLayout,
  MaxTilesPerPage,
} from '@/stores/slices/layout/live.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

type Layout = {
  name: keyof typeof ContentTilesLayout
  value: ContentTilesLayout
  src: string
}

const LVE_LAYOUTS: Layout[] = [
  {
    name: 'Default',
    value: ContentTilesLayout.Default,
    src: 'https://www.gstatic.com/meet/layout_v2_tiled_b81dc04cf1f16260f8dc9b727c03a14e.svg',
  },
  {
    name: 'Spotlight',
    value: ContentTilesLayout.Spotlight,
    src: 'https://www.gstatic.com/meet/layout_v2_fullscreen_9175b2e94ac960de3a29a4c5e4c32ab6.svg',
  },
  {
    name: 'Sidebar',
    value: ContentTilesLayout.Sidebar,
    src: 'https://www.gstatic.com/meet/layout_v2_sidebar_8dea1e0cfa750f5b3dc5b666daf8178d.svg',
  },
  {
    name: 'Topbar',
    value: ContentTilesLayout.Topbar,
    src: 'https://www.gstatic.com/meet/layout_v2_sidebar_8dea1e0cfa750f5b3dc5b666daf8178d.svg',
  },
]

export function ChangeLayoutModal() {
  const { userPreferencesMeetingMaxTilesPerPage } = useUserPreferences()
  const contentTilesLayoutConfig = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig
  )

  const [config, setConfig] = useState(contentTilesLayoutConfig)
  const isModalOpen = useStoreSelector(
    (store) => store.layout.live.changeContentTilesLayoutModalOpen
  )
  const { presentationStatus } = useEventSession()

  const disabledLayouts =
    presentationStatus === PresentationStatuses.STOPPED
      ? [
          ContentTilesLayout.Spotlight,
          ContentTilesLayout.Sidebar,
          ContentTilesLayout.Topbar,
        ]
      : []

  const dispatch = useStoreDispatch()

  useEffect(() => {
    setConfig(contentTilesLayoutConfig)
  }, [contentTilesLayoutConfig])

  const handleApplyLayout = () => {
    dispatch(changeContentTilesLayoutConfigAction(config))
    dispatch(closeChangeContentTilesLayoutModalAction())
    toast.success('Layout changed successfully')
  }

  return (
    <Modal
      size="md"
      isOpen={isModalOpen}
      onClose={() => {
        dispatch(closeChangeContentTilesLayoutModalAction())
      }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change Layout
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {LVE_LAYOUTS.map((layout) => (
                  <Tooltip
                    key={layout.value}
                    content="This layout is not available when a presentation is stopped"
                    offset={10}
                    hidden={!disabledLayouts.includes(layout.value)}>
                    <div
                      className={cn(
                        'p-1 rounded-md border-2 border-primary-50 flex justify-start items-center gap-4',
                        {
                          'border-primary bg-primary-50':
                            config.layout === layout.value,
                          'hover:border-primary cursor-pointer':
                            !disabledLayouts.includes(layout.value),
                          'opacity-50': disabledLayouts.includes(layout.value),
                        }
                      )}
                      onClick={() => {
                        if (disabledLayouts.includes(layout.value)) {
                          return
                        }
                        setConfig((prev) => ({
                          ...prev,
                          layout: layout.value,
                        }))
                      }}>
                      <img src={layout.src} alt="layout" />
                      <span>{layout.name}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Maximum Tiles</span>
                  <span className="text-xs text-gray-500">
                    Maximum number of tiles to display
                  </span>
                </div>
                <NumberInput
                  min={6}
                  max={32}
                  numbers={[6, 8, 12, 16, 20, 24, 28, 32]}
                  allowNegative={false}
                  number={config.maxTilesPerPage}
                  onNumberChange={(value) => {
                    setConfig((prev) => ({
                      ...prev,
                      maxTilesPerPage: value as MaxTilesPerPage,
                    }))
                    userPreferencesMeetingMaxTilesPerPage(
                      value as MaxTilesPerPage
                    )
                  }}
                />
              </div>
              {/* <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Hide tiles without video</span>
                </div>
                <Switch
                  size="sm"
                  checked={config.hideTilesWithNoVideo}
                  onValueChange={(value) => {
                    setConfig((prev) => ({
                      ...prev,
                      hideTilesWithNoVideo: value,
                    }))
                  }}
                />
              </div> */}
              {/* <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Hide self tile</span>
                </div>
                <Switch
                  size="sm"
                  checked={config.hideSelfTile}
                  onValueChange={() => {
                    setConfig((prev) => ({
                      ...prev,
                      hideSelfTile: !prev.hideSelfTile,
                    }))
                  }}
                />
              </div> */}
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => {
                  dispatch(closeChangeContentTilesLayoutModalAction())
                }}>
                Cancel
              </Button>
              <Button size="sm" color="primary" onPress={handleApplyLayout}>
                Apply
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
