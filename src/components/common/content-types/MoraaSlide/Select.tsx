import { useContext } from 'react'

import { RxCursorArrow } from 'react-icons/rx'

import { HeaderButton } from './HeaderButton'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function Select() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const handleSelect = () => {
    canvas.isDrawingMode = false
    canvas.selection = true
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <HeaderButton
      tooltipContent="Select"
      label="Select"
      active={canvas.selection}
      icon={<RxCursorArrow />}
      onClick={handleSelect}
    />
  )
}
