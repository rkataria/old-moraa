import { BlurbEditor } from './BlurbEditor'
import { EventDetails } from './EventDetails'

export function EventInfo() {
  return (
    <div className="flex flex-col gap-3 h-full w-[56.25rem] mx-auto scrollbar-none relative z-[50]">
      <EventDetails />
      <BlurbEditor />
      <br />
    </div>
  )
}
