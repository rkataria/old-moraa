import { cn } from '@/utils/utils'

type MoraaLogoProps = {
  color?: 'primary' | 'default'
  filled?: boolean
  className?: string
}

export function MoraaLogo({
  color = 'default',
  filled = false,
  className,
}: MoraaLogoProps) {
  const getLogo = () => {
    if (filled) {
      return (
        <img
          className="h-6 w-auto"
          src="/moraa-logo-lowercase.svg"
          alt="Moraa Logo"
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
      />
    )
  }

  return (
    <div className={cn('flex h-16 shrink-0 items-center', className)}>
      {getLogo()}
    </div>
  )
}
