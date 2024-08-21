import { useContext } from 'react'

import { LuRedo, LuUndo } from 'react-icons/lu'

import { HeaderButton } from './HeaderButton'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function HistoryControls() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { canvas } = useMoraaSlideEditorContext()
  const history = useMoraaSlideStore(
    (state) => state.history[currentFrame?.id as string]
  )

  if (!history || !canvas) return null

  return (
    <>
      <HeaderButton
        tooltipContent="Undo"
        label="Undo"
        icon={<LuUndo size={18} />}
        onClick={() => {
          history.undo()
        }}
      />
      <HeaderButton
        tooltipContent="Redo"
        label="Redo"
        icon={<LuRedo size={18} />}
        onClick={() => {
          history.redo()
        }}
      />
    </>
  )
}
