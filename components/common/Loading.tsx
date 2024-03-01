import React from 'react'

import { IconLoader } from '@tabler/icons-react'

export function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <IconLoader className="animate-spin" />
    </div>
  )
}
