import { useState } from 'react'

import { ButtonProps } from '@nextui-org/button'
import { PiUsersThree } from 'react-icons/pi'

import { AssignParticipantsModal } from './AssignParticipantsModal'

import { Button } from '@/components/ui/Button'

type AssignParticipantsModalTriggerProps = {
  children?: React.ReactNode
  triggerProps?: ButtonProps
}

export function AssignParticipantsModalTrigger({
  children,
  triggerProps = {},
}: AssignParticipantsModalTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button isIconOnly onPress={() => setOpen(true)} {...triggerProps}>
        {children ?? <PiUsersThree size={18} />}
      </Button>
      <AssignParticipantsModal open={open} setOpen={setOpen} />
    </>
  )
}
