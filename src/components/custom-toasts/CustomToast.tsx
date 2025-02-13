/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { motion } from 'framer-motion'
import { IoIosClose } from 'react-icons/io'

import { RenderIf } from '../common/RenderIf/RenderIf'

import { cn } from '@/utils/utils'

type ToastProps = {
  visible: boolean
  icon?: React.ReactNode
  title?: string
  message: string
  onClose: () => void
}
export function CustomToast({
  visible,
  icon,
  title,
  message,
  onClose,
}: ToastProps) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 50 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: 50 }}
      className={cn(
        'relative max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 group',
        {
          'animate-enter': visible,
          'animate-leave': !visible,
        }
      )}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <RenderIf isTrue={!!icon}>
            <div className="flex-shrink-0 pt-0.5">{icon}</div>
          </RenderIf>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <button
        className="absolute h-6 w-6 -right-2 -top-2 bg-white shadow-lg rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onClose}>
        <IoIosClose size={28} />
      </button>
    </motion.div>
  )
}
