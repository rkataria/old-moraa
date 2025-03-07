import { FONT_FAMILIES } from '@/libs/fonts'

export function LoadFonts() {
  return (
    <div>
      {FONT_FAMILIES.map((font) => (
        <span
          key={font.label}
          style={{
            fontFamily: font.value,
          }}
        />
      ))}
    </div>
  )
}
