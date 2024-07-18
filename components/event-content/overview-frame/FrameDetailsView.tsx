import { useParams } from 'next/navigation'

import { Image } from '@nextui-org/react'

import { Date } from '@/components/enroll/Date'
import { useEvent } from '@/hooks/useEvent'

function Dates({
  startDate,
  endDate,
  timeZone,
}: {
  startDate: string | undefined
  endDate: string | undefined
  timeZone: string | undefined
}) {
  if (!startDate || !endDate || !timeZone) return null

  return (
    <div className="flex items-center gap-10 mt-6">
      <Date date={startDate} timezone={timeZone} />
      <Date date={endDate} timezone={timeZone} />
    </div>
  )
}

export function FrameDetailsView() {
  const { eventId }: { eventId: string } = useParams()

  const useEventData = useEvent({
    id: eventId as string,
    validateWithUser: false,
  })

  const { event } = useEventData

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="grid grid-cols-[0.5fr_1fr] items-start gap-[3rem]">
        <Image
          src={
            event?.image_url ||
            'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
          }
          classNames={{
            wrapper: 'w-full h-full',
            img: 'w-full object-cover h-full rounded-3xl shadow-xl w-[20rem] h-[20rem]',
          }}
        />
        <div className="h-full flex flex-col justify-between">
          <div>
            <p className="text-5xl font-bold mb-4">{event.name}</p>
            <p className="text-slate-400 text-sm">{event.description}</p>
            <Dates
              startDate={event?.start_date}
              endDate={event?.end_date}
              timeZone={event?.timezone}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
