import { SquareFilledSvg } from './svg'

enum MORAA_SLIDE_SHAPE_TYPE {
  BASIC = 'Basic',
  LINES = 'Lines',
  BANNERS = 'Banners',
  CALLOUTS = 'Callouts',
  STARS_AND_BUBBLES = 'Stars & Bubbles',
  CLIPART = 'Clipart',
}

type MORAA_SLIDE_SHAPE = {
  label: string
  svg: string
  type: MORAA_SLIDE_SHAPE_TYPE
}

export const MORAA_SLIDE_SHAPES: MORAA_SLIDE_SHAPE[] = [
  {
    label: 'Square',
    svg: SquareFilledSvg,
    type: MORAA_SLIDE_SHAPE_TYPE.BASIC,
  },
  {
    label: 'Square Outlined',
    svg: SquareFilledSvg,
    type: MORAA_SLIDE_SHAPE_TYPE.BASIC,
  },
]
