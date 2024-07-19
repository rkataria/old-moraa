import { useState } from 'react'

import { Button, ButtonGroup } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { DeleteFrameModal } from '../../DeleteFrameModal'

import { cn } from '@/utils/utils'

type FontSizeControlProps = {
  defaultCount?: number
  onCountChange: (size: number) => void
  isDisabled?: boolean
  incrementStep?: number
  postfixLabel?: string
  fullWidth?: boolean
  noNegative?: boolean
  isDeleteModal?: boolean
}

// TODO: Fix this component types whenever this is used.
export function TwoWayNumberCounter({
  defaultCount = 16,
  onCountChange: onFontSizeChange,
  isDisabled = false,
  incrementStep = 1,
  postfixLabel,
  fullWidth = false,
  noNegative = false,
  isDeleteModal = false,
}: FontSizeControlProps) {
  const [count, setCount] = useState<number>(defaultCount)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  // hotkeys
  useHotkeys('-', () => {
    const cal = count - incrementStep
    handleFontSizeChange(cal < 1 ? defaultCount : cal)
  })
  useHotkeys('-', () => {
    handleFontSizeChange(count + incrementStep)
  })

  const minusButtonDisabled = isDisabled || (noNegative && count < 2)

  const handleFontSizeChange = (newSize: number) => {
    setCount(newSize)
    onFontSizeChange(newSize)
  }

  const handleDelete = () => {
    const cal = count - incrementStep
    handleFontSizeChange(cal < 1 ? defaultCount : cal)
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <ButtonGroup radius="md" fullWidth={fullWidth}>
        <Button
          size="sm"
          variant="flat"
          className={cn('flex-none', {
            'bg-gray-200': minusButtonDisabled,
            'bg-gray-300': !minusButtonDisabled,
          })}
          disabled={minusButtonDisabled}
          onClick={() =>
            isDeleteModal
              ? setIsDeleteModalOpen(true)
              : handleFontSizeChange(count - incrementStep)
          }>
          -
        </Button>
        <input
          className={cn(
            'h-8 w-14 text-sm text-center border-y-2 border-gray-100 bg-white flex-none',
            {
              'bg-gray-200': isDisabled,
            }
          )}
          value={`${count}${postfixLabel || ''}`}
          disabled={isDisabled}
          onChange={(e) => handleFontSizeChange(+e.target.value)}
        />
        <Button
          size="sm"
          variant="flat"
          disabled={isDisabled}
          className={cn('flex-none', {
            'bg-gray-200': isDisabled,
            'bg-gray-300': !isDisabled,
          })}
          onClick={() => handleFontSizeChange(count + incrementStep)}>
          +
        </Button>
      </ButtonGroup>
      <DeleteFrameModal
        isModalOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
        }}
        handleDelete={handleDelete}
        frame={null}
      />
    </>
  )
}
