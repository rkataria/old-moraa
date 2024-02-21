"use client"

import { useState } from "react"
import Modal from "./Modal"
import clsx from "clsx"
import PublishEventForm from "./PublishEventForm"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function PublishEventButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          "font-semibold text-sm bg-green-600 text-white hover:bg-green-500 !rounded-full px-4 cursor-pointer"
        )}
        title="Publish Event"
      >
        Publish
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-8 flex justify-start items-center gap-2">
          <h1 className="text-xl font-semibold leading-6 text-gray-900">
            Publish Event
          </h1>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Course
          </span>
        </div>
        <PublishEventForm eventId={eventId} onClose={() => setOpen(false)} />
      </Modal>
    </>
  )
}

export default PublishEventButtonWithModal
