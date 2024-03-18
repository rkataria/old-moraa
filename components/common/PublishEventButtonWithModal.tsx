/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import clsx from 'clsx'
import { Edit } from 'lucide-react'

import { Button } from '@nextui-org/react'

import { EditEventForm } from './EditEventForm'
import { Modal } from './Modal'

const styles = {
  button: {
    default:
      'flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md',
  },
}

export function EditEventButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          'cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full p-3'
        )}
        title="Publish Event">
        <Edit />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit event information"
        description="Change event name, description, date and time.">
        <EditEventForm eventId={eventId} onClose={() => setOpen(false)} />
      </Modal>
    </>
  )
}
