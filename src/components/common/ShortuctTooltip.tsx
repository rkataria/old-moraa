import {
  Kbd,
  KbdKey,
  Tooltip as NextUiTooltip,
  TooltipProps as NextUiTooltipProps,
} from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'

import { RenderIf } from './RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export type TooltipComponentProps = {
  label?: string | ReactNode
  actionKey?: string
  content?: ReactNode
  isOpen?: boolean
  allowClosing?: boolean
}

export type TooltipProps = TooltipComponentProps &
  Omit<NextUiTooltipProps, 'content'>

export function Tooltip({
  children,
  label,
  actionKey,
  content,
  className,
  classNames,
  ...rest
}: TooltipProps) {
  const keysArray = actionKey?.split(' + ') || []

  return (
    <NextUiTooltip
      {...rest}
      delay={1500}
      content={
        content || (
          <div className="flex items-center gap-2 text-xs">
            {label}
            <RenderIf isTrue={!!actionKey}>
              <div className="flex items-center gap-2">
                {keysArray.map((key) => (
                  <Kbd
                    keys={key === 'alt' ? 'option' : (key as KbdKey)}
                    classNames={{
                      abbr: 'text-xs',
                      content: 'text-xs',
                      base: 'bg-gray-700 text-white rounded-[4px]',
                    }}>
                    {key === 'alt' ? 'Opt' : key}
                  </Kbd>
                ))}
              </div>
            </RenderIf>
          </div>
        )
      }
      radius="md"
      className={cn(
        'rounded-[4px] bg-gray-900 text-white max-w-sm',
        {
          'pr-1 pl-2': !!actionKey,
        },
        className
      )}
      classNames={{ base: 'before:bg-gray-900', ...classNames }}>
      {children}
    </NextUiTooltip>
  )
}
