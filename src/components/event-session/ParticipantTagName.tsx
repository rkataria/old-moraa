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
        'absolute bottom-2 left-2 w-fit h-6 p-1 text-white flex justify-center items-center'
      )}>
      {name}
    </div>
  )
}
