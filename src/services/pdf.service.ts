import { Upload } from 'tus-js-client'

import { supabaseClient } from '@/utils/supabase/client'

export const uploadPDFFile = async (
  fileName: string,
  file: File,
  onProgressChange: (percentage: number) => void
) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

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
        bucketName: 'pdf-uploads',
        objectName: fileName,
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError(error) {
        console.log(`Failed because: ${error}`)
        reject(error)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        console.log(bytesUploaded, bytesTotal, `${percentage}%`)
        onProgressChange?.(+percentage)
      },
      onSuccess() {
        console.log('Download %s from %s', upload.file, upload.url)
        resolve({})
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

export const downloadPDFFile = (fileName: string) =>
  supabaseClient.storage
    .from('pdf-uploads')
    .download(fileName)
    .then((res) => {
      if (res.error) throw res.error

      return res
    })

export const deletePDFFile = (fileName: string) =>
  supabaseClient.storage.from('pdf-uploads').remove([fileName])
