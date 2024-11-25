import { Upload } from 'tus-js-client'

import { supabaseClient } from '@/utils/supabase/client'

export const uploadFile = async ({
  fileName,
  file,
  bucketName,
  neverExpire = true,
  onProgressChange,
}: {
  fileName: string
  file: File
  bucketName?: string
  neverExpire?: boolean
  onProgressChange?: (percentage: number) => void
}) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  const _bucketName = bucketName ?? 'assets-uploads'

  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session?.access_token}`,
        'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
      metadata: {
        bucketName: _bucketName,
        objectName: fileName,
      },

      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError(error) {
        console.log(`Failed because: ${error}`)
        reject(error)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        onProgressChange?.(+percentage < 90 ? +percentage : 90) // Limit progress to 90% to avoid confusion as the signed url is not yet generated
      },
      onSuccess() {
        getSignedUrl(_bucketName, fileName, neverExpire).then((data) => {
          resolve({
            url: data.data?.signedUrl,
          })
          onProgressChange?.(100) // Set progress to 100% after success
        })
      },
    })

    upload.findPreviousUploads().then((previousUploads) => {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    })
  })
}

export const downloadFile = (fileName: string, bucketName?: string) =>
  supabaseClient.storage
    .from(bucketName || 'assets-uploads')
    .download(fileName)
    .then((res) => {
      if (res.error) throw res.error

      return res
    })

export const deleteFile = (fileName: string, bucketName?: string) =>
  supabaseClient.storage.from(bucketName || 'assets-uploads').remove([fileName])

export const getSignedUrl = async (
  bucketName: string,
  objectName: string,
  neverExpire?: boolean
) => {
  const expireInSeconds = neverExpire ? 100 * 365 * 24 * 60 * 60 : 60000

  return supabaseClient.storage
    .from(bucketName)
    .createSignedUrl(objectName as string, expireInSeconds, {
      transform: {
        quality: 50,
      },
    })
}
