import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from 'react-icons/bs'

import { ControlButton } from '../../ControlButton'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function TextStyleControls() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

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

  const activeObject = canvas?.getActiveObject() as fabric.Textbox

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
          radius: 'md',
          className: 'flex-none flex-grow',
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
          radius: 'md',
          className: 'flex-none flex-grow',
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
          radius: 'md',
          className: 'flex-none flex-grow',
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
          radius: 'md',
          className: 'flex-none flex-grow',
        }}
        onClick={handleStrikethrough}>
        <BsTypeStrikethrough size={18} />
      </ControlButton>
    </>
  )
}
