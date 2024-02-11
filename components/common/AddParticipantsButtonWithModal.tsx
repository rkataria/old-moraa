"use client"

import { useState } from "react"
import Modal from "./Modal"
import clsx from "clsx"
import AddParticipantsForm from "./AddParticipantsForm"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function AddParticipantsButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          "cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full px-4"
        )}
      >
        Add Participants
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-8 flex justify-start items-center gap-2">
          <h1 className="text-xl font-semibold leading-6 text-gray-900">
            Create Event
          </h1>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Course
          </span>
        </div>
        <AddParticipantsForm eventId={eventId} onClose={() => setOpen(false)} />
      </Modal>
    </>
  )
}

export default AddParticipantsButtonWithModal
