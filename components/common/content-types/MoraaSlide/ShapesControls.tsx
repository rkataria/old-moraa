/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import { useContext } from 'react'

import { fabric } from 'fabric'
import { RiShapesLine } from 'react-icons/ri'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

type Shape = {
  name: string
  svg: string
  path: string
  scale: number
  rotate?: number
}

// https://www.svgshapes.in/
const SHAPES: Shape[] = [
  {
    name: 'shape-1',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 51 42"><path fill="#000" d="M50.1 31.9c0 .5-3.1.5-3.3 1-.2.5 2.3 2.4 2 2.8-.3.4-2.9-1.3-3.3-.9-.4.3.7 3.3.2 3.5-3.2 1.1-7.2-1-10.5-.4s-6.4 3.9-9.7 3.9c-3.3 0-6.4-3.4-9.7-3.9-3.3-.6-7.3 1.6-10.5.4-.5-.2.6-3.1.2-3.5-.4-.3-3 1.3-3.3.9-.3-.4 2.2-2.3 2-2.8-.2-.5-3.3-.5-3.3-1 0-1.8 3.1-3.5 3.1-5.3C4 24.8.9 23.1.9 21.3.9 19.5 4 17.8 4 16 4 14.2.9 12.5.9 10.7c0-.5 3.1-.5 3.3-1 .2-.5-2.3-2.4-2-2.8.3-.4 2.9 1.3 3.3.9.4-.3-.7-3.3-.2-3.5 3.2-1.1 7.2 1 10.5.4S22.2.8 25.5.8c3.3 0 6.4 3.4 9.7 3.9 3.3.6 7.3-1.6 10.5-.4.5.2-.6 3.1-.2 3.5.4.3 3-1.3 3.3-.9.3.4-2.2 2.3-2 2.8.2.5 3.3.5 3.3 1 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.5 3.1 5.3 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.6 3.1 5.3Z"></path></svg>',
    path: 'M50.1 31.9c0 .5-3.1.5-3.3 1-.2.5 2.3 2.4 2 2.8-.3.4-2.9-1.3-3.3-.9-.4.3.7 3.3.2 3.5-3.2 1.1-7.2-1-10.5-.4s-6.4 3.9-9.7 3.9c-3.3 0-6.4-3.4-9.7-3.9-3.3-.6-7.3 1.6-10.5.4-.5-.2.6-3.1.2-3.5-.4-.3-3 1.3-3.3.9-.3-.4 2.2-2.3 2-2.8-.2-.5-3.3-.5-3.3-1 0-1.8 3.1-3.5 3.1-5.3C4 24.8.9 23.1.9 21.3.9 19.5 4 17.8 4 16 4 14.2.9 12.5.9 10.7c0-.5 3.1-.5 3.3-1 .2-.5-2.3-2.4-2-2.8.3-.4 2.9 1.3 3.3.9.4-.3-.7-3.3-.2-3.5 3.2-1.1 7.2 1 10.5.4S22.2.8 25.5.8c3.3 0 6.4 3.4 9.7 3.9 3.3.6 7.3-1.6 10.5-.4.5.2-.6 3.1-.2 3.5.4.3 3-1.3 3.3-.9.3.4-2.2 2.3-2 2.8.2.5 3.3.5 3.3 1 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.5 3.1 5.3 0 1.8-3.1 3.5-3.1 5.3 0 1.8 3.1 3.6 3.1 5.3Z',
    scale: 2,
  },
  {
    name: 'shape-2',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 53 53"><path fill="#000" d="M52.1 26.5c0 3.2-4.3 5.6-5.5 8.4-1.2 2.9.1 7.6-2.1 9.8-2.2 2.2-6.9.9-9.8 2.1-2.8 1.2-5.2 5.5-8.4 5.5s-5.6-4.3-8.4-5.5c-2.9-1.2-7.6.1-9.8-2.1-2.2-2.2-.9-6.9-2.1-9.8C4.8 32.1.5 29.7.5 26.5s4.3-5.6 5.5-8.4c1.2-2.9-.1-7.6 2.1-9.8 2.2-2.2 6.9-.9 9.8-2.1C20.7 5 23.1.7 26.3.7s5.6 4.3 8.4 5.5c2.9 1.2 7.6-.1 9.8 2.1 2.2 2.2.9 6.9 2.1 9.8 1.2 2.8 5.5 5.2 5.5 8.4Z"></path></svg>',
    path: 'M52.1 26.5c0 3.2-4.3 5.6-5.5 8.4-1.2 2.9.1 7.6-2.1 9.8-2.2 2.2-6.9.9-9.8 2.1-2.8 1.2-5.2 5.5-8.4 5.5s-5.6-4.3-8.4-5.5c-2.9-1.2-7.6.1-9.8-2.1-2.2-2.2-.9-6.9-2.1-9.8C4.8 32.1.5 29.7.5 26.5s4.3-5.6 5.5-8.4c1.2-2.9-.1-7.6 2.1-9.8 2.2-2.2 6.9-.9 9.8-2.1C20.7 5 23.1.7 26.3.7s5.6 4.3 8.4 5.5c2.9 1.2 7.6-.1 9.8 2.1 2.2 2.2.9 6.9 2.1 9.8 1.2 2.8 5.5 5.2 5.5 8.4Z',
    scale: 2,
  },
  {
    name: 'shape-3',
    svg: '<svg xmlns="http://www.w3.org/2000/svg"  x="0" y="0" version="1.1" viewBox="0 0 499.772 499.772" width="100" height="100"><path d="M492.692 223.646 394.345 52.979a53.123 53.123 0 0 0-46.08-26.667H151.572a53.12 53.12 0 0 0-46.08 26.027L7.145 223.006a53.333 53.333 0 0 0 0 53.333l98.347 170.667a53.332 53.332 0 0 0 46.08 26.453h196.693a53.334 53.334 0 0 0 46.08-25.813l98.347-170.667a53.76 53.76 0 0 0 0-53.333z" fill="#000"></path></svg>',
    path: 'M492.692 223.646 394.345 52.979a53.123 53.123 0 0 0-46.08-26.667H151.572a53.12 53.12 0 0 0-46.08 26.027L7.145 223.006a53.333 53.333 0 0 0 0 53.333l98.347 170.667a53.332 53.332 0 0 0 46.08 26.453h196.693a53.334 53.334 0 0 0 46.08-25.813l98.347-170.667a53.76 53.76 0 0 0 0-53.333z',
    scale: 0.2,
  },
  {
    name: 'shape-4',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" x="0" y="0" version="1.1" viewBox="0 0 494.148 494.148" width="200" height="200"><path d="M405.284 201.188 130.804 13.28C118.128 4.596 105.356 0 94.74 0 74.216 0 61.52 16.472 61.52 44.044v406.124c0 27.54 12.68 43.98 33.156 43.98 10.632 0 23.2-4.6 35.904-13.308l274.608-187.904c17.66-12.104 27.44-28.392 27.44-45.884.004-17.48-9.664-33.764-27.344-45.864z" fill="#000"></path></svg>',
    path: 'M405.284 201.188 130.804 13.28C118.128 4.596 105.356 0 94.74 0 74.216 0 61.52 16.472 61.52 44.044v406.124c0 27.54 12.68 43.98 33.156 43.98 10.632 0 23.2-4.6 35.904-13.308l274.608-187.904c17.66-12.104 27.44-28.392 27.44-45.884.004-17.48-9.664-33.764-27.344-45.864z',
    scale: 0.2,
    rotate: -90,
  },
  {
    name: 'shape-5',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" version="1.1" viewBox="0 0 497.502 497.502" width="100" height="100"><path d="M433.498.009H65.071A64.21 64.21 0 0 0 63.996 0C28.649.005 0 28.663.004 64.009v368.427c.117 35.887 29.18 64.95 65.067 65.067h368.427c35.469-.695 63.891-29.591 64-65.067V64.009c0-35.346-28.654-64-64-64z" fill="#000"></path></svg>',
    path: 'M433.498.009H65.071A64.21 64.21 0 0 0 63.996 0C28.649.005 0 28.663.004 64.009v368.427c.117 35.887 29.18 64.95 65.067 65.067h368.427c35.469-.695 63.891-29.591 64-65.067V64.009c0-35.346-28.654-64-64-64z',
    scale: 0.2,
  },
]

export function ShapesControls() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  function addShape(shape: Shape) {
    if (!canvas) return

    canvas.isDrawingMode = false
    canvas.selection = true

    const path = new fabric.Path(shape.path, {
      scaleX: shape.scale,
      scaleY: shape.scale,
      originX: 'center',
      originY: 'center',
    })

    path.set({ left: 50, top: 50 })
    path.rotate(shape.rotate || 0)
    canvas.add(path)
    canvas.viewportCenterObject(path)

    canvas.setActiveObject(path)
    canvas.renderAll()

    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          variant="light"
          size="lg"
          radius="md"
          isIconOnly
          className="flex-none flex flex-col justify-center items-center gap-1">
          <RiShapesLine size={18} />
          <span className="text-xs mt-1">Shapes</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2 flex justify-start items-start flex-wrap gap-2">
          {SHAPES.map((shape) => (
            // eslint-disable-next-line react/no-danger
            <div
              className="h-12 w-12 bg-gray-50 cursor-pointer"
              onClick={() => addShape(shape)}>
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(shape.svg)}`}
                alt={shape.name}
                style={{
                  transform: `rotate(${shape.rotate || 0}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
