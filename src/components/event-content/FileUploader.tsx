import { useEffect, useState } from 'react'

import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import Compressor from '@uppy/compressor'
import Uppy, { UppyFile } from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'
import ImageEditor from '@uppy/image-editor'
import { Dashboard as DashboardUI } from '@uppy/react'
import RemoteSources from '@uppy/remote-sources'
import Transloadit, { COMPANION_URL } from '@uppy/transloadit'
import Tus from '@uppy/tus'
import XHRUpload from '@uppy/xhr-upload'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/screen-capture/dist/style.css'
import '@uppy/image-editor/dist/style.css'
import { supabaseClient } from '@/utils/supabase/client'

type File = UppyFile<Record<string, unknown>, Record<string, unknown>>

const TRANSLOADIT_AUTH_KEY = import.meta.env.VITE_TRANSLOADIT ?? ''
const TEMPLATE_ID = import.meta.env.VITE_TRANSLOADIT_TEMPLATE_ID ?? ''

export type FileWithSignedUrl = {
  signedUrl: string
  meta: { name: string; size: number; type: string }
}

export type FileWithoutSignedUrl = {
  url: string
}

type FileUploaderProps = {
  title?: string
  maxNumberOfFiles?: number
  allowedFileTypes?: string[]
  bucketName?: string
  folderName?: string
  useTUS?: boolean
  hint?: string
  triggerProps?: ButtonProps
  hideLoader?: boolean
  onFilePickerOpen?: (open: boolean) => void
  onFilesUploaded?: (files: FileWithSignedUrl[]) => void
  onPublicFilesUploaded?: (files: FileWithoutSignedUrl[]) => void
}

export function FileUploader({
  title = 'Upload Files',
  maxNumberOfFiles = 1,
  allowedFileTypes,
  bucketName = 'assets-uploads',
  folderName,
  useTUS = false,
  hint = 'You can upload files from your local device, Dropbox, Google Drive, One Drive, Unsplash, or a URL',
  triggerProps = {},
  hideLoader = false,
  onFilePickerOpen,
  onFilesUploaded,
  onPublicFilesUploaded,
}: FileUploaderProps) {
  const supabase = supabaseClient
  const [isOpen, setOpen] = useState<boolean>(false)
  const [uppyInstance, setUppyInstance] = useState<Uppy | null>(null)

  useEffect(() => {
    if (uppyInstance) return

    const _uppy = new Uppy({
      debug: false,
      restrictions: { maxNumberOfFiles, allowedFileTypes },
    })
      .use(Dashboard, {
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: true,
      })
      .use(RemoteSources, {
        companionUrl: COMPANION_URL,
        sources: ['GoogleDrive', 'Url', 'Unsplash'],
      })
      .use(ImageEditor)
      .use(DropTarget, {
        target: document.body,
      })
      .use(Compressor)
      .use(Transloadit, {
        waitForEncoding: true,
        params: {
          auth: {
            key: TRANSLOADIT_AUTH_KEY,
          },
          template_id: TEMPLATE_ID,
        },
      })

    setUppyInstance(_uppy)

    _uppy.on('file-added', (file) => {
      const objectName = getObjectName(file)

      _uppy.getPlugin('XHRUpload')?.setOptions({
        endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${bucketName}/${objectName}`,
      })

      // eslint-disable-next-line no-param-reassign
      file.meta = {
        ...file.meta,
        bucketName,
        objectName,
        contentType: file.type,
      }
    })

    _uppy.on('transloadit:upload', async (file) => {
      // onFilesUploaded?.([
      //   {
      //     meta: { name: file.original_name, size: file.size, type: file.type },
      //     signedUrl: file.ssl_url,
      //   },
      // ])
      _uppy.removeFile(file.id)
    })

    _uppy.on('transloadit:complete', async () => {
      setOpen(false)
      onFilePickerOpen?.(false)
      // toast.success('Upload successful')
    })

    _uppy.on('complete', async (result) => {
      if (result.failed.length === 0) {
        if (bucketName === 'image-uploads') {
          onPublicFilesUploaded?.(
            getFiles(result.successful) as FileWithoutSignedUrl[]
          )

          return
        }
        const files = await getFilesWithSignedUrls(result.successful)
        onFilesUploaded?.(files)
        _uppy.setState({ files: [] })
        setOpen(false)
        onFilePickerOpen?.(false)

        toast.success('Upload successful')
      } else {
        console.warn('Upload failed')
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      _uppy.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!uppyInstance) return

    if (useTUS) {
      if (!uppyInstance.getPlugin('Tus')) {
        uppyInstance.use(Tus, {
          endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable/${bucketName}`,
          limit: 6,
          headers: {
            authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
          },
          chunkSize: 6 * 1024 * 1024,
          allowedMetaFields: [
            'bucketName',
            'objectName',
            'contentType',
            'cacheControl',
          ],
        })
      }
    } else if (!uppyInstance.getPlugin('XHRUpload')) {
      uppyInstance.use(XHRUpload, {
        endpoint: '',
        headers: {
          authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
        },
        limit: 6,
        bundle: false, // remote file upload not allowed with bundle:true
      })
    }
  }, [useTUS, uppyInstance, bucketName])

  const getObjectName = (file: File) =>
    `${folderName ? `${folderName}/${uuidv4()}-${file.name}` : `${uuidv4()}${uuidv4()}-${file.name}`}`

  const getFilesWithSignedUrls = async (files: File[]) => {
    const filesWithSignedUrl: FileWithSignedUrl[] = []

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const { data } = await getSignedUrl(file)

      if (data) {
        filesWithSignedUrl.push({
          ...file,
          signedUrl: data.signedUrl,
          meta: {
            name: file.name,
            size: file.size,
            type: file.type!,
          },
        })
      }
    }

    return filesWithSignedUrl
  }

  const getFiles = (files: File[]) => {
    const filesWithPublicUrl = []
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      filesWithPublicUrl.push({
        ...file,
        url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${file?.response?.body?.Key}`,
      })
    }

    return filesWithPublicUrl
  }

  const getSignedUrl = async (file: File) => {
    const { meta } = file

    return supabase.storage
      .from(meta.bucketName as string)
      .createSignedUrl(meta.objectName as string, 60000, {
        transform: {
          quality: 50,
        },
      })
  }

  const onOpen = () => {
    setOpen(true)
    onFilePickerOpen?.(true)
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open)
    onFilePickerOpen?.(open)
  }

  return (
    <>
      <Button
        onPress={onOpen}
        isLoading={!hideLoader && isOpen}
        {...triggerProps}>
        {triggerProps.children || title}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="p-0">
                <DashboardUI
                  uppy={uppyInstance!}
                  note={hint}
                  locale={{
                    strings: {
                      poweredBy: '',
                    },
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
