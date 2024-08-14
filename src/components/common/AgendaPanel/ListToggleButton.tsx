import { ButtonProps } from '@nextui-org/react'
import { BsGrid, BsList } from 'react-icons/bs'

import { Button } from '@/components/ui/Button'
import { useFlags } from '@/flags/client'

export function ListToggleButton({
  buttonProps,
  listDisplayMode,
  toggleListDisplayMode,
}: {
  buttonProps?: ButtonProps
  listDisplayMode: string
  toggleListDisplayMode: () => void
}) {
  const { flags } = useFlags()

  if (!flags?.show_frame_thumbnails) return null

  return (
    <Button
      {...buttonProps}
      size="sm"
      variant="flat"
      isIconOnly
      onClick={toggleListDisplayMode}>
      {listDisplayMode === 'list' ? <BsGrid size={16} /> : <BsList size={16} />}
    </Button>
  )
}
