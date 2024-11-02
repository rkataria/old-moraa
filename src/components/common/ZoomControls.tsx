import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { IoMdAdd } from 'react-icons/io'
import { LuMinus } from 'react-icons/lu'

import { Button } from '../ui/Button'

interface IZoomControls {
  handleScaleChange: (zoomType: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zoom: any
}

export function ZoomControls({ handleScaleChange, zoom }: IZoomControls) {
  return (
    <div className="flex items-center gap-2 duration-300 rounded-full bg-gray-50 relative z-[10]">
      <Button
        variant="flat"
        isIconOnly
        size="sm"
        radius="full"
        className={cn(
          'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-lg'
        )}
        onClick={() => handleScaleChange({ ...zoom, type: 'zoom-out' })}>
        <LuMinus size={14} />
      </Button>
      <Dropdown size="sm" classNames={{ content: '!min-w-[auto]' }}>
        <DropdownTrigger>
          <Button
            disableAnimation
            disableRipple
            variant="flat"
            className={cn(
              'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 rounded-lg px-0 !min-w-[auto] !bg-transparent'
            )}>
            <p className="text-xs">
              {zoom.scale ? `${Math.floor(zoom.scale * 100)}%` : zoom.type}
            </p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          variant="flat"
          onAction={(actionKey) => {
            handleScaleChange({ type: actionKey, scale: undefined })
          }}>
          <DropdownItem key="fit-to-page">Fit to page</DropdownItem>
          <DropdownItem key="full-page">Full page</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button
        variant="flat"
        isIconOnly
        size="sm"
        radius="full"
        className={cn(
          'transition-all duration-300 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent'
        )}
        onClick={() => {
          handleScaleChange({ ...zoom, type: 'zoom-in' })
        }}>
        <IoMdAdd size={14} />
      </Button>
    </div>
  )
}
