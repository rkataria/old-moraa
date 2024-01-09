"use client"

import EventList from "@/components/events/EventList";
import { useModal } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { onOpen } = useModal();
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto"></div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            variant={"default"}
            onClick={() => onOpen("createEvent", { data: {} })}
          >
            Create New
          </Button>
        </div>
      </div>
      <EventList />
    </div>
  );
}
