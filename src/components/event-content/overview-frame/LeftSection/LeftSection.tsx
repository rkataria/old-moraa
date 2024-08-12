import { BlurbEditor } from './BlurbEditor'
import { EventDetails } from './EventDetails'

export function LeftSection() {
  return (
    <div className="flex flex-col h-full gap-6">
      <EventDetails />
      <BlurbEditor />
    </div>
  )
}
