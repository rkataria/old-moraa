import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { fabric } from 'fabric'
import { AlignGuidelines } from 'fabric-guideline-plugin'
import ResizeObserver from 'rc-resize-observer'
import { useHotkeys } from 'react-hotkeys-hook'

import { CanvasFrameContext, CanvasFrameContextType } from './CanvasProvider'
import { Toolbars } from './Toolbars'
import { CANVAS_TEMPLATE_TYPES } from '../../BreakoutTypePicker'
import { ContentLoading } from '../../ContentLoading'

import { IFrame } from '@/types/frame.type'
import { loadTemplate } from '@/utils/canvas-templates'

interface CanvasProps {
  frame: IFrame & {
    content: {
      defaultTemplate: CANVAS_TEMPLATE_TYPES
      canvas: string
      svg: string
    }
  }
}

// eslint-disable-next-line func-names
// fabric.Textbox.prototype._renderTextLine = function (
//   method,
//   ctx,
//   line,
//   left,
//   top,
//   lineIndex
// ) {
//   if (!this.textLines) {
//     return this
//   }

//   const style0 = this.getCompleteStyleDeclaration(lineIndex, 0)

//   const bullet =
//     this.listType === 'bullet'
//       ? [this.listBullet]
//       : [`${this.listCounter + 1}.`]
//   const bulletLeft = left - style0.fontSize - 2

//   if (line.length) {
//     if (!this.isWrapping) {
//       // render the bullet
//       this._renderChars(method, ctx, bullet, bulletLeft, top, lineIndex)
//       this.isWrapping = !this.isEndOfWrapping(lineIndex)
//       // eslint-disable-next-line no-plusplus
//       if (!this.isWrapping) this.listCounter++
//     } else if (this.isEndOfWrapping(lineIndex)) {
//       this.isWrapping = false
//       // eslint-disable-next-line no-plusplus
//       this.listCounter++
//     }
//   }
//   if (lineIndex === this.textLines.length - 1) {
//     this.isWrapping = false
//     this.listCounter = 0
//   }
//   // render the text line
//   this._renderChars(method, ctx, line as string, left, top, lineIndex)
// }

// fabric.BulletList = fabric.util.createClass(fabric.Textbox, {
//   ...this,
//   type: 'bulletList',
//   initialize(text, options) {
//     options = options || {}
//     this.callSuper('initialize', text, options)
//     this.set('listType', 'bullet')
//     this.set('listBullet', '\u2022')
//     this.set('listCounter', 0)
//   },
//   toObject() {
//     return fabric.util.object.extend(this.callSuper('toObject'), {
//       listType: this.get('listType'),
//       listBullet: this.get('listBullet'),
//       listCounter: this.get('listCounter'),
//     })
//   },
//   // eslint-disable-next-line consistent-return
//   _renderTextLine(method, ctx, line, left, top, lineIndex) {
//     if (!this.textLines) {
//       return this
//     }

//     const style0 = this.getCompleteStyleDeclaration(lineIndex, 0)

//     const bullet = [this.listBullet]
//     const bulletLeft = left - style0.fontSize - 2

//     if (line.length) {
//       // render the bullet
//       this._renderChars(method, ctx, bullet, bulletLeft, top, lineIndex)
//     }
//     // render the text line
//     this._renderChars(method, ctx, line as string, left, top, lineIndex)
//   },
// })

export function CanvasEditor({ frame }: CanvasProps) {
  const { canvas, setCanvas, sync } = useContext(
    CanvasFrameContext
  ) as CanvasFrameContextType
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // press escape key to deselect
  useHotkeys('esc', () => {
    canvas?.discardActiveObject()
    canvas?.renderAll()
  })
  // press delete key to delete selected object
  useHotkeys('delete', () => {
    const activeObject = canvas?.getActiveObject()
    if (activeObject) {
      canvas?.remove(activeObject)
      canvas?.renderAll()
    }
  })
  // // press ctrl + z to undo
  // useHotkeys('ctrl+z', () => {
  //   // canvas?.historyUndo()
  // })
  // // press ctrl + y to redo
  // useHotkeys('ctrl+y', () => {
  //   // canvas?.historyRedo()
  // })

  useEffect(() => {
    if (frame?.config?.backgroundColor) {
      canvas?.setBackgroundColor(`${frame.config.backgroundColor}E6`, () => {
        canvas?.renderAll()
      })
    }
  }, [canvas, frame.config.backgroundColor])

  useLayoutEffect(() => {
    const canvasInstance =
      canvas ||
      new fabric.Canvas(`canvas-${frame.id}`, {
        selectionBorderColor: '#979797',
        selectionColor: 'transparent',
        selectionDashArray: [4, 4],
        selectionLineWidth: 1,
        backgroundColor: 'transparent',
      })

    const guideline = new AlignGuidelines({
      canvas: canvasInstance,
    })

    guideline.init()

    if (!canvas) {
      if (frame.content.canvas) {
        const json = JSON.parse(frame.content.canvas)

        canvasInstance.loadFromJSON(json, () => {
          canvasInstance.setBackgroundColor(
            `${frame.config.backgroundColor || '#ffffff'}E6`,
            () => {}
          )
          canvasInstance.renderAll()
          setIsLoading(false)
        })
      } else {
        loadTemplate(
          canvasInstance,
          frame.content.defaultTemplate || CANVAS_TEMPLATE_TYPES.BLANK
        )
        setIsLoading(false)
      }
    }

    resizeCanvas(
      canvasContainerRef.current?.clientWidth || 0,
      canvasContainerRef.current?.clientHeight || 0
    )

    canvasInstance.on('object:modified', (e) => {
      // eslint-disable-next-line no-console
      console.log('object modified', e)
    })

    canvasInstance.on('selection:created', (e) => {
      // eslint-disable-next-line no-console
      console.log('selection created', e)
    })

    canvasInstance.on('selection:updated', (e) => {
      // eslint-disable-next-line no-console
      console.log('selection updated', e)
    })

    canvasInstance.on('selection:cleared', () => {
      sync()

      // eslint-disable-next-line no-console
      console.log('selection cleared')
    })

    setCanvas(canvasInstance)

    // return () => {
    //   canvasInstance.dispose()
    //   setCanvas(null)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.content, canvas])

  const resizeCanvas = (width: number, height: number) => {
    if (!canvas) return

    // const ratio = canvas.getWidth() / canvas.getHeight()
    const containerWidth = width
    const containerHeight = height

    const scale = containerWidth / canvas.getWidth()
    const zoom = canvas.getZoom() * scale
    canvas.setDimensions({
      width: containerWidth,
      height: containerHeight, // containerWidth / ratio,
    })
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
    canvas.renderAll()
  }

  return (
    <div className="w-full h-full flex justify-center items-center max-w-5xl m-auto relative">
      {isLoading && (
        <div className="absolute left-0 top-0 w-full h-full z-[1]">
          <ContentLoading />
        </div>
      )}
      <div className="flex flex-col gap-2 w-full">
        <Toolbars />
        <ResizeObserver
          onResize={({ width, height }) => {
            resizeCanvas?.(width, height)
          }}>
          <div
            ref={canvasContainerRef}
            className="flex-auto w-full aspect-video m-auto bg-white rounded-sm overflow-hidden">
            <canvas id={`canvas-${frame.id}`} />
          </div>
        </ResizeObserver>
      </div>
    </div>
  )
}
