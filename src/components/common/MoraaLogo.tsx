/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn } from '@/utils/utils'

type MoraaLogoProps = {
  color?: 'primary' | 'default'
  logoOnly?: boolean
  className?: string
  onClick?: () => void
}

export function MoraaLogo({
  color = 'default',
  logoOnly = false,
  className,
  onClick,
}: MoraaLogoProps) {
  const getLogo = () => {
    if (logoOnly) {
      return (
        <img
          className="h-6 w-auto scale-125"
          src={color === 'default' ? '/logo-only-white.svg' : '/logo-only.svg'}
          alt="Moraa Logo"
          onClick={onClick}
        />
      )
    }

    return (
      <img
        className="h-6 w-auto"
        src={
          color === 'default'
            ? '/moraa-logo-lowercase-white.svg'
            : '/moraa-logo-lowercase.svg'
        }
        alt="Moraa Logo"
        onClick={onClick}
      />
    )
  }

  return (
    <div className={cn('flex shrink-0 items-center', className)}>
      {getLogo()}
    </div>
  )
}
