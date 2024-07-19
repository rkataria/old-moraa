import { useUIState } from 'ai/rsc'

import { cn } from '@/utils/utils'

export function Converstations() {
  const [conversation] = useUIState()

  return (
    <div className="grid gap-2 px-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {conversation.map((message: any) => (
        <div
          key={message.id}
          className={cn(
            'relative before:absolute before:bottom-0 before:w-0 before:h-0 before:border-b-[10px] before:border-x-[10px] before:border-x-transparent before:border-solid',
            {
              'flex justify-end before:border-b-gray-200 before:bottom-0 before:-right-[9px]':
                message.role === 'user',
              'before:border-b-gray-100 before:bottom-0 before:-left-[9px]':
                message.role !== 'user',
            }
          )}>
          <p
            className={cn(
              'text-sm whitespace-pre-wrap px-4 py-3 rounded-md tracking-tight',
              {
                'text-right self-end  bg-gray-200': message.role === 'user',
                'bg-gray-100 text-gray-800 text-left self-start':
                  message.role !== 'user',
              }
            )}>
            {message.display}
          </p>
        </div>
      ))}
    </div>
  )
}
