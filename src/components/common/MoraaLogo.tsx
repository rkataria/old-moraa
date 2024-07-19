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
        <img className="h-8 w-auto" src="/logo-filled.svg" alt="learign site" />
      )
    }

    return (
      <img
        className="h-8 w-auto"
        src={color === 'default' ? '/logo.svg' : '/logo-brand-color.svg'}
        alt="learign site"
      />
    )
  }

  return (
    <div className={cn('flex h-16 shrink-0 items-center', className)}>
      {getLogo()}
    </div>
  )
}
