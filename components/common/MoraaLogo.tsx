type MoraaLogoProps = {
  color?: 'primary' | 'default'
}

export function MoraaLogo({ color = 'default' }: MoraaLogoProps) {
  return (
    <div className="flex h-16 shrink-0 items-center">
      <img
        className="h-8 w-auto"
        src={color === 'default' ? '/logo.svg' : '/logo-brand-color.svg'}
        alt="learign site"
      />
    </div>
  )
}
