/* eslint-disable radix */
import { useEffect, useState } from 'react'

import { cn, Divider, Input } from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMdAdd } from 'react-icons/io'
import { LuMinus } from 'react-icons/lu'
import {
  MdChevronLeft,
  MdChevronRight,
  MdDownload,
  MdOutlineRotate90DegreesCcw,
} from 'react-icons/md'
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from 'react-icons/tb'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { Button } from '@/components/ui/Button'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IPdfView, IPdfViewChangeEvent, PdfView } from '@/hooks/usePdfControls'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'

interface IZoomControls {
  config: IPdfView
  onDisplayChange: (display: IPdfViewChangeEvent) => void
  downloadPdf: () => void
  currentPage: number
  totalPages?: number | null
  hideControls?: boolean
  handleCurrentPageChange: (pageNumber: number) => void
}

export function PdfControls({
  config,
  currentPage,
  totalPages,
  hideControls,
  handleCurrentPageChange,
  onDisplayChange,
  downloadPdf,
}: IZoomControls) {
  const currentFrame = useCurrentFrame()
  const [pageNumber, setPageNumber] = useState(currentPage)
  const { permissions } = useEventPermissions()

  useEffect(() => {
    setPageNumber(currentPage)
  }, [currentPage])

  const isSinglePagePdf = totalPages === 1

  const handlePrevious = () => {
    if (currentPage === 1) return

    handleCurrentPageChange(currentPage - 1)
    setPageNumber(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage === totalPages) return
    handleCurrentPageChange(currentPage + 1)
    setPageNumber(currentPage + 1)
  }

  useHotkeys('ArrowLeft', handlePrevious)

  useHotkeys('ArrowRight', handleNext)

  const downloadButtonVisible = () => {
    if (permissions.canUpdateFrame) return true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (currentFrame?.config as any)?.allowedDownloading
  }

  return (
    <div className="absolute left-[50%] translate-x-[-50%] top-0 shadow-md flex items-center gap-1 py-1 duration-300 rounded-xl border-1 border-gray-300 bg-white z-[10]">
      <RenderIf isTrue={!hideControls}>
        <Tooltip content="Previous page" placement="top">
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            radius="full"
            className={cn(
              'transition-all duration-200 cursor-pointer ring-0 bg-transparent',
              {
                'opacity-20 cursor-not-allowed': currentPage === 1,
              }
            )}
            disabled={currentPage === 1}
            onClick={handlePrevious}>
            <MdChevronLeft />
          </Button>
        </Tooltip>
        <div className="flex items-center">
          <Input
            isDisabled={isSinglePagePdf}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={pageNumber as any}
            type="number"
            className="w-[30px]"
            classNames={{
              inputWrapper: cn('!p-0 bg-gray-50 !h-[20px] !min-h-[20px] px-1', {
                'bg-transparent': isSinglePagePdf,
              }),
              input: 'text-center',
              base: '!opacity-100',
            }}
            onChange={(e) => setPageNumber(parseInt(e.target.value))}
            onBlur={(event) => {
              event.preventDefault()
              event.stopPropagation()
              handleCurrentPageChange(pageNumber)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                handleCurrentPageChange(pageNumber)
              }
            }}
          />
          <span className="mx-1">/</span>
          <p>{totalPages}</p>
        </div>
        <Tooltip content="Previous page" placement="top">
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            radius="full"
            className={cn(
              'transition-all duration-200 cursor-pointer ring-0 bg-transparent',
              {
                'opacity-20 cursor-not-allowed': totalPages === currentPage,
              }
            )}
            disabled={totalPages === currentPage}
            onClick={handleNext}>
            <MdChevronRight />
          </Button>
        </Tooltip>
        <Divider orientation="vertical" className="h-6" />
      </RenderIf>

      <Button
        variant="flat"
        isIconOnly
        size="sm"
        radius="full"
        className={cn(
          'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full'
        )}
        onClick={() => onDisplayChange({ action: 'zoom-out' })}>
        <LuMinus size={14} />
      </Button>
      <p className="text-xs w-[64px] text-center">
        {config.scale
          ? `${Math.floor(config.scale * 100)}%`
          : config.fitType === PdfView.FIT_TO_PAGE
            ? 'Fit to page'
            : 'Full page'}
      </p>

      <Button
        variant="flat"
        isIconOnly
        size="sm"
        radius="full"
        className={cn(
          'transition-all duration-300 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full'
        )}
        onClick={() => {
          onDisplayChange({ action: 'zoom-in' })
        }}>
        <IoMdAdd size={14} />
      </Button>

      <Divider orientation="vertical" className="h-6" />

      <div className="flex items-center">
        <Button
          variant="flat"
          isIconOnly
          size="sm"
          radius="full"
          className={cn(
            'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full text-gray-600'
          )}
          onClick={() =>
            onDisplayChange({
              action:
                config.fitType === PdfView.FIT_TO_PAGE
                  ? 'full-page'
                  : 'fit-to-page',
            })
          }>
          <RenderIf
            isTrue={config.fitType === PdfView.FULL_PAGE || !config.fitType}>
            <TbArrowAutofitHeight size={20} />
          </RenderIf>

          <RenderIf isTrue={config.fitType === PdfView.FIT_TO_PAGE}>
            <TbArrowAutofitWidth size={20} />
          </RenderIf>
        </Button>
        <Button
          variant="flat"
          isIconOnly
          size="sm"
          radius="full"
          className={cn(
            'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full text-gray-600'
          )}
          onClick={() =>
            onDisplayChange({
              action: 'rotate',
            })
          }>
          <MdOutlineRotate90DegreesCcw size={20} />
        </Button>

        <RenderIf isTrue={downloadButtonVisible()}>
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            radius="full"
            className={cn(
              'transition-all duration-200 cursor-pointer ring-0 hover:bg-gray-200 bg-transparent rounded-full text-gray-600'
            )}
            onClick={downloadPdf}>
            <MdDownload size={20} />
          </Button>
        </RenderIf>
      </div>
    </div>
  )
}
