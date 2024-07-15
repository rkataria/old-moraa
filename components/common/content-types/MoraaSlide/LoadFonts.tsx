import { fonts } from '@/app/fonts'

type FontFamilyOption = {
  key: string
  label: string
}

const FONT_FAMILIES: FontFamilyOption[] = [
  {
    label: 'Times New Roman',
    key: 'Times New Roman',
  },
  {
    label: 'Inter',
    key: fonts.inter.style.fontFamily,
  },
  {
    label: 'Roboto Mono',
    key: fonts.robotoMono.style.fontFamily,
  },
  {
    label: 'Tilt Warp',
    key: fonts.tiltWarp.style.fontFamily,
  },
  {
    label: 'Poppins',
    key: fonts.poppins.style.fontFamily,
  },
  {
    label: 'Roboto',
    key: fonts.roboto.style.fontFamily,
  },
  {
    label: 'Oswald',
    key: fonts.oswald.style.fontFamily,
  },
  {
    label: 'Permanent Marker',
    key: fonts.permanentMarker.style.fontFamily,
  },
]

export function LoadFonts() {
  return (
    <div>
      {FONT_FAMILIES.map((font) => (
        <span
          key={font.label}
          style={{
            fontFamily: font.key,
          }}
        />
      ))}
    </div>
  )
}
