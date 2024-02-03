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
    <div className="flex justify-center items-center mb-4 mt-2">
      <Button
        variant='outline'
        onClick={onPrevious}
        disabled={prevDisabled}
        colorScheme="secondary"
        className="mx-2"
      >
        Prev
      </Button>
      <Button
        variant='outline'
        onClick={onNext}
        disabled={nextDisabled}
        colorScheme="secondary"
        className="mx-2"
      >
        Next
      </Button>
    </div>
  )
}
