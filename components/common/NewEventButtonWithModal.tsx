"use client"

import { useState } from "react"
import Modal from "./Modal"
// import NewEventForm from "./NewEventForm";

function NewEventButtonWithModal() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
      >
        Create new
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

        {/* TODO: should be uncommented once chakra-ui related changes are done. */}
        {/* <NewEventForm onClose={() => setOpen(false)} /> */}
      </Modal>
    </>
  )
}

export default NewEventButtonWithModal
