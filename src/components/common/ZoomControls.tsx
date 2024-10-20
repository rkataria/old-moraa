import { useState } from 'react'

import { cn } from '@nextui-org/react'
import { Tooltip } from '@nextui-org/tooltip'
import { GoZoomIn } from 'react-icons/go'
import { IoMdAdd } from 'react-icons/io'
import { LuMinus } from 'react-icons/lu'

import { RenderIf } from './RenderIf/RenderIf'
import { Button } from '../ui/Button'

interface IZoomControls {
  handleScaleChange: (zoomType: string) => void
  scale: number
}

export function ZoomControls({ handleScaleChange, scale }: IZoomControls) {
  const [visibleChipView, setVisibleView] = useState(false)

  return (
    <div
      style={{
        boxShadow: visibleChipView ? '0px 2px 10px rgba(5, 0, 56, 0.08)' : '',
      }}
      className={cn('flex items-center gap-2 duration-300', {
        'bg-white  rounded-lg w-30': visibleChipView,
      })}>
      <RenderIf isTrue={visibleChipView}>
        <>
          <Tooltip content="Previous page" placement="top">
            <Button
              variant="flat"
              isIconOnly
              size="sm"
              radius="full"
              className={cn(
                'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-lg',
                {}
              )}
              onClick={() => handleScaleChange('zoomOut')}>
              <LuMinus size={18} />
            </Button>
          </Tooltip>
          <p>{Math.floor(scale * 100)}%</p>
        </>
      </RenderIf>
      <RenderIf isTrue={!!handleScaleChange}>
        <Tooltip content="Previous page" placement="top">
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            radius="full"
            className={cn(
              'transition-all duration-300 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full',
              {
                'rounded-lg': visibleChipView,
              }
            )}
            onClick={() => {
              setVisibleView(true)
              handleScaleChange('zoomIn')
            }}>
            {visibleChipView ? <IoMdAdd size={18} /> : <GoZoomIn size={22} />}
          </Button>
        </Tooltip>
      </RenderIf>
    </div>
  )
}
