/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { fabric } from 'fabric'

import { CANVAS_TEMPLATE_TYPES } from '@/components/common/ContentTypePicker'

export const loadTemplate = (
  canvas: fabric.Canvas,
  templateKey: CANVAS_TEMPLATE_TYPES
) => {
  if (!canvas) return

  canvas.clear()

  switch (templateKey) {
    case CANVAS_TEMPLATE_TYPES.BLANK:
      loadTemplateBlank(canvas)
      break
    case CANVAS_TEMPLATE_TYPES.TEMPLATE_ONE:
      loadTemplateOne(canvas)
      break
    case CANVAS_TEMPLATE_TYPES.TEMPLATE_TWO:
      loadTemplateTwo(canvas)
      break
    default:
      loadTemplateBlank(canvas)
      break
  }
}

const loadTemplateBlank = (canvas: fabric.Canvas) => {
  canvas.backgroundColor = '#ffffff'
}

const loadTemplateOne = (canvas: fabric.Canvas) => {
  const title = new fabric.Textbox('Template One Title', {
    name: 'Title',
    fontSize: 48,
    hasControls: true,
    editable: true,
    height: 100,
    fontWeight: 'bold',
    originX: 'center',
    textAlign: 'center',
    width: canvas.getWidth() * 0.8,
    top: canvas.getHeight() * 0.3,
  })

  const subtitle = new fabric.Textbox('Template One Subtitle', {
    name: 'Subtitle',
    fontSize: 20,
    hasControls: true,
    editable: true,
    fontWeight: 'normal',
    height: 100,
    originX: 'center',
    textAlign: 'center',
    width: canvas.getWidth() * 0.8,
    top: canvas.getHeight() * 0.6,
  })

  canvas.backgroundColor = '#ffffff'
  canvas.add(title)
  canvas.add(subtitle)
  canvas.viewportCenterObjectH(title)
  canvas.viewportCenterObjectH(subtitle)
}

const loadTemplateTwo = (canvas: fabric.Canvas) => {
  const title = new fabric.Textbox('Template Two Title', {
    name: 'Title',
    fontSize: 24,
    hasControls: true,
    editable: true,
    fontWeight: 'bold',
    textAlign: 'left',
    width: canvas.getWidth() * 0.4,
    top: canvas.getHeight() * 0.4,
    left: canvas.getWidth() * 0.1,
  })

  const subtitle = new fabric.Textbox('Template Two Subtitle', {
    name: 'Subtitle',
    fontSize: 16,
    hasControls: true,
    editable: true,
    fontWeight: 'normal',
    textAlign: 'left',
    width: canvas.getWidth() * 0.4,
    top: canvas.getHeight() * 0.5,
    left: canvas.getWidth() * 0.1,
  })

  fabric.Image.fromURL(
    'https://images.unsplash.com/photo-1529335764857-3f1164d1cb24?q=10&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    (img) => {
      img.set({
        left: canvas.getWidth() * 0.6,
        top: canvas.getHeight() * 0.07,
      })
      img.scaleToWidth(canvas.getWidth() * 0.4)
      img.scaleToHeight(canvas.getHeight())
      img.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      })
      img.cacheKey = 'template-two-image'

      canvas.add(img)
    }
  )

  canvas.backgroundColor = '#ffffff'
  canvas.add(title)
  canvas.add(subtitle)
}
