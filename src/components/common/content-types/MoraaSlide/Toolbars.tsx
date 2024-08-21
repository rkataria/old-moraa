import { fabric } from 'fabric'

import { HistoryControls } from './HistoryControls'
import { ListBox } from './ListBox'
import { ShapePicker } from './ShapePicker/ShapePicker'
import { TextBox } from './TextBox'
import { MediaPicker } from '../../MediaPicker/MediaPicker'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function Toolbars() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const renderControls = () => (
    <>
      <TextBox />
      <ListBox />
      <MediaPicker
        onSelectCallback={(img) => {
          if (!img) return

          const fabricImg = new fabric.Image(img, {
            left: 100,
            top: 100,
          })

          fabricImg.scaleToWidth(300)
          fabricImg.set('centeredRotation', true)
          canvas?.add(fabricImg)
          canvas.setActiveObject(fabricImg)
        }}
        onSelect={(file) => {
          const reader = new FileReader()

          reader.addEventListener(
            'load',
            () => {
              const img = new Image()

              img.onload = () => {
                const fabricImg = new fabric.Image(img, {
                  left: 100,
                  top: 100,
                })

                fabricImg.scaleToWidth(300)
                fabricImg.set('centeredRotation', true)
                canvas?.add(fabricImg)
                canvas.setActiveObject(fabricImg)
              }

              img.src = reader.result as string
            },
            false
          )

          if (file) {
            reader.readAsDataURL(file)
          }
        }}
      />
      <ShapePicker
        onSelectCallback={(svg) => {
          fabric.loadSVGFromString(svg, (objects) => {
            // Add without grouping
            const obj = objects[0]
            obj.set('left', 100)
            obj.set('top', 100)
            obj.scaleToWidth(200)
            obj.set('centeredRotation', true)

            canvas.add(obj)
            canvas.setActiveObject(obj)
            canvas.renderAll()
          })
        }}
        onSelect={(svgFile) => {
          // Load SVG file
          const reader = new FileReader()

          reader.readAsText(svgFile)

          reader.onload = (e) => {
            const svg = e.target?.result as string

            fabric.loadSVGFromString(svg, (objects, options) => {
              const group = new fabric.Group(objects, options)

              group.scaleToWidth(300)
              group.set('centeredRotation', true)
              canvas?.add(group)
              canvas.setActiveObject(group)
              canvas.renderAll()
            })
          }
        }}
      />
      <HistoryControls />
    </>
  )

  if (!canvas) return null

  return (
    <div className="rounded-sm flex justify-center items-center gap-2 max-w-full overflow-auto scrollbar-nono m-auto w-fit">
      {renderControls()}
    </div>
  )
}
