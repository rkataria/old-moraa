/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactNode, useState } from 'react'

import {
  Modal,
  Input,
  Button,
  Tooltip,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from '@heroui/react'
import { IoTrashBinOutline } from 'react-icons/io5'

import { cn } from '@/utils/utils'

export type Hotspot = {
  x: number
  y: number
  text: string
}

type HotspotImageWrapperProps = {
  hotspots: Hotspot[]
  onHotspotCreate?: (newHotspot: Hotspot) => void
  onHotspotDelete?: (deletedHotspot: Hotspot) => void
  hideExistingHotspots?: boolean
  disableAddHotspot?: boolean
  children: (props: {
    handleImageClick: (e: React.MouseEvent<HTMLImageElement>) => void
  }) => ReactNode
}

export function HotspotImageWrapper({
  hotspots,
  onHotspotCreate,
  onHotspotDelete,
  hideExistingHotspots = false,
  disableAddHotspot = false,
  children,
}: HotspotImageWrapperProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [newHotspotPosition, setNewHotspotPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [hotspotText, setHotspotText] = useState('')

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (disableAddHotspot) return
    const target = event.target as HTMLImageElement
    if (!target.closest('.hotspot-wrapper')) {
      return
    }

    const { offsetX, offsetY } = event.nativeEvent
    const { naturalWidth, naturalHeight, width, height } = target

    const scaleX = width / naturalWidth
    const scaleY = height / naturalHeight

    const visibleWidth = naturalWidth * Math.min(scaleX, scaleY)
    const visibleHeight = naturalHeight * Math.min(scaleX, scaleY)

    const paddingX = (width - visibleWidth) / 2
    const paddingY = (height - visibleHeight) / 2

    // Check if the click is within the visible image area
    if (
      offsetX >= paddingX &&
      offsetX <= paddingX + visibleWidth &&
      offsetY >= paddingY &&
      offsetY <= paddingY + visibleHeight
    ) {
      const rect = target.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      setNewHotspotPosition({ x, y })
      setTooltipVisible(true)
    }
  }

  const handleTempHubspotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setNewHotspotPosition(null)
    setTooltipVisible(false)
  }

  const handleHotspotCreate = () => {
    if (newHotspotPosition && hotspotText.trim()) {
      const newHotspot: Hotspot = {
        x: newHotspotPosition.x,
        y: newHotspotPosition.y,
        text: hotspotText.trim(),
      }
      onHotspotCreate?.(newHotspot)
      setTooltipVisible(false)
      setModalVisible(false)
      setHotspotText('')
      setNewHotspotPosition(null)
    }
  }

  return (
    <div className="relative hotspot-wrapper w-full h-full">
      {children({ handleImageClick })}

      {/* Existing Hotspots */}
      {!hideExistingHotspots &&
        hotspots.map((hotspot) => (
          <Tooltip
            key={Math.random()}
            disableAnimation
            className="z-10 p-0 bg-transparent shadow-none border-none"
            isOpen
            content={
              <div className="bg-black/50 px-2 py-1 rounded-md backdrop-blur-md text-white flex items-center group overflow-hidden max-w-96">
                <span>{hotspot.text}</span>
                <div
                  className={cn(
                    'ml-4 w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center cursor-pointer',
                    {
                      hidden: disableAddHotspot,
                    }
                  )}>
                  <IoTrashBinOutline
                    color="#ff6d6d"
                    fontSize={16}
                    onClick={() => onHotspotDelete?.(hotspot)}
                  />
                </div>
              </div>
            }>
            <div
              className="absolute z-10 h-4 w-4 rounded-full bg-red-500 border-2 border-white/50 backdrop-blur-md shadow-lg animate-pulse"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Tooltip>
        ))}

      {/* New Hotspot Tooltip */}
      {tooltipVisible && newHotspotPosition && !disableAddHotspot && (
        <Tooltip
          key={Math.random()}
          placement="bottom"
          className="z-10 p-0 bg-transparent shadow-none border-none"
          isOpen={tooltipVisible}
          containerPadding={0}
          content={
            <Button
              size="sm"
              onClick={() => setModalVisible(true)}
              className="bg-black/50 px-2 py-1 rounded-md backdrop-blur-md text-white">
              Add Hotspot
            </Button>
          }>
          <div
            className="absolute z-10 h-4 w-4 rounded-full bg-red-500 border-2 border-white/50 backdrop-blur-md shadow-lg animate-pulse"
            onClick={handleTempHubspotClick}
            style={{
              left: `${newHotspotPosition.x}%`,
              top: `${newHotspotPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Tooltip>
      )}

      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={modalVisible}
        motionProps={{
          style: { zIndex: 1000000 },
        }}
        onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalHeader>
            <h4 className="text-lg font-medium">Create Hotspot</h4>
          </ModalHeader>
          <ModalBody>
            <Input
              fullWidth
              label="Hotspot Text"
              placeholder="Enter hotspot text"
              value={hotspotText}
              onChange={(e) => setHotspotText(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="flat"
              onClick={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleHotspotCreate}
              color="primary"
              size="sm"
              variant="solid">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
