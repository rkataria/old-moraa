import { useHotkeys } from 'react-hotkeys-hook'
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from 'react-icons/bs'

import { ControlButton } from '../../ControlButton'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function TextStyleControls() {
  const { canvas } = useMoraaSlideEditorContext()
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  ) as fabric.Textbox

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
    if (activeObjectState.fontWeight === 'bold') {
      activeObject.set('fontWeight', 'normal')
      canvas.renderAll()

      return
    }

    activeObject.set('fontWeight', 'bold')
    canvas.renderAll()
  }

  const handleItalic = () => {
    if (activeObjectState.fontStyle === 'italic') {
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
          variant: activeObjectState.fontWeight === 'bold' ? 'solid' : 'light',
          size: 'sm',
          className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
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
          variant: activeObjectState.underline ? 'solid' : 'light',
          size: 'sm',
          className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
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
          variant: activeObjectState.fontStyle === 'italic' ? 'solid' : 'light',
          size: 'sm',
          className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
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
          variant: activeObjectState.linethrough ? 'solid' : 'light',
          size: 'sm',
          className: 'flex-none flex-grow bg-gray-100 hover:bg-gray-200',
          isIconOnly: true,
        }}
        onClick={handleStrikethrough}>
        <BsTypeStrikethrough size={18} />
      </ControlButton>
    </>
  )
}
