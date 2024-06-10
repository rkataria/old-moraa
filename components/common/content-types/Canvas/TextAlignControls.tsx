import { useContext } from 'react'

import {
  BsJustify,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
} from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { CanvasFrameContext, CanvasFrameContextType } from './CanvasProvider'
import { ControlButton } from '../../ControlButton'

export function TextAlignControls() {
  const { canvas } = useContext(CanvasFrameContext) as CanvasFrameContextType

  const activeObject = canvas?.getActiveObject() as fabric.Textbox

  if (!activeObject) {
    return null
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
          className: 'flex-none',
        }}
        onClick={() => activeObject.set('textAlign', 'left')}>
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
          className: 'flex-none',
        }}
        onClick={() => activeObject.set('textAlign', 'center')}>
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
          className: 'flex-none',
        }}
        onClick={() => activeObject.set('textAlign', 'right')}>
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
          className: 'flex-none',
        }}
        onClick={() => activeObject.set('textAlign', 'justify')}>
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
