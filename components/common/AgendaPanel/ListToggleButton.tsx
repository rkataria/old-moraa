import { BsGrid, BsList } from 'react-icons/bs'

import { Button, ButtonProps } from '@nextui-org/react'

import { useFeatureFlags } from '@/hooks/useFeatureFlags'

export function ListToggleButton({
  buttonProps,
  listDisplayMode,
  toggleListDisplayMode,
}: {
  buttonProps?: ButtonProps
  listDisplayMode: string
  toggleListDisplayMode: () => void
}) {
  const { flags } = useFeatureFlags()

  if (!flags?.show_frame_thumbnails) return null

  return (
    <Button
      {...buttonProps}
      size="md"
      variant="flat"
      isIconOnly
      onClick={toggleListDisplayMode}>
      {listDisplayMode === 'list' ? <BsGrid size={18} /> : <BsList size={18} />}
    </Button>
  )
}
