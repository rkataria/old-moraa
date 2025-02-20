import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { cn } from '@/utils/utils'

export function ParticipantTagName({
  participant,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
}) {
  const { name } = participant

  return (
    <div
      className={cn(
        'absolute bottom-[4%] left-[4%] w-fit max-w-[60%] line-clamp-1 flex-nowrap h-6 p-1 text-white text-left'
      )}>
      {name}
    </div>
  )
}
