import { useContext, useEffect, useState } from 'react'

import { fabric } from 'fabric'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import { BiMinusBack } from 'react-icons/bi'
import { FaRegClone } from 'react-icons/fa'
import { IoImageOutline } from 'react-icons/io5'
import {
  MdFormatColorFill,
  MdFormatColorText,
  MdFormatShapes,
  MdOutlineDeleteOutline,
  MdOutlineDraw,
} from 'react-icons/md'
import { RiShapesLine, RiSendBackward } from 'react-icons/ri'
import { RxCursorArrow } from 'react-icons/rx'

import { BackgroundControlsModal } from './BackgroundControlsModal'
import { CanvasFrameContext, CanvasFrameContextType } from './CanvasProvider'
import { FontControls } from './FontControls'
import { TextAlignControls } from './TextAlignControls'
import { TextStyleControls } from './TextStyleControls'
import { ColorPicker } from '../../ColorPicker'
import { ControlButton } from '../../ControlButton'

import { FileUploader } from '@/components/event-content/FileUploader'
import { cn } from '@/utils/utils'

// type ToolbarStates = {
//   addTextbox?: boolean
//   addBulletlist?: boolean
//   addOrderedlist?: boolean
// }

function addShape(shape: string, canvas: fabric.Canvas) {
  switch (shape) {
    case 'circle':
      // eslint-disable-next-line no-case-declarations
      const circle = new fabric.Circle({
        radius: 20,
        fill: 'red',
        left: 200,
        top: 200,
      })

      canvas?.add(circle)
      break
    default:
      break
  }
}

