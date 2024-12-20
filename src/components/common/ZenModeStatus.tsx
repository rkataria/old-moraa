/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useHotkeys } from 'react-hotkeys-hook'

import { useAppContext } from '@/hooks/useApp'
import { cn } from '@/utils/utils'

export function ZenModeStatus() {
  const { isZenMode, toggleZenMode } = useAppContext()

  useHotkeys('ctrl+shift+f', () => {
    toggleZenMode()
  })

  if (!isZenMode) return null

  return (
    <div
      className={cn(
        'fixed top-2 right-2 bg-black py-2 px-2 rounded-md text-sm text-white flex justify-center items-center gap-2'
      )}
      onClick={toggleZenMode}>
      Focus mode is enabled. Press{' '}
      <kbd className="text-black px-2 rounded-sm bg-white">ESC</kbd> or click
      here to disable.
    </div>
  )
}
