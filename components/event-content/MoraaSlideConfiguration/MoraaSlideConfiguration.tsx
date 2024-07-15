import { useContext } from 'react'

import { LuPencilRuler } from 'react-icons/lu'

import { ObjectPosition } from './ObjectPostion'
import { TextboxConfiguration } from './TextBoxConfiguration'
import { ConfigurationHeader } from '../FrameConfiguration/ConfigurationHeader'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

enum ObjectType {
  TEXT = 'text',
  TEXTBOX = 'textbox',
  RECT = 'rect',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  LINE = 'line',
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  ELLIPSE = 'ellipse',
}

export function MoraaSlideSettings() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

  if (!canvas) {
    return <div>Loading...</div>
  }

  const activeObject = canvas.getActiveObject()

  const renderersByContentType: Record<ObjectType, React.ReactNode> = {
    [ObjectType.TEXT]: <TextboxConfiguration />,
    [ObjectType.TEXTBOX]: <TextboxConfiguration />,
    [ObjectType.RECT]: null,
    [ObjectType.CIRCLE]: null,
    [ObjectType.TRIANGLE]: null,
    [ObjectType.LINE]: null,
    [ObjectType.POLYLINE]: null,
    [ObjectType.POLYGON]: null,
    [ObjectType.ELLIPSE]: null,
  }

  const renderer = activeObject
    ? renderersByContentType[activeObject.type as ObjectType]
    : null

  return (
    <div className="p-2 pr-0 text-sm">
      <ConfigurationHeader
        icon={<LuPencilRuler />}
        title={activeObject?.type || 'Design'}
      />
      <div className="pt-4 flex flex-col gap-2">
        <ObjectPosition />
        {renderer}
      </div>
    </div>
  )
}
