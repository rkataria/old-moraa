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
import { changeTextStyles } from '@/utils/moraa-slide'

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
    changeTextStyles({
      canvas,
      activeObject,
      styles: {
        fontWeight: activeObjectState.fontWeight === 'bold' ? 'normal' : 'bold',
      },
      applyToSelection: true,
    })
  }

  const handleItalic = () => {
    changeTextStyles({
      canvas,
      activeObject,
      styles: {
        fontStyle:
          activeObjectState.fontStyle === 'italic' ? 'normal' : 'italic',
      },
      applyToSelection: true,
    })
  }

  const handleUnderline = () => {
    changeTextStyles({
      canvas,
      activeObject,
      styles: {
        underline: !activeObject.underline,
      },
      applyToSelection: true,
    })
  }

  const handleStrikethrough = () => {
    changeTextStyles({
      canvas,
      activeObject,
      styles: {
        linethrough: !activeObject.linethrough,
      },
      applyToSelection: true,
    })
  }

  const fontWeight =
    activeObjectState.getSelectedText()?.length > 0
      ? activeObjectState.getSelectionStyles().find((style) => style.fontWeight)
      : activeObjectState.fontWeight

  return (
    <>
      <ControlButton
        tooltipProps={{
          content: 'Bold',
        }}
        buttonProps={{
          variant: fontWeight === 'bold' ? 'solid' : 'light',
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
