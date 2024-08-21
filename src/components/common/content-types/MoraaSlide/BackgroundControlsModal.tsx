import { useContext, useEffect, useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'
import { fabric } from 'fabric'
import { IoColorPalette } from 'react-icons/io5'

import { ColorPicker } from '../../ColorPicker'
import { ControlButton } from '../../ControlButton'
import { MediaPicker } from '../../MediaPicker/MediaPicker'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { EventContextType } from '@/types/event-context.type'

type BackgroundControlsModalProps = {
  onClose: () => void
}

export function BackgroundControlsModal({
  onClose,
}: BackgroundControlsModalProps) {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { canvas } = useMoraaSlideEditorContext()

  useEffect(() => {
    setLoading(!open)
  }, [open])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  if (!canvas || !currentFrame) return null

  const handleBackgroundChange = (color: string) => {
    updateFrame({
      framePayload: {
        config: {
          backgroundColor: color,
        },
      },
      frameId: currentFrame.id,
    })
  }

  const handleRemoveBackground = () => {
    canvas.backgroundImage = undefined
    canvas.renderAll()
    canvas.fire('object:modified')
    handleClose()
  }

  const backgroundColor = currentFrame.config.backgroundColor || '#ffffff'

  return (
    <>
      <ControlButton
        tooltipProps={{
          content: 'Change Background',
        }}
        buttonProps={{
          variant: 'light',
          radius: 'md',
          isIconOnly: true,
          size: 'sm',
        }}
        onClick={() => {
          setOpen(true)
        }}>
        <IoColorPalette size={18} />
      </ControlButton>
      <Modal size="md" isOpen={open} onClose={handleClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Background
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5 overflow-hidden mb-8">
                  <div className="flex justify-between items-center">
                    <h3>Color</h3>
                    <ColorPicker
                      className="border-1 border-black/50"
                      defaultColor={backgroundColor as string}
                      onchange={handleBackgroundChange}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <h3>Image</h3>
                    <MediaPicker
                      placement="left"
                      trigger={
                        <Button variant="bordered" size="sm">
                          Upload Image
                        </Button>
                      }
                      onSelectCallback={(imageElment) => {
                        setLoading(true)

                        fabric.Image.fromURL(imageElment.src, (img) => {
                          canvas.backgroundImage = img
                          canvas.renderAll()
                          canvas.fire('object:modified')
                          setLoading(false)
                          handleClose()
                        })
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {canvas.backgroundImage && (
                  <Button color="danger" onPress={handleRemoveBackground}>
                    Remove background Image
                  </Button>
                )}
                <Button
                  color="primary"
                  size="sm"
                  isLoading={loading}
                  onPress={handleClose}>
                  {loading ? 'Applying background image' : 'Done'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
