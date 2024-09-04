import { MoraaSlideActiveObjectCommonAppearance } from './MoraaSlideActiveObjectCommonAppearance'

import { ActiveSelectionSettings } from '@/components/common/content-types/MoraaSlide/ActiveSelectionSettings'
import { BulletListSettings } from '@/components/common/content-types/MoraaSlide/BulletListSettings'
import { ImageSettings } from '@/components/common/content-types/MoraaSlide/ImageSettings'
import { RectSettings } from '@/components/common/content-types/MoraaSlide/RectSettings'
import { TextboxSettings } from '@/components/common/content-types/MoraaSlide/TextboxSettings'
import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { handleDeleteObjects } from '@/libs/moraa-slide-editor'

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
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) {
    return <div>Loading...</div>
  }

  const activeObject = canvas.getActiveObject()

  const renderersByContentType: Record<ObjectType, React.ReactNode> = {
    [ObjectType.TEXT]: <TextboxSettings />,
    [ObjectType.TEXTBOX]: <TextboxSettings />,
    [ObjectType.IMAGE]: <ImageSettings />,
    [ObjectType.RECT]: <RectSettings />,
    [ObjectType.CIRCLE]: <RectSettings />,
    [ObjectType.TRIANGLE]: <RectSettings />,
    [ObjectType.LINE]: <RectSettings />,
    [ObjectType.POLYLINE]: <RectSettings />,
    [ObjectType.POLYGON]: <RectSettings />,
    [ObjectType.ELLIPSE]: <RectSettings />,
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
          size="sm"
          color="danger"
          fullWidth
          onClick={() => {
            handleDeleteObjects(canvas)
          }}>
          Delete Selection
        </Button>
      </div>
    </div>
  )
}
