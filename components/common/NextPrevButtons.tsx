import { Button } from "@chakra-ui/react"
import React from "react"

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
  return (
    <div className="flex justify-center items-center m-2">
      <Button
        variant="outline"
        onClick={!prevDisabled ? onPrevious : undefined}
        disabled={prevDisabled}
        colorScheme="secondary"
        className="mx-2"
        size="sm"
      >
        Prev
      </Button>
      <Button
        variant="outline"
        onClick={!nextDisabled ? onNext : undefined}
        disabled={nextDisabled}
        colorScheme="secondary"
        className="mx-2"
        size="sm"
      >
        Next
      </Button>
    </div>
  )
}
