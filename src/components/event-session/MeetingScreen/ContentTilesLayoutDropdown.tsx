import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { LuLayoutDashboard } from 'react-icons/lu'
import { MdSettingsSuggest } from 'react-icons/md'
import { TbLayoutGridFilled } from 'react-icons/tb'

import { Button } from '@/components/ui/Button'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  changeContentTilesLayoutConfigAction,
  ContentTilesLayout,
  openChangeContentTilesLayoutModalAction,
} from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function ContentTilesLayoutDropdown({
  showLabel,
}: {
  showLabel?: boolean
}) {
  const [open, setOpen] = useState(false)
  const dispatch = useStoreDispatch()
  const layout = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.layout
  )

  return (
    <Dropdown offset={20} showArrow onOpenChange={setOpen}>
      <DropdownTrigger>
        <Button
          size="sm"
          isIconOnly={!showLabel}
          className={cn('live-button', {
            active: open,
          })}
          startContent={<LuLayoutDashboard size={16} />}
          variant="light">
          {showLabel ? 'Layout' : null}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
        <DropdownSection showDivider title="Change Layout">
          <DropdownItem
            key="spotlight"
            description="Tiles will overlay the frame"
            // shortcut="⌘N"
            startContent={<TbLayoutGridFilled size={48} />}
            className={cn('mb-2', {
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Spotlight,
            })}
            onClick={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Spotlight,
                })
              )
            }}>
            Spotlight
          </DropdownItem>
          <DropdownItem
            key="sidebar"
            description="Tiles will be displayed on the sidebar"
            // shortcut="⌘C"
            startContent={<BsLayoutSidebarInsetReverse size={48} />}
            className={cn('mb-2', {
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Sidebar ||
                layout === ContentTilesLayout.Default,
            })}
            onClick={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Sidebar,
                })
              )
            }}>
            Sidebar
          </DropdownItem>
          <DropdownItem
            key="topbar"
            description="Tiles will be displayed on the topbar"
            // shortcut="⌘⇧E"
            startContent={
              <BsLayoutSidebarInsetReverse className="-rotate-90" size={48} />
            }
            className={cn({
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Topbar,
            })}
            onClick={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Topbar,
                })
              )
            }}>
            Topbar
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="open-modal"
            description="You can change more options"
            // shortcut="⌘⇧D"
            startContent={<MdSettingsSuggest size={48} />}
            onClick={() => {
              dispatch(openChangeContentTilesLayoutModalAction())
            }}>
            More Options
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