export function Toolbars() {
  const { canvas } = useContext(CanvasFrameContext) as CanvasFrameContextType
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null)
  // const [states, setStates] = useState<ToolbarStates>({})

  useEffect(() => {
    canvas?.on('selection:created', () => {
      setActiveObject(canvas.getActiveObject())
    })

    canvas?.on('selection:updated', () => {
      setActiveObject(canvas.getActiveObject())
    })

    canvas?.on('selection:cleared', () => {
      setActiveObject(null)
    })

    canvas?.on('mouse:down', (options) => {
      if (options.target == null) {
        // if (states.addTextbox) addTextbox(options.e)
        // if (states.addBulletlist) addList('bullet')
        // if (states.addOrderedlist) addList('number')
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas])

  if (!canvas) return null

  const renderControls = () => {
    if (activeObject?.type === 'textbox') {
      return (
        <>
          <FontControls />
          <ControlButton
            tooltipProps={{
              content: 'Fill',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none flex gap-1 justify-center items-center',
            }}
            onClick={() => {}}>
            <MdFormatColorFill size={18} />
            <ColorPicker
              defaultColor={activeObject?.backgroundColor as string}
              onchange={(color) => {
                activeObject?.set('backgroundColor', color)
                canvas?.renderAll()
              }}
            />
          </ControlButton>
          <ControlButton
            tooltipProps={{
              content: 'Text Color',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none flex gap-1 justify-center items-center',
            }}
            onClick={() => {}}>
            <MdFormatColorText size={18} />
            <ColorPicker
              defaultColor={activeObject?.fill as string}
              onchange={(color) => {
                activeObject?.set('fill', color)
                canvas?.renderAll()
              }}
            />
          </ControlButton>
          <TextAlignControls />
          <TextStyleControls />
        </>
      )
    }

    if (activeObject?.type === 'image') {
      return null
    }

    if (activeObject) {
      return (
        <ControlButton
          tooltipProps={{
            content: 'Fill',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none flex gap-1 justify-center items-center',
          }}
          onClick={() => {}}>
          <MdFormatColorFill size={18} />
          <ColorPicker
            defaultColor={activeObject?.fill as string}
            onchange={(color) => {
              activeObject?.set('fill', color)
              canvas?.renderAll()
            }}
          />
        </ControlButton>
      )
    }

    return (
      <>
        {/* Select Element */}
        <ControlButton
          tooltipProps={{
            content: 'Select',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none',
          }}
          onClick={() => {}}>
          <RxCursorArrow size={18} />
        </ControlButton>

        {/* Image Insert */}
        <FileUploader
          onFilesUploaded={(urls) => {
            const url = urls?.[0]?.signedUrl

            if (!url) return

            fabric.Image.fromURL(url, (img) => {
              img.set({
                left: 100,
                top: 100,
              })
              img.scaleToWidth(100)
              img.set('centeredRotation', true)
              canvas?.add(img)
              canvas.setActiveObject(img)
            })
          }}
          triggerProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none',
            children: <IoImageOutline size={18} />,
          }}
        />

        {/* Textbox */}
        <ControlButton
          tooltipProps={{
            content: 'Textbox',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: cn('flex-none', {
              // 'bg-black/90 text-white': states.addTextbox,
            }),
          }}
          onClick={() => {
            addTextbox({ offsetX: 100, offsetY: 100 } as MouseEvent)
          }}>
          <MdFormatShapes size={18} />
        </ControlButton>

        {/* Orderedlist */}
        {/* <ControlButton
          tooltipProps={{
            content: 'Ordered List',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: cn('flex-none', {
              'bg-black/90 text-white': states.addOrderedlist,
            }),
          }}
          onClick={() => {
            setStates((prev) => ({
              ...prev,
              addOrderedlist: !prev.addOrderedlist,
            }))
          }}>
          <BsListOl size={18} />
        </ControlButton> */}

        {/* Bulletlist */}
        {/* <ControlButton
          tooltipProps={{
            content: 'Ordered List',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: cn('flex-none', {
              'bg-black/90 text-white': states.addBulletlist,
            }),
          }}
          onClick={() => {
            setStates((prev) => ({
              ...prev,
              addBulletlist: !prev.addBulletlist,
            }))
          }}>
          <BsListOl size={18} />
        </ControlButton> */}

        <ControlButton
          tooltipProps={{
            content: 'Shapes',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: 'flex-none',
          }}
          onClick={() => {
            addShape('circle', canvas)
          }}>
          <RiShapesLine size={18} />
        </ControlButton>
        <ControlButton
          tooltipProps={{
            content: 'Draw',
          }}
          buttonProps={{
            variant: 'flat',
            size: 'sm',
            radius: 'md',
            className: cn('flex-none', {
              'bg-black/90 text-white': canvas.isDrawingMode,
            }),
          }}
          onClick={() => {
            // eslint-disable-next-line no-param-reassign
            canvas.isDrawingMode = !canvas.isDrawingMode
          }}>
          <MdOutlineDraw size={18} />
        </ControlButton>
        <BackgroundControlsModal onClose={() => {}} />
      </>
    )
  }

  const addTextbox = (e: MouseEvent) => {
    const textbox = new fabric.Textbox('Type text here', {
      fontFamily: 'sans-serif',
      fontSize: 16,
      left: e.offsetX,
      top: e.offsetY,
      width: 250,
      fill: '#fff',
      backgroundColor: '##000',
      padding: 10,
    })

    canvas?.add(textbox)
    canvas?.setActiveObject(textbox)
  }

  // const addList = (listType: 'bullet' | 'number') => {
  //   const textbox = new fabric.Textbox('This is a bullet item', {
  //     fontSize: 16,
  //     left: 100,
  //     top: 100,
  //     width: 350,
  //     fontFamily: 'sans-serif',
  //     fill: 'black',
  //     objectCaching: false,
  //     listType,
  //     listCounter: 0,
  //     listBullet: '•',
  //   }) as fabric.Textbox & {
  //     listType: 'bullet' | 'number'
  //     listCounter: number
  //     listBullet: string
  //   }
  //   textbox._renderTextLine = (method, ctx, line, left, top, lineIndex) => {
  //     const style0 = textbox.getCompleteStyleDeclaration(lineIndex, 0)
  //     const bullet =
  //       textbox.listType === 'bullet'
  //         ? [textbox.listBullet]
  //         : [`${textbox.listCounter + 1}.`]
  //     const bulletLeft = left - style0.fontSize - 2

  //     if (line.length) {
  //       if (!textbox.isWrapping) {
  //         // render the bullet
  //         textbox._renderChars(method, ctx, bullet, bulletLeft, top, lineIndex)
  //         textbox.isWrapping = !textbox.isEndOfWrapping(lineIndex)
  //         // eslint-disable-next-line no-plusplus
  //         if (!textbox.isWrapping) textbox.listCounter++
  //       } else if (textbox.isEndOfWrapping(lineIndex)) {
  //         textbox.isWrapping = false
  //         // eslint-disable-next-line no-plusplus
  //         textbox.listCounter++
  //       }
  //     }
  //     if (lineIndex === textbox.textLines.length - 1) {
  //       textbox.isWrapping = false
  //       textbox.listCounter = 0
  //     }
  //     // render the text line
  //     textbox._renderChars(method, ctx, line as string, left, top, lineIndex)
  //   }

  //   canvas?.add(textbox)
  //   canvas?.setActiveObject(textbox)
  //   textbox.enterEditing()
  // }

  if (!canvas) return null

  return (
    <div className="bg-white p-2 rounded-sm flex justify-start items-center gap-2 max-w-full overflow-auto scrollbar-none">
      {renderControls()}
      {activeObject && (
        <>
          <ControlButton
            tooltipProps={{
              content: 'Rotate left',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
            }}
            onClick={() => {
              const currentAngle = activeObject.angle || 0
              activeObject.set('angle', currentAngle - 90)
              canvas.renderAll()
            }}>
            <AiOutlineRotateLeft size={18} />
          </ControlButton>
          <ControlButton
            tooltipProps={{
              content: 'Rotate right',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
            }}
            onClick={() => {
              const currentAngle = activeObject.angle || 0
              activeObject.set('angle', currentAngle + 90)
              canvas.renderAll()
            }}>
            <AiOutlineRotateRight size={18} />
          </ControlButton>
          <ControlButton
            tooltipProps={{
              content: 'Move to front',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
            }}
            onClick={() => {
              canvas?.bringToFront(activeObject)
            }}>
            <RiSendBackward size={18} />
          </ControlButton>
          <ControlButton
            tooltipProps={{
              content: 'Move to back',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
            }}
            onClick={() => {
              canvas?.sendToBack(activeObject)
            }}>
            <BiMinusBack size={18} />
          </ControlButton>

          <ControlButton
            tooltipProps={{
              content: 'Duplicate element',
            }}
            buttonProps={{
              variant: 'flat',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
            }}
            onClick={() => {
              activeObject.clone((cloned: fabric.Object) => {
                // eslint-disable-next-line no-param-reassign
                if (cloned.left) cloned.left += 10
                // eslint-disable-next-line no-param-reassign
                if (cloned.top) cloned.top += 10
                canvas.add(cloned)
                canvas.setActiveObject(cloned)
              })
            }}>
            <FaRegClone size={18} />
          </ControlButton>
          <ControlButton
            tooltipProps={{
              content: 'Delete element',
            }}
            buttonProps={{
              variant: 'solid',
              size: 'sm',
              radius: 'md',
              className: 'flex-none',
              color: 'danger',
            }}
            onClick={() => {
              canvas?.remove(activeObject)
              canvas?.renderAll()
            }}>
            <MdOutlineDeleteOutline size={18} />
          </ControlButton>
        </>
      )}
    </div>
  )
}
