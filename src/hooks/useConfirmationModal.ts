import { useContext } from 'react'

import { ConfirmationModalContext } from '@/contexts/ConfirmationModalContext'

export function useConfirmationModal() {
  const context = useContext(ConfirmationModalContext)
  if (!context) {
    throw new Error(
      'useConfirmationModal must be used within a ConfirmationModalProvider'
    )
  }

  return context
}
