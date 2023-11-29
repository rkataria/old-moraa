import Link from "next/link"
import React from "react"

function EventActionButtons() {
  return (
    <div>
      <Link
        href="/events/new"
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create Event
      </Link>
    </div>
  )
}

export default EventActionButtons
