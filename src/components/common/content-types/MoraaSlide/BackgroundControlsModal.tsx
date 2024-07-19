import { useContext, useEffect, useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'
import { fabric } from 'fabric'
import { IoColorPalette } from 'react-icons/io5'

import { ColorPicker } from '../../ColorPicker'
import { ControlButton } from '../../ControlButton'

import { FileUploader } from '@/components/event-content/FileUploader'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
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
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

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
                    <FileUploader
                      onFilesUploaded={(urls) => {
                        const url = urls?.[0]?.signedUrl

                        if (!url) return

                        setLoading(true)

                        fabric.Image.fromURL(url, (img) => {
                          canvas.setBackgroundImage(
                            img,
                            () => {
                              canvas.renderAll()
                              setLoading(false)
                              handleClose()
                            },
                            {
                              scaleX: canvas.getWidth() / img.width!,
                              scaleY: canvas.getHeight() / img.height!,
                              originX: 'left',
                              originY: 'top',
                            }
                          )
                        })
                      }}
                      triggerProps={{
                        size: 'sm',
                        radius: 'md',
                        variant: 'ghost',
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {canvas.backgroundImage && (
                  <Button color="danger" onPress={handleRemoveBackground}>
                    Remove background
                  </Button>
                )}
                <Button
                  color="secondary"
                  isLoading={loading}
                  onPress={handleClose}>
                  {loading ? 'Applying background' : 'Done'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
