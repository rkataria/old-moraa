import { EventDetails } from './EventDetails'

export function EventInfo() {
  return (
    <div className="flex flex-col gap-3 h-full w-[76.25rem] scrollbar-none relative z-[50]">
      <EventDetails />

      <br />
    </div>
  )
}
