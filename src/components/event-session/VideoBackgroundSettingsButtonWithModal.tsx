import { useContext, useEffect, useState } from 'react'

import { DyteParticipantTile } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import DyteVideoBackgroundTransformer from '@dytesdk/video-background-transformer'
import {
  Image as NextUiImage,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { MdBlurOn } from 'react-icons/md'
import { RiSparkling2Fill } from 'react-icons/ri'

import { Tooltip } from '../common/ShortuctTooltip'
import { Button } from '../ui/Button'

import { VIRTUAL_BACKGROUND_IMAGES } from '@/constants/dyte'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

type VideoBackgroundSettingsButtonWithModalProps = {
  buttonProps?: ButtonProps
  label?: string
}

type VideoMiddlewareType = 'blur' | 'background'

export function VideoBackgroundSettingsButtonWithModal({
  buttonProps = {},
  label,
}: VideoBackgroundSettingsButtonWithModalProps) {
  const { meeting } = useDyteMeeting()

  const [open, setOpen] = useState<boolean>(false)

  const selfParticipant = useDyteSelector((m) => m.self)

  const { videoMiddlewareConfig, setVideoMiddlewareConfig } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const addMiddleWare = async ({
    type,
    value,
  }: {
    type: string
    value: string | number
  }) => {
    const videoBackgroundTransformer =
      await DyteVideoBackgroundTransformer.init()

    let middleWare

    switch (type) {
      case 'background':
        middleWare =
          await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
            value as string
          )

        break

      default:
        middleWare =
          await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(
            value as number
          )
        break
    }

    meeting.self.addVideoMiddleware(middleWare!)

    setVideoMiddlewareConfig({
      type,
      value,
      currentMiddleware: middleWare,
    })

    localStorage.setItem(
      'videoMiddleWare',
      JSON.stringify({
        type,
        value,
      })
    )
  }

  const removeMiddleWare = async () => {
    if (!videoMiddlewareConfig) return null
    const removedRes = await meeting.self.removeVideoMiddleware(
      videoMiddlewareConfig.currentMiddleware!
    )
    setVideoMiddlewareConfig({
      previousConfig: {
        type: videoMiddlewareConfig.type!,
        value: videoMiddlewareConfig?.value,
      },
      type: null,
      value: null,
    })

    localStorage.removeItem('videoMiddleWare')

    return removedRes
  }

  const applyVideoMiddleware = async ({
    type,
    value,
  }: {
    type: VideoMiddlewareType
    value: string | number
  }) => {
    if (
      videoMiddlewareConfig?.type === type &&
      videoMiddlewareConfig?.value === value
    ) {
      removeMiddleWare()

      return
    }
    if (videoMiddlewareConfig?.currentMiddleware) {
      const removedResponse = await removeMiddleWare()
      if (removedResponse?.success) {
        addMiddleWare({ type, value })

        return
      }
    }
    addMiddleWare({ type, value })
  }
  useEffect(() => {
    if (videoMiddlewareConfig) return
    const lastVideoMiddleware = localStorage.getItem('videoMiddleWare')
    if (!lastVideoMiddleware) return
    applyVideoMiddleware(JSON.parse(lastVideoMiddleware))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Tooltip label="Video Settings">
        <Button
          isIconOnly={!label}
          size="sm"
          radius="full"
          color="primary"
          className={cn('flex justify-center items-center shrink-0')}
          {...buttonProps}
          onClick={() => setOpen(true)}>
          <RiSparkling2Fill size={20} />
          {label}
        </Button>
      </Tooltip>

      <Modal
        size="5xl"
        placement="top"
        isOpen={open}
        onClose={() => setOpen(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="font-md text-gray-800 font-semibold">
                  Effect Settings
                </h2>
                <p className="text-gray-500 text-sm font-normal">
                  Customize your virtual background settings
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-start items-start gap-4 mb-4">
                  <div className="w-2/3">
                    <DyteParticipantTile
                      meeting={meeting}
                      participant={selfParticipant}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="w-1/3">
                    <div className="flex flex-col gap-2 mb-4">
                      <h3 className="text-gray-800 font-semibold">Blur</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() =>
                            applyVideoMiddleware({
                              type: 'blur',
                              value: 10,
                            })
                          }>
                          <MdBlurOn size={24} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-gray-800 font-semibold">
                        Backgrounds
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {VIRTUAL_BACKGROUND_IMAGES.map(({ name, url }) => (
                          <div key={name} className="cursor-pointer">
                            <NextUiImage
                              shadow="none"
                              src={url}
                              width="100%"
                              className={cn(
                                'aspect-square object-cover rounded-2xl !shadow-none border-2 border-transparent',
                                {
                                  'border-primary':
                                    videoMiddlewareConfig?.value === url,
                                }
                              )}
                              onClick={() =>
                                applyVideoMiddleware({
                                  type: 'background',
                                  value: url,
                                })
                              }
                            />
                            {/* <p className="text-center text-gray-800 font-sm">
                                  {name}
                                </p> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
