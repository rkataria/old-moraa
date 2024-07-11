import { useContext } from 'react'

import { FontFamilyControl } from './FontFamilyControl'
import { FrameBackgroundControl } from './FrameBackgroundControl'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function CommonAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType

  if (!currentFrame) return null

  return (
    <>
      <FrameBackgroundControl />
      <FontFamilyControl />
    </>
  )
}
