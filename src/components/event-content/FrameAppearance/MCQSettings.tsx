import { Key, useContext, useState } from 'react'

import { Tabs, Tab, Image } from '@nextui-org/react'
import { VscLayoutActivitybarLeft } from 'react-icons/vsc'

import { MediaPicker } from '@/components/common/MediaPicker/MediaPicker'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SwitchControl } from '@/components/common/SwitchControl'
import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { uploadFile } from '@/services/storage.service'
import { EventContextType } from '@/types/event-context.type'

export function MCQSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const onUpload = (imageUrl: string) => {
    if (!currentFrame) return
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          image: {
            url: imageUrl,
            position: 'left',
          },
        },
      },
      frameId: currentFrame.id,
    })
  }
  const handlePositionChange = (view: Key) => {
    if (!currentFrame) return
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          image: {
            ...currentFrame.config.image,
            position: view,
          },
        },
      },
      frameId: currentFrame.id,
    })
  }
  const removeImage = () => {
    if (!currentFrame) return
    setUploadPercentage(0)
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame.config,
          image: {},
        },
      },
      frameId: currentFrame.id,
    })
  }
  if (!currentFrame) return null

  return (
    <div className="flex flex-col gap-4">
      <SwitchControl
        label="Allow anonymous votes"
        checked={currentFrame.config.allowVoteAnonymously}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteAnonymously: !currentFrame.config.allowVoteAnonymously,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
      <RenderIf isTrue={!currentFrame.config?.image?.url}>
        <MediaPicker
          trigger={
            <Button
              fullWidth
              className="relative"
              variant="light"
              isDisabled={!!uploadPercentage}>
              {uploadPercentage ? 'Uploading' : 'Add image'}{' '}
              {uploadPercentage ? `${uploadPercentage}%` : null}
            </Button>
          }
          onSelectCallback={(img) => {
            if (!img) return
            onUpload(img.src)
          }}
          onSelect={async (file) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await uploadFile({
              file,
              fileName: `${currentFrame.id}/tiptap-.${file.name.split('.').pop()}`,
              bucketName: import.meta.env.VITE_MORAA_ASSETS_BUCKET_NAME, // 'image-uploads',
              onProgressChange: setUploadPercentage,
            }).promise
            if (response?.url) {
              onUpload(response.url)
            }
          }}
        />
      </RenderIf>
      <RenderIf isTrue={!!currentFrame.config?.image?.position}>
        <>
          <div className="relative group/poll-image">
            <Image
              src={currentFrame.config?.image?.url}
              classNames={{
                wrapper: 'w-full h-full',
                img: 'aspect-video object-cover',
              }}
            />
            <div className="absolute w-full h-full z-10 bg-black/30 top-0 left-0 rounded-lg group-hover/poll-image:opacity-100 opacity-0 duration-300 grid place-items-center">
              <div className="flex items-center gap-2">
                <MediaPicker
                  trigger={<Button className="text-xs">Change</Button>}
                  onSelectCallback={(img) => {
                    if (!img) return
                    onUpload(img.src)
                  }}
                  onSelect={async (file) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const response: any = await uploadFile({
                      file,
                      fileName: `${currentFrame.id}/tiptap-.${file.name.split('.').pop()}`,
                      bucketName: import.meta.env.VITE_MORAA_ASSETS_BUCKET_NAME, // 'image-uploads',
                      onProgressChange: setUploadPercentage,
                    }).promise
                    if (response?.url) {
                      onUpload(response.url)
                    }
                  }}
                />
                <Button
                  className="text-xs bg-gray-700 text-white"
                  onClick={removeImage}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
          <Tabs
            selectedKey={currentFrame.config?.image?.position}
            onSelectionChange={handlePositionChange}
            variant="solid"
            aria-label="Tabs variants">
            <Tab key="left" title={<VscLayoutActivitybarLeft />} />
            <Tab
              key="right"
              title={<VscLayoutActivitybarLeft className="rotate-[180deg]" />}
            />
          </Tabs>
        </>
      </RenderIf>
    </div>
  )
}
