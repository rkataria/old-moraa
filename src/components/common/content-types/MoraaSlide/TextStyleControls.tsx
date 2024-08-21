import { useHotkeys } from 'react-hotkeys-hook'
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from 'react-icons/bs'

import { ControlButton } from '../../ControlButton'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function TextStyleControls() {
  const { canvas } = useMoraaSlideEditorContext()

  useHotkeys('ctrl+b', () => {
    handleBold()
  })
  useHotkeys('ctrl+i', () => {
    handleItalic()
  })
  useHotkeys('ctrl+shift+u', () => {
    handleUnderline()
  })
  useHotkeys('ctrl+shift+s', () => {
    handleStrikethrough()
  })

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const handleBold = () => {
    if (activeObject.fontWeight === 'bold') {
      activeObject.set('fontWeight', 'normal')
      canvas.renderAll()

      return
    }

    activeObject.set('fontWeight', 'bold')
    canvas.renderAll()
  }

  const handleItalic = () => {
    if (activeObject.fontStyle === 'italic') {
      activeObject.set('fontStyle', 'normal')
      canvas.renderAll()

      return
    }

    activeObject.set('fontStyle', 'italic')
    canvas.renderAll()
  }

  const handleUnderline = () => {
    activeObject.set('underline', !activeObject.underline)
    canvas.renderAll()
  }

  const handleStrikethrough = () => {
    activeObject.set('linethrough', !activeObject.linethrough)
    canvas.renderAll()
  }

  return (
    <>
      <ControlButton
        tooltipProps={{
          content: 'Bold',
        }}
        buttonProps={{
          variant: activeObject?.fontWeight === 'bold' ? 'solid' : 'flat',
          size: 'sm',
          className: 'flex-none flex-grow',
          isIconOnly: true,
        }}
        onClick={handleBold}>
        <BsTypeBold size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Underline',
        }}
        buttonProps={{
          variant: activeObject?.underline ? 'solid' : 'flat',
          size: 'sm',
          className: 'flex-none flex-grow',
          isIconOnly: true,
        }}
        onClick={handleUnderline}>
        <BsTypeUnderline size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Italic',
        }}
        buttonProps={{
          variant: activeObject?.fontStyle === 'italic' ? 'solid' : 'flat',
          size: 'sm',
          className: 'flex-none flex-grow',
          isIconOnly: true,
        }}
        onClick={handleItalic}>
        <BsTypeItalic size={18} />
      </ControlButton>
      <ControlButton
        tooltipProps={{
          content: 'Strikethrough',
        }}
        buttonProps={{
          variant: activeObject?.linethrough ? 'solid' : 'flat',
          size: 'sm',
          className: 'flex-none flex-grow',
          isIconOnly: true,
        }}
        onClick={handleStrikethrough}>
        <BsTypeStrikethrough size={18} />
      </ControlButton>
    </>
  )
}
