import {
  BsJustify,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
} from 'react-icons/bs'

import { ControlButton } from '@/components/common/ControlButton'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { cn } from '@/utils/utils'

export function TextAlignControls() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const aligText = (align: string) => {
    activeObject.set('textAlign', align)
    canvas.renderAll()
    canvas.fire('object:modified', { target: activeObject })
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
              : 'light',
          size: 'sm',
          className: cn('flex-none flex-grow', {
            'bg-gray-100 hover:bg-gray-200':
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
              : 'light',
          size: 'sm',
          className: cn('flex-none flex-grow', {
            'bg-gray-100 hover:bg-gray-200':
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
              : 'light',
          size: 'sm',
          className: cn('flex-none flex-grow', {
            'bg-gray-100 hover:bg-gray-200':
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
              : 'light',
          size: 'sm',
          className: cn('flex-none flex-grow', {
            'bg-gray-100 hover:bg-gray-200':
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
