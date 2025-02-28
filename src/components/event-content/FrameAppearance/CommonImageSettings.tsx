import { Key, useState } from 'react'

import { Button } from '@heroui/button'
import { Image, Tab, Tabs } from '@heroui/react'
import { VscLayoutActivitybarLeft } from 'react-icons/vsc'

import { MediaPicker } from '@/components/common/MediaPicker/MediaPicker'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventContext } from '@/contexts/EventContext'
import { uploadFile } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'

export function CommonImageSettings({ frame }: { frame: IFrame }) {
  const { updateFrame } = useEventContext()

  const [uploadPercentage, setUploadPercentage] = useState(0)

  const onUpload = (imageUrl: string) => {
    if (!frame) return
    updateFrame({
      framePayload: {
        config: {
          ...frame.config,
          image: {
            url: imageUrl,
            position: 'left',
          },
        },
      },
      frameId: frame.id,
    })
  }

  const handlePositionChange = (view: Key) => {
    if (!frame) return

    updateFrame({
      framePayload: {
        config: {
          ...frame.config,
          image: {
            ...frame.config.image,
            position: view,
          },
        },
      },
      frameId: frame.id,
    })
  }

  const removeImage = () => {
    if (!frame) return

    setUploadPercentage(0)

    updateFrame({
      framePayload: {
        config: {
          ...frame.config,
          image: {},
        },
      },
      frameId: frame.id,
    })
  }

  return (
    <>
      <RenderIf isTrue={!frame.config?.image?.url}>
        <MediaPicker
          crop
          ImageOrientation="squarish"
          trigger={
            <Button
              fullWidth
              size="sm"
              className="relative border-1 rounded-lg"
              variant="bordered"
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
              fileName: `tiptap-.${file.name.split('.').pop()}`,
              bucketName: 'image-uploads',
              onProgressChange: setUploadPercentage,
            }).promise
            if (response?.url) {
              onUpload(response.url)
            }
          }}
        />
      </RenderIf>

      <RenderIf isTrue={!!frame.config?.image?.position}>
        <>
          <div className="relative group/poll-image">
            <Image
              src={frame.config?.image?.url}
              classNames={{
                wrapper: 'w-full h-full',
                img: 'aspect-video object-cover',
              }}
            />
            <div className="absolute w-full h-full z-10 bg-black/30 top-0 left-0 rounded-lg group-hover/poll-image:opacity-100 opacity-0 duration-300 grid place-items-center">
              <div className="flex items-center gap-2">
                <MediaPicker
                  crop
                  ImageOrientation="squarish"
                  trigger={
                    <Button size="sm" className="text-xs">
                      Change
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
                      fileName: `tiptap-.${file.name.split('.').pop()}`,
                      bucketName: 'image-uploads',
                      onProgressChange: setUploadPercentage,
                    }).promise
                    if (response?.url) {
                      onUpload(response.url)
                    }
                  }}
                />

                <Button
                  size="sm"
                  className="text-xs bg-gray-700 text-white"
                  onClick={removeImage}>
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <Tabs
            keyboardActivation="manual"
            selectedKey={frame.config?.image?.position}
            onSelectionChange={handlePositionChange}
            variant="solid"
            aria-label="Tabs variants"
            classNames={{
              tab: 'data-[focus-visible=true]:outline-0',
            }}>
            <Tab key="left" title={<VscLayoutActivitybarLeft />} />
            <Tab
              key="right"
              title={<VscLayoutActivitybarLeft className="rotate-[180deg]" />}
            />
          </Tabs>
        </>
      </RenderIf>
    </>
  )
}
