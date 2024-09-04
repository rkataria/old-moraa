import { LuPencilRuler } from 'react-icons/lu'

import { ObjectPosition } from './ObjectPostion'
import { TextboxConfiguration } from './TextBoxConfiguration'

import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { useStoreSelector } from '@/hooks/useRedux'

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
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  )

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

  const renderer = activeObjectState
    ? renderersByContentType[activeObjectState.type as ObjectType]
    : null

  return (
    <div className="p-2 pr-0 text-sm">
      <RightSidebarHeader
        icon={<LuPencilRuler />}
        title={activeObjectState?.type || 'Design'}
      />
      <div className="pt-4 flex flex-col gap-2">
        <ObjectPosition />
        {renderer}
      </div>
    </div>
  )
}
