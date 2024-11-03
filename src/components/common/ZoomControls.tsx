import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { IoMdAdd, IoMdPhoneLandscape, IoMdPhonePortrait } from 'react-icons/io'
import { LuMinus } from 'react-icons/lu'

import { Button } from '../ui/Button'

import { IPdfZoom } from '@/types/frame.type'
import { PdfView, PdfViews } from '@/utils/pdf.utils'

interface IZoomControls {
  handleScaleChange: (zoom: IPdfZoom) => void
  zoom: IPdfZoom
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
          'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full'
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
              {zoom.scale
                ? `${Math.floor(zoom.scale * 100)}%`
                : PdfViews[zoom.type as PdfView]}
            </p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          variant="flat"
          onAction={(actionKey) => {
            handleScaleChange({ type: actionKey as string, scale: undefined })
          }}>
          <DropdownItem key="fit-to-page">
            <div className="flex items-center gap-4">
              <IoMdPhonePortrait size={28} className="text-gray-500" />
              Fit to page
            </div>
          </DropdownItem>
          <DropdownItem key="full-page">
            <div className="flex items-center gap-4">
              <IoMdPhoneLandscape size={28} className="text-gray-500" />
              Full page
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button
        variant="flat"
        isIconOnly
        size="sm"
        radius="full"
        className={cn(
          'transition-all duration-300 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full'
        )}
        onClick={() => {
          handleScaleChange({ ...zoom, type: 'zoom-in' })
        }}>
        <IoMdAdd size={14} />
      </Button>
    </div>
  )
}
