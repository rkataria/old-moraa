/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */
import { MORAA_SLIDE_SHAPES } from '@/constants/moraa-slide-shapes'

export enum SHAPE_TYPES {
  BASIC = 'Basic',
  LINES = 'Lines',
  BANNERS = 'Banners',
  CALLOUTS = 'Callouts',
  STARS_AND_BUBBLES = 'Stars & Bubbles',
  LINES_AND_DIVIDERS = 'Lines & Dividers',
  CLIPART = 'Clipart',
}

type ShapePickerContentProps = {
  shapeType: SHAPE_TYPES
  onSelect: (svg: string) => void
}

export function ShapePickerContent({
  shapeType,
  onSelect,
}: ShapePickerContentProps) {
  console.log('selected shape type:', shapeType)

  const shapeTypes = Object.keys(MORAA_SLIDE_SHAPES) as SHAPE_TYPES[]

  return (
    <div className="h-full overflow-hidden overflow-y-auto scrollbar scrollbar-none">
      {shapeTypes.map((type: SHAPE_TYPES, index: number) => {
        const shapeCount = MORAA_SLIDE_SHAPES[type].length

        if (shapeCount === 0) {
          return null
        }

        return (
          <div key={`${type}-${index}`}>
            <h3 className="font-semibold">{type}</h3>
            <div className="grid grid-cols-6 place-items-center gap-8 py-4">
              {MORAA_SLIDE_SHAPES[type].map((shape, shapeIndex: number) => (
                <div
                  key={`${shape.label}-${shapeIndex}`}
                  onClick={() => onSelect(shape.svg)}>
                  <img
                    src={shape.svg}
                    alt={shape.label}
                    className="w-12 h-12"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
