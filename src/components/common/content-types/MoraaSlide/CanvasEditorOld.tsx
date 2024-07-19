// import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// import { fabric } from 'fabric'
// import { Canvas } from 'fabric/fabric-impl'
// import { AlignGuidelines } from 'fabric-guideline-plugin'
// import ResizeObserver from 'rc-resize-observer'
// import { useHotkeys } from 'react-hotkeys-hook'

// import { ContentLoading } from '../../ContentLoading'

// import { useCanvas } from '@/hooks/useCanvas'
// import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
// import { IFrame } from '@/types/frame.type'
// import { loadTemplate } from '@/utils/canvas-templates'
// import { cn } from '@/utils/utils'

// interface CanvasProps {
//   frame: IFrame & {
//     content: {
//       defaultTemplateKey: string
//       canvas: string
//       svg: string
//     }
//   }
// }

// export function CanvasEditor({ frame }: CanvasProps) {
//   const { saveToStorage } = useCanvas()
//   const canvasContainerRef = useRef<HTMLDivElement>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const canvas = useMoraaSlideStore((state) => state.canvas)
//   const setCanvas = useMoraaSlideStore((state) => state.setCanvas)
//   const setActiveObject = useMoraaSlideStore((state) => state.setActiveObject)
//   const reset = useMoraaSlideStore((state) => state.reset)

//   useEffect(() => {
//     reset()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [frame?.id])

//   // press escape key to deselect
//   useHotkeys('esc', () => {
//     canvas?.discardActiveObject()
//     canvas?.renderAll()
//   })
//   // press delete key to delete selected object
//   useHotkeys('delete', () => {
//     const activeObject = canvas?.getActiveObject()
//     if (activeObject) {
//       canvas?.remove(activeObject)
//       canvas?.renderAll()
//     }
//   })

//   useEffect(() => {
//     if (frame?.config?.backgroundColor) {
//       canvas?.setBackgroundColor(`${frame.config.backgroundColor}E6`, () => {
//         canvas?.renderAll()
//       })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [canvas, frame.config.backgroundColor])

//   useLayoutEffect(() => {
//     const canvasInstance =
//       canvas ||
//       new fabric.Canvas(`canvas-${frame.id}`, {
//         selectionBorderColor: '#979797',
//         selectionColor: 'transparent',
//         selectionDashArray: [4, 4],
//         selectionLineWidth: 1,
//         backgroundColor: 'transparent',
//       })

//     const guideline = new AlignGuidelines({
//       canvas: canvasInstance,
//     })

//     guideline.init()

//     if (!canvas) {
//       loadInitialData(canvasInstance)
//     }

//     resizeCanvas(
//       canvasContainerRef.current?.clientWidth || 0,
//       canvasContainerRef.current?.clientHeight || 0
//     )

//     canvasInstance.on('object:modified', (e) => {
//       // eslint-disable-next-line no-console
//       console.log('object modified', e)
//       saveToStorage(canvasInstance.toJSON())
//     })

//     canvasInstance.on('object:added', (e) => {
//       // eslint-disable-next-line no-console
//       console.log('object added', e)
//       saveToStorage(canvasInstance.toJSON())
//     })

//     canvasInstance.on('selection:created', (e) => {
//       // eslint-disable-next-line no-console
//       console.log('selection created', e)

//       if (e.target) {
//         setActiveObject(e.target)
//       }
//     })

//     canvasInstance.on('selection:updated', (e) => {
//       // eslint-disable-next-line no-console
//       console.log('selection updated', e)

//       if (e.target) {
//         setActiveObject(e.target)
//       }
//     })

//     canvasInstance.on('selection:cleared', () => {
//       // eslint-disable-next-line no-console
//       console.log('selection cleared')
//     })

//     setCanvas(canvasInstance)

//     // return () => {
//     //   canvasInstance.dispose()
//     //   setCanvas(null)
//     // }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const loadInitialData = (canvasInstance: Canvas) => {
//     if (frame.content.canvas) {
//       const json = JSON.parse(frame.content.canvas)

//       canvasInstance.loadFromJSON(json, () => {
//         canvasInstance.setBackgroundColor(
//           `${frame.config.backgroundColor || '#ffffff'}E6`,
//           () => {}
//         )
//         canvasInstance.renderAll()
//         setIsLoading(false)
//       })
//     } else {
//       loadTemplate(
//         canvasInstance,
//         frame.content.defaultTemplate || CANVAS_TEMPLATE_TYPES.BLANK
//       )
//       setIsLoading(false)
//     }
//   }

//   const resizeCanvas = (width: number, height: number) => {
//     if (!canvas) return

//     // canvas?.setDimensions({
//     //   width,
//     //   height,
//     // })

//     // const ratio = canvas.getWidth() / canvas.getHeight()
//     const containerWidth = width
//     const containerHeight = height

//     const scale = containerWidth / canvas.getWidth()
//     const zoom = canvas.getZoom() * scale
//     canvas.setDimensions({
//       width: containerWidth,
//       height: containerHeight, // containerWidth / ratio,
//     })
//     canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
//     canvas.renderAll()
//   }

//   return (
//     <div className="w-full h-full flex justify-center items-center m-auto relative">
//       {isLoading && (
//         <div className="absolute left-0 top-0 w-full h-full z-[1]">
//           <ContentLoading />
//         </div>
//       )}
//       <div className="flex flex-col gap-2 w-full">
//         <ResizeObserver
//           onResize={({ width, height }) => {
//             resizeCanvas?.(width, height)
//           }}>
//           <div
//             ref={canvasContainerRef}
//             className={cn(
//               'flex-auto w-full aspect-video m-auto bg-transparent rounded-sm overflow-hidden',
//               'border-2 border-black/10'
//             )}>
//             <canvas id={`canvas-${frame.id}`} className="w-full h-full" />
//           </div>
//         </ResizeObserver>
//       </div>
//     </div>
//   )
// }
