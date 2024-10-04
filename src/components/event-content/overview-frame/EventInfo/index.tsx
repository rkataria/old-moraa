import { EventDetails } from './EventDetails'

export function EventInfo() {
  return (
    <div className="flex flex-col gap-3 h-full w-full scrollbar-none relative z-[50]">
      <EventDetails />
      <br />
    </div>
  )
}
