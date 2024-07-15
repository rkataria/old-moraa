import { useContext } from 'react'

import {
  BsJustify,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
} from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { ControlButton } from '../../ControlButton'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function TextAlignControls() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const aligText = (align: string) => {
    activeObject.set('textAlign', align)
    canvas.renderAll()
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <>
      <ControlButton
        tooltipProps={{
          content: 'Align left',
        }}
        buttonProps={{
          variant: activeObject?.textAlign === 'left' ? 'solid' : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200': activeObject?.textAlign === 'left',
          }),
        }}
        onClick={() => aligText('left')}>
        <BsTextLeft size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Align center',
        }}
        buttonProps={{
          variant: activeObject?.textAlign === 'center' ? 'solid' : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200': activeObject?.textAlign === 'left',
          }),
        }}
        onClick={() => aligText('center')}>
        <BsTextCenter size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Align right',
        }}
        buttonProps={{
          variant: activeObject?.textAlign === 'right' ? 'solid' : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200': activeObject?.textAlign === 'left',
          }),
        }}
        onClick={() => aligText('right')}>
        <BsTextRight size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Justify',
        }}
        buttonProps={{
          variant: activeObject?.textAlign === 'justify' ? 'solid' : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200': activeObject?.textAlign === 'left',
          }),
        }}
        onClick={() => aligText('justify')}>
        <BsJustify size={18} />
      </ControlButton>
    </>
  )

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <Button
          fullWidth
          className="bg-black text-white"
          onClick={() => activeObject.set('textAlign', 'left')}>
          <BsTextLeft />
        </Button>
        <Button
          fullWidth
          className="bg-black text-white"
          onClick={() => activeObject.set('textAlign', 'center')}>
          <BsTextCenter />
        </Button>
        <Button
          fullWidth
          className="bg-black text-white"
          onClick={() => activeObject.set('textAlign', 'right')}>
          <BsTextRight />
        </Button>
        <Button
          fullWidth
          className="bg-black text-white"
          onClick={() => activeObject.set('textAlign', 'justify')}>
          <BsJustify />
        </Button>
      </div>
    </div>
  )
}
