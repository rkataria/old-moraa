import NewEventButtonWithModal from "@/components/common/NewEventButtonWithModal"
import EventList from "@/components/events/EventList"

export default async function EventsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto"></div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <NewEventButtonWithModal />
        </div>
      </div>
      <EventList />
    </div>
  )
}
