import { useContext } from 'react'

import { Button } from '@nextui-org/button'

import { MoraaSlideActiveObjectCommonAppearance } from './MoraaSlideActiveObjectCommonAppearance'

import { ActiveSelectionSettings } from '@/components/common/content-types/MoraaSlide/ActiveSelectionSettings'
import { BulletListSettings } from '@/components/common/content-types/MoraaSlide/BulletListSettings'
import { handleDeleteSelection } from '@/components/common/content-types/MoraaSlide/Editor'
import { ImageSettings } from '@/components/common/content-types/MoraaSlide/ImageSettings'
import { TextboxSettings } from '@/components/common/content-types/MoraaSlide/TextboxSettings'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

enum ObjectType {
  TEXT = 'text',
  TEXTBOX = 'textbox',
  IMAGE = 'image',
  RECT = 'rect',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  LINE = 'line',
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  ELLIPSE = 'ellipse',
  BULLET_LIST = 'BulletList',
  NUMBER_LIST = 'NumberList',
  ACTIVE_SELECTION = 'activeSelection',
}

export function MoraaSlideActiveObjectAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!currentFrame) return null

  if (!canvas) {
    return <div>Loading...</div>
  }

  const activeObject = canvas.getActiveObject()

  const renderersByContentType: Record<ObjectType, React.ReactNode> = {
    [ObjectType.TEXT]: <TextboxSettings />,
    [ObjectType.TEXTBOX]: <TextboxSettings />,
    [ObjectType.IMAGE]: <ImageSettings />,
    [ObjectType.RECT]: null,
    [ObjectType.CIRCLE]: null,
    [ObjectType.TRIANGLE]: null,
    [ObjectType.LINE]: null,
    [ObjectType.POLYLINE]: null,
    [ObjectType.POLYGON]: null,
    [ObjectType.ELLIPSE]: null,
    [ObjectType.BULLET_LIST]: (
      <>
        <TextboxSettings />
        <BulletListSettings />
      </>
    ),
    [ObjectType.NUMBER_LIST]: <TextboxSettings />,
    [ObjectType.ACTIVE_SELECTION]: <ActiveSelectionSettings />,
  }

  const renderer = activeObject
    ? renderersByContentType[activeObject.type as ObjectType]
    : null

  return (
    <div className="flex flex-col gap-2">
      <MoraaSlideActiveObjectCommonAppearance />
      {renderer}
      <div className="pt-2">
        <Button
          color="danger"
          fullWidth
          radius="md"
          onClick={() => {
            handleDeleteSelection(canvas, currentFrame.id, setCanvas)
          }}>
          Delete Selection
        </Button>
      </div>
    </div>
  )
}
