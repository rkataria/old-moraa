import { CanvasEditor } from './CanvasEditor'
import { CanvasFrameContextProvider } from './CanvasProvider'
import { CANVAS_TEMPLATE_TYPES } from '../../ContentTypePicker'

import { ISlide } from '@/types/slide.type'

interface CanvasProps {
  slide: ISlide & {
    content: {
      defaultTemplate: CANVAS_TEMPLATE_TYPES
      canvas: string
      svg: string
    }
  }
}

export function Canvas({ slide }: CanvasProps) {
  return (
    <CanvasFrameContextProvider>
      <CanvasEditor slide={slide} />
    </CanvasFrameContextProvider>
  )
}
