/* eslint-disable react/button-has-type */
import toast, { type Toast } from 'react-hot-toast'
import { RiTimerFlashFill } from 'react-icons/ri'

import { CustomToast } from './CustomToast'

type TimerEndedToastProps = {
  t: Toast
}

export function TimerEndedToast({ t }: TimerEndedToastProps) {
  return (
    <CustomToast
      visible={t.visible}
      icon={<RiTimerFlashFill size={44} color="red" />}
      title="Time Ended"
      message="Your time is up!"
      onClose={() => toast.dismiss(t.id)}
    />
  )
}
