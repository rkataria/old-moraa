import { Button, cn } from '@heroui/react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

import { Tooltip } from './ShortuctTooltip'

import { useHotkeys } from '@/hooks/useHotkeys'

interface PageControlsProps {
  currentPage: number
  totalPages?: number | null
  handleCurrentPageChange: (pageNumber: number) => void
}

export function PageControls({
  currentPage,
  totalPages,
  handleCurrentPageChange,
}: PageControlsProps) {
  const handlePrevious = () => {
    if (currentPage === 1) return

    handleCurrentPageChange(currentPage - 1)
  }

  const handleNext = () => {
    handleCurrentPageChange(currentPage + 1)
  }

  const arrowLeft = useHotkeys('ArrowLeft', handlePrevious)

  const arrowRight = useHotkeys('ArrowRight', handleNext)

  return (
    <div className={cn('absolute right-2 top-2 flex gap-1 z-[100]')}>
      <Tooltip content="Previous page" placement="top">
        <Button
          variant="flat"
          isIconOnly
          size="sm"
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': currentPage > 1 && arrowLeft,
            'opacity-20 cursor-not-allowed': currentPage === 1,
          })}
          disabled={currentPage === 1}
          onClick={handlePrevious}>
          <IconChevronLeft />
        </Button>
      </Tooltip>
      <Tooltip content="Next page" placement="top">
        <Button
          variant="flat"
          isIconOnly
          size="sm"
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': totalPages !== currentPage && arrowRight,
            'opacity-20 cursor-not-allowed': totalPages === currentPage,
          })}
          onClick={handleNext}>
          <IconChevronRight />
        </Button>
      </Tooltip>
    </div>
  )
}
