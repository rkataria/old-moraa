import { BlurbEditor } from './BlurbEditor'
import { EventDetails } from './EventDetails'

export function EventInfo() {
  return (
    <div className="flex flex-col gap-3 h-full w-[900px] mx-auto scrollbar-none">
      <EventDetails />
      <BlurbEditor />
    </div>
  )
}
