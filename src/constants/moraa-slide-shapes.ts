import {
  CircleFilledSvg,
  CircleOutlinedSvg,
  DiamondFilledSvg,
  DiamondOutlinedSvg,
  SquareFilledSvg,
  SquareOutlinedSvg,
  StarFilledSvg,
  StarOutlinedSvg,
  TriangleFilledSvg,
  TriangleOutlinedSvg,
  SquareRoundFilledSvg,
  SquareRoundOutlinedSvg,
} from '@/assets/svg'
import { SHAPE_TYPES } from '@/components/common/content-types/MoraaSlide/ShapePicker/ShapePickerContent'

export const MORAA_SLIDE_SHAPES: {
  [key in SHAPE_TYPES]: { label: string; svg: string }[]
} = {
  Basic: [
    {
      label: 'Square',
      svg: SquareFilledSvg,
    },
    {
      label: 'Square Rounded',
      svg: SquareRoundFilledSvg,
    },
    {
      label: 'Circle',
      svg: CircleFilledSvg,
    },
    {
      label: 'Triangle',
      svg: TriangleFilledSvg,
    },
    {
      label: 'Diamond',
      svg: DiamondFilledSvg,
    },
    {
      label: 'Star',
      svg: StarFilledSvg,
    },
    {
      label: 'Square Outlined',
      svg: SquareOutlinedSvg,
    },
    {
      label: 'Square Rounded Outlined',
      svg: SquareRoundOutlinedSvg,
    },
    {
      label: 'Circle Outlined',
      svg: CircleOutlinedSvg,
    },
    {
      label: 'Triangle Outlined',
      svg: TriangleOutlinedSvg,
    },

    {
      label: 'Diamond Outlined',
      svg: DiamondOutlinedSvg,
    },
    {
      label: 'Star Outlined',
      svg: StarOutlinedSvg,
    },
  ],
  Lines: [],
  Banners: [],
  Callouts: [],
  'Stars & Bubbles': [],
  'Lines & Dividers': [],
  Clipart: [],
}
