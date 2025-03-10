/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { fabric } from 'fabric'

export const loadTemplate = (canvas: fabric.Canvas, templateKey: string) => {
  canvas.clear()

  switch (templateKey) {
    case 'blank':
      loadTemplateBlank(canvas)
      break

    default:
      loadTemplateBlank(canvas)
      break
  }
}

const loadTemplateBlank = (canvas: fabric.Canvas) => {
  canvas.backgroundColor = '#ffffff'
}
