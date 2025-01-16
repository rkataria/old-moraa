import { FaRegClone } from 'react-icons/fa'
import { PiFlipHorizontalFill, PiFlipVerticalFill } from 'react-icons/pi'
import { RiBringForward, RiSendBackward } from 'react-icons/ri'

import { Fill } from '@/components/common/content-types/MoraaSlide/Fill'
import { Position } from '@/components/common/content-types/MoraaSlide/Position'
import { ControlButton } from '@/components/common/ControlButton'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { dupliacateObjects } from '@/utils/moraa-slide'

export function MoraaSlideActiveObjectCommonAppearance() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Object

  return (
    <div className="flex flex-col gap-2">
      <Position />
      <Fill />
      <div className="pt-2 flex gap-2">
        <ControlButton
          tooltipProps={{
            content: 'Send to back',
          }}
          buttonProps={{
            size: 'sm',
            className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
            isIconOnly: true,
          }}
          onClick={() => {
            canvas.sendToBack(activeObject)
            canvas.renderAll()
          }}>
          <RiSendBackward size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Bring forward',
          }}
          buttonProps={{
            size: 'sm',
            className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
            isIconOnly: true,
          }}
          onClick={() => {
            activeObject.bringForward()
            canvas.renderAll()
          }}>
          <RiBringForward size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Flip horizontally',
          }}
          buttonProps={{
            size: 'sm',
            className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
            isIconOnly: true,
          }}
          onClick={() => {
            activeObject?.set('flipX', !activeObject.flipX)
            canvas.renderAll()
          }}>
          <PiFlipHorizontalFill size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Flip vertically',
          }}
          buttonProps={{
            size: 'sm',
            className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
            isIconOnly: true,
          }}
          onClick={() => {
            activeObject?.set('flipY', !activeObject.flipY)
            canvas.renderAll()
          }}>
          <PiFlipVerticalFill size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Clone',
          }}
          buttonProps={{
            size: 'sm',
            className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
            isIconOnly: true,
          }}
          onClick={() => {
            dupliacateObjects(canvas)
          }}>
          <FaRegClone size={16} />
        </ControlButton>
      </div>
    </div>
  )
}
