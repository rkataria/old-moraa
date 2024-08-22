import { ButtonProps } from '@nextui-org/react'
import { BsGrid, BsList } from 'react-icons/bs'

import { Button } from '@/components/ui/Button'

export function ListToggleButton({
  buttonProps,
  listDisplayMode,
  toggleListDisplayMode,
}: {
  buttonProps?: ButtonProps
  listDisplayMode: string
  toggleListDisplayMode: () => void
}) {
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
