/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import clsx from 'clsx'

import { Modal } from './Modal'
import { NewEventForm } from './PublishEventForm'

const styles = {
  button: {
    default:
      'flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md',
  },
}

export function PublishEventButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          'font-semibold text-sm bg-green-600 text-white hover:bg-green-500 !rounded-full px-4 cursor-pointer'
        )}
        title="Publish Event">
        Publish
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Publish learning event"
        description="Set a date and time and make your content go live!">
        <NewEventForm eventId={eventId} onClose={() => setOpen(false)} />
      </Modal>
    </>
  )
}
