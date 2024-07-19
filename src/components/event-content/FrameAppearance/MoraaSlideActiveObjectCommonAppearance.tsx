import { useContext } from 'react'

import { FaRegClone } from 'react-icons/fa'
import { PiFlipHorizontalFill, PiFlipVerticalFill } from 'react-icons/pi'
import { RiBringForward, RiSendBackward } from 'react-icons/ri'

import { Fill } from '@/components/common/content-types/MoraaSlide/Fill'
import { Position } from '@/components/common/content-types/MoraaSlide/Position'
import { ControlButton } from '@/components/common/ControlButton'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function MoraaSlideActiveObjectCommonAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const activeObject = canvas?.getActiveObject() as fabric.Textbox

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
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex-grow',
          }}
          onClick={() => {
            canvas.sendToBack(activeObject)
            canvas.renderAll()
            setCanvas(currentFrame?.id as string, canvas)
          }}>
          <RiSendBackward size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Bring forward',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex-grow',
          }}
          onClick={() => {
            canvas.bringForward(activeObject)
            canvas.renderAll()
            setCanvas(currentFrame?.id as string, canvas)
          }}>
          <RiBringForward size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Flip horizontally',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex-grow',
          }}
          onClick={() => {
            activeObject.set('flipX', !activeObject.flipX)
            canvas.renderAll()
          }}>
          <PiFlipHorizontalFill size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Flip vertically',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex-grow',
          }}
          onClick={() => {
            activeObject.set('flipY', !activeObject.flipY)
            canvas.renderAll()
          }}>
          <PiFlipVerticalFill size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Clone',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex-grow',
          }}
          onClick={() => {
            activeObject.clone((clonedObject: fabric.Object) => {
              clonedObject.set({
                left: clonedObject.left! + 10,
                top: clonedObject.top! + 10,
              })
              canvas.add(clonedObject)
              canvas.setActiveObject(clonedObject)
              canvas.renderAll()
              setCanvas(currentFrame?.id as string, canvas)
            })
          }}>
          <FaRegClone size={18} />
        </ControlButton>
      </div>
    </div>
  )
}
