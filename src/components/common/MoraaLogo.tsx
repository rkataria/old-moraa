/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn } from '@/utils/utils'

type MoraaLogoProps = {
  color?: 'primary' | 'default'
  filled?: boolean
  className?: string
  onClick?: () => void
}

export function MoraaLogo({
  color = 'default',
  filled = false,
  className,
  onClick,
}: MoraaLogoProps) {
  const getLogo = () => {
    if (filled) {
      return (
        <img
          className="h-6 w-auto"
          src="/moraa-logo-lowercase.svg"
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
