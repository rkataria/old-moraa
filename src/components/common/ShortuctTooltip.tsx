import {
  Kbd,
  KbdKey,
  Tooltip as NextUiTooltip,
  TooltipProps,
} from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'

import { RenderIf } from './RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export type TooltipComponentProps = {
  label?: string | ReactNode
  systemKeys?: KbdKey | KbdKey[]
  actionKey?: string
  content?: ReactNode
}

export function Tooltip({
  children,
  label,
  systemKeys = [],
  actionKey,
  content,
  ...rest
}: TooltipComponentProps & Omit<TooltipProps, 'content'>) {
  return (
    <NextUiTooltip
      {...rest}
      content={
        content || (
          <div className="flex items-center gap-2 text-xs">
            {label}
            <RenderIf isTrue={!!actionKey}>
              <Kbd
                keys={systemKeys}
                classNames={{
                  base: 'bg-gray-700 text-white rounded-sm',
                  content: 'text-xs',
                }}>
                {actionKey}
              </Kbd>
            </RenderIf>
          </div>
        )
      }
      radius="md"
      className={cn('rounded-[4px] bg-gray-900 text-white', {
        'pr-1 pl-2': !!actionKey,
      })}
      classNames={{ base: 'before:bg-gray-900' }}>
      {children}
    </NextUiTooltip>
  )
}
