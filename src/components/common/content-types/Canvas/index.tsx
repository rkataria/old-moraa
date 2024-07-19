import { CanvasEditor } from './CanvasEditor'
import { CanvasFrameContextProvider } from './CanvasProvider'
import { CANVAS_TEMPLATE_TYPES } from '../../BreakoutTypePicker'

import { IFrame } from '@/types/frame.type'

interface CanvasProps {
  frame: IFrame & {
    content: {
      defaultTemplate: CANVAS_TEMPLATE_TYPES
      canvas: string
      svg: string
    }
  }
}

export function Canvas({ frame }: CanvasProps) {
  return (
    <CanvasFrameContextProvider>
      <CanvasEditor frame={frame} />
    </CanvasFrameContextProvider>
  )
}
