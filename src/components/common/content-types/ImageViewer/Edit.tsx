/* eslint-disable no-restricted-syntax */

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaImage } from 'react-icons/fa'

import { Embed } from './Embed'
import { ContentLoading } from '../../ContentLoading'
import { Hotspot } from '../../HotspotImageWrapper'

import { FilePickerDropzone } from '@/components/common/FilePickerDropzone'
import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { useEventContext } from '@/contexts/EventContext'
import { getSignedUrl, uploadFile } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'

interface EditProps {
  frame: IFrame
}

const getImageName = (frameId: string) =>
  `image-frame-assets/frame-id-${frameId}-image`

export function Edit({ frame }: EditProps) {
  const { updateFrame } = useEventContext()

  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) =>
      uploadFile({
        fileName: getImageName(frame.id),
        file,
        neverExpire: false,
        onProgressChange: setUploadProgress,
      }).promise,
    onSuccess: () => {
      toast.success('Image uploaded successfully.')
    },
    onError: (err) => {
      console.log('🚀 ~ ImageUploader ~ err:', err)
      toast.error(
        'Failed to upload image, please try re-uploading again by deleting the frame.'
      )
    },
    onSettled: () => toast.remove(frame.id),
    onMutate: () => {
      toast.loading('Uploading image...', {
        id: frame.id,
      })
    },
  })

  const signedURLQuery = useQuery({
    queryKey: ['image-frame', frame.content?.imagePath],
    queryFn: () => getSignedUrl('assets-uploads', frame.content?.imagePath),
    enabled: !!frame.content?.imagePath && !frame.content?.url,
    refetchOnMount: false,
    staleTime: Infinity,
  })

  const uploadAndSetFile = async (file: File) => {
    uploadImageMutation.mutate(file, {
      onSuccess: () => {
        // Update the frame in background.
        updateFrame({
          framePayload: {
            content: {
              ...frame.content,
              imagePath: getImageName(frame.id),
            },
          },
          frameId: frame.id,
        })
      },
    })
  }

  const getInnerContent = () => {
    switch (true) {
      case signedURLQuery.isPending && signedURLQuery.isFetching:
        return <ContentLoading />

      case uploadImageMutation.isPending:
      case !signedURLQuery.data?.data?.signedUrl && !frame.content?.url:
        return (
          <FrameFormContainer
            headerIcon={<FaImage size={72} className="text-primary" />}
            headerTitle="Embed Image"
            headerDescription="Easily embed an image file into Moraa Frame."
            footerNote="Supported formats include JPEG and PNG">
            <div className="w-full">
              <FilePickerDropzone
                fullWidth
                label="Drag & drop image file here or click here to upload file"
                supportedFormats={{
                  'image/*': ['.jpg', '.jpeg', '.png'],
                }}
                uploadProgress={
                  uploadImageMutation.isPending ? uploadProgress : 0
                }
                onUpload={(files) => {
                  const fileList = []
                  if (files) {
                    for (const file of files) {
                      fileList.push(file)
                    }
                    uploadAndSetFile(fileList[0])
                  }
                }}
              />
            </div>
          </FrameFormContainer>
        )

      case !!frame.content?.url ||
        (!!frame.content?.imagePath && !!signedURLQuery.data?.data?.signedUrl):
        return (
          <Embed
            path={frame.content?.url || signedURLQuery.data?.data?.signedUrl}
            hotspots={frame.content.hotspots || []}
            onHotspotDelete={(hotspot) => {
              updateFrame({
                framePayload: {
                  content: {
                    ...frame.content,
                    hotspots: frame?.content?.hotspots?.filter(
                      (oldHotspot: Hotspot) => oldHotspot.text !== hotspot.text
                    ),
                  },
                },
                frameId: frame.id,
              })
            }}
            onHotspotCreate={(hotspot) => {
              updateFrame({
                framePayload: {
                  content: {
                    ...frame.content,
                    hotspots: [...(frame?.content?.hotspots || []), hotspot],
                  },
                },
                frameId: frame.id,
              })
            }}
          />
        )

      default:
        return 'Something went wrong...'
    }
  }

  return <>{getInnerContent()}</>
}
