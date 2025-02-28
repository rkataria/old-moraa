import { Button } from '@heroui/react'

import { useHotkeys } from '@/hooks/useHotkeys'

type NextPrevButtonsProps = {
  onPrevious: () => void
  onNext: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
}

export function NextPrevButtons({
  onPrevious,
  onNext,
  nextDisabled,
  prevDisabled,
}: NextPrevButtonsProps) {
  useHotkeys('ArrowLeft', () => {
    if (!prevDisabled) onPrevious()
  })
  useHotkeys('ArrowRight', () => {
    if (!nextDisabled) onNext()
  })

  return (
    <div className="flex justify-center items-center m-2">
      <Button
        variant="bordered"
        onClick={!prevDisabled ? onPrevious : undefined}
        disabled={prevDisabled}
        className="mx-2"
        size="sm">
        Prev
      </Button>
      <Button
        variant="bordered"
        onClick={!nextDisabled ? onNext : undefined}
        disabled={nextDisabled}
        className="mx-2"
        size="sm">
        Next
      </Button>
    </div>
  )
}
