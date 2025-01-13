type FontFamilyOption = {
  label: string
  value: string
  weights: number[]
}

export const FONT_FAMILIES: FontFamilyOption[] = [
  {
    label: 'Poppins',
    value: 'Poppins',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Inter',
    value: 'Inter',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Outfit',
    value: 'Outfit',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Montserrat',
    value: 'Montserrat',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Lobster',
    value: 'Lobster',
    weights: [400],
  },
  {
    label: 'Monoton',
    value: 'Monoton',
    weights: [400],
  },
  {
    label: 'Tilt Warp',
    value: 'Tilt Warp',
    weights: [400],
  },
  {
    label: 'Roboto',
    value: 'Roboto',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: 'Oswald',
    value: 'Oswald',
    weights: [200, 300, 400, 500, 600, 700],
  },
  {
    label: 'Permanent Marker',
    value: 'Permanent Marker',
    weights: [400],
  },
]

export const DEFAULT_FONT_FAMILY = FONT_FAMILIES[0].value
