import { useContext } from 'react'

import {
  BsJustify,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
} from 'react-icons/bs'

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
  const { activeObject, setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas || !activeObject) return null

  const aligText = (align: string) => {
    const _activeObject = canvas.getActiveObject() as fabric.Textbox

    _activeObject.set('textAlign', align)
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
          variant:
            (activeObject as fabric.Textbox)?.textAlign === 'left'
              ? 'solid'
              : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200':
              (activeObject as fabric.Textbox)?.textAlign === 'left',
          }),
          isIconOnly: true,
        }}
        onClick={() => aligText('left')}>
        <BsTextLeft size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Align center',
        }}
        buttonProps={{
          variant:
            (activeObject as fabric.Textbox)?.textAlign === 'center'
              ? 'solid'
              : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200':
              (activeObject as fabric.Textbox)?.textAlign === 'left',
          }),
          isIconOnly: true,
        }}
        onClick={() => aligText('center')}>
        <BsTextCenter size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Align right',
        }}
        buttonProps={{
          variant:
            (activeObject as fabric.Textbox)?.textAlign === 'right'
              ? 'solid'
              : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200':
              (activeObject as fabric.Textbox)?.textAlign === 'left',
          }),
          isIconOnly: true,
        }}
        onClick={() => aligText('right')}>
        <BsTextRight size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Justify',
        }}
        buttonProps={{
          variant:
            (activeObject as fabric.Textbox)?.textAlign === 'justify'
              ? 'solid'
              : 'flat',
          size: 'sm',
          radius: 'md',
          className: cn('flex-none flex-grow', {
            'bg-gray-200':
              (activeObject as fabric.Textbox)?.textAlign === 'left',
          }),
          isIconOnly: true,
        }}
        onClick={() => aligText('justify')}>
        <BsJustify size={18} />
      </ControlButton>
    </>
  )
}
