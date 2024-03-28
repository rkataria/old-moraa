import { useContext, useEffect, useState } from 'react'

import { DyteParticipantTile } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import DyteVideoBackgroundTransformer from '@dytesdk/video-background-transformer'
import { MdBlurOn } from 'react-icons/md'
import { RiSparkling2Fill } from 'react-icons/ri'

import {
  Image as NextUiImage,
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tabs,
  Tab,
} from '@nextui-org/react'

import { VIRTUAL_BACKGROUND_IMAGES } from '@/constants/dyte'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

type VideoBackgroundSettingsButtonWithModalProps = {
  buttonProps?: ButtonProps
}

type VideoMiddlewareType = 'blur' | 'background'

export function VideoBackgroundSettingsButtonWithModal({
  buttonProps = {},
}: VideoBackgroundSettingsButtonWithModalProps) {
  const { meeting } = useDyteMeeting()

  const [open, setOpen] = useState<boolean>(false)

  const selfParticipant = useDyteSelector((m) => m.self)

  const { videoMiddlewareConfig, setVideoMiddlewareConfig } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  useEffect(() => {
    if (!videoMiddlewareConfig) return

    const applyVideoMiddleware = async () => {
      const videoBackgroundTransformer =
        await DyteVideoBackgroundTransformer.init()

      if (videoMiddlewareConfig.previousConfig) {
        let previousVideoMiddleware = null

        if (videoMiddlewareConfig.previousConfig.type === 'blur') {
          previousVideoMiddleware =
            await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(
              videoMiddlewareConfig.value as number
            )
        }

        if (videoMiddlewareConfig.previousConfig.type === 'background') {
          previousVideoMiddleware =
            await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
              videoMiddlewareConfig.previousConfig.value as string
            )
        }

        meeting.self.removeVideoMiddleware(previousVideoMiddleware!)
      }

      if (videoMiddlewareConfig.type === 'blur') {
        const blurVideoMiddleware =
          await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(
            videoMiddlewareConfig.value as number
          )
        meeting.self.addVideoMiddleware(blurVideoMiddleware)
      }

      if (videoMiddlewareConfig.type === 'background') {
        const backgroundVideoMiddleware =
          await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
            videoMiddlewareConfig.value as string
          )
        meeting.self.addVideoMiddleware(backgroundVideoMiddleware)
      }
    }

    applyVideoMiddleware()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoMiddlewareConfig])

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
      setVideoMiddlewareConfig({
        previousConfig: {
          type: videoMiddlewareConfig.type,
          value: videoMiddlewareConfig?.value,
        },
        type: null,
        value: null,
      })

      return
    }

    if (videoMiddlewareConfig?.previousConfig) {
      setVideoMiddlewareConfig({
        previousConfig: {
          type: videoMiddlewareConfig.type!,
          value: videoMiddlewareConfig?.value,
        },
        type,
        value,
      })

      return
    }

    setVideoMiddlewareConfig({
      type,
      value,
    })
  }

  return (
    <>
      <Button
        isIconOnly
        radius="full"
        color="primary"
        className={cn('flex justify-center items-center')}
        {...buttonProps}
        onClick={() => setOpen(true)}>
        <RiSparkling2Fill size={22} className="text-white" />
      </Button>

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
                    <Tabs
                      disabledKeys={['appearance']}
                      aria-label="Options"
                      className="w-full">
                      <Tab key="backgrounds" title="Backgrounds">
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
                          <div className="grid grid-cols-3 gap-2">
                            {VIRTUAL_BACKGROUND_IMAGES.map(({ name, url }) => (
                              <div key={name} className="cursor-pointer">
                                <NextUiImage
                                  src={url}
                                  width="100%"
                                  className={cn('aspect-square border-2', {
                                    'border-primary':
                                      videoMiddlewareConfig?.value === url,
                                  })}
                                  onClick={() =>
                                    applyVideoMiddleware({
                                      type: 'background',
                                      value: url,
                                    })
                                  }
                                />
                                <p className="text-center text-gray-800 font-sm">
                                  {name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Tab>
                      <Tab disabled key="appearance" title="Appearance">
                        Appearance
                      </Tab>
                    </Tabs>
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
