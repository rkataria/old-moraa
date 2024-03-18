import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

import { cn } from '@nextui-org/react'

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
  const arrowLeft = useHotkeys('ArrowLeft', () => {
    if (currentPage === 1) return

    handleCurrentPageChange(currentPage - 1)
  })

  const arrowRight = useHotkeys('ArrowRight', () => {
    handleCurrentPageChange(currentPage + 1)
  })

  return (
    <>
      {currentPage !== 1 && (
        <div className="absolute left-0 top-[50%] z-10">
          <IconChevronLeft
            className={cn(
              'w-8 h-8 text-[#575656] hover:opacity-100 cursor-pointer',
              {
                'opacity-20': !arrowLeft,
              }
            )}
            onClick={() => handleCurrentPageChange(currentPage - 1)}
          />
        </div>
      )}
      {currentPage !== totalPages && (
        <div className="absolute right-0 top-[50%] z-10">
          <IconChevronRight
            className={cn(
              'w-8 h-8 text-[#575656] hover:opacity-100 cursor-pointer',
              {
                'opacity-20': !arrowRight,
              }
            )}
            onClick={() => handleCurrentPageChange(currentPage + 1)}
          />
        </div>
      )}
    </>
  )
}
