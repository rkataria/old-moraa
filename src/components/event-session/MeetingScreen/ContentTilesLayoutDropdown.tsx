import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { MdSettingsSuggest } from 'react-icons/md'
import { TbLayoutGridFilled } from 'react-icons/tb'

import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  changeContentTilesLayoutConfigAction,
  ContentTilesLayout,
  openChangeContentTilesLayoutModalAction,
} from '@/stores/slices/layout/live.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function ContentTilesLayoutDropdown() {
  const { presentationStatus } = useEventSession()
  const dispatch = useStoreDispatch()
  const layout = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.layout
  )

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  return (
    <Dropdown offset={20} showArrow>
      <DropdownTrigger>
        <Button
          isIconOnly
          gradient="primary"
          color={
            layout === ContentTilesLayout.Spotlight ? 'default' : 'primary'
          }
          className={cn({
            'bg-black/20 text-white hover:bg-opacity-10':
              layout === ContentTilesLayout.Spotlight,
          })}>
          <TbLayoutGridFilled size={20} />
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
