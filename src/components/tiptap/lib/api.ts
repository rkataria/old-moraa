import { uploadFile } from '@/services/storage.service'

export class API {
  public static uploadImage = async (
    file: File,
    setLoadingPercentage?: (a: null | number) => void
  ) => {
    try {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await uploadFile({
        file,
        // TODO: revisit this to add frameId in path
        fileName: `tiptap-${Date.now()}-${file.name}`,
        bucketName: import.meta.env.VITE_MORAA_ASSETS_BUCKET_NAME, // 'image-uploads',
        onProgressChange: setLoadingPercentage,
      }).promise

      if (response?.url) {
        setLoadingPercentage?.(null)

        return response?.url
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setLoadingPercentage?.(null)
    }

    return '/image-placeholder.png'
  }
}

// eslint-disable-next-line import/no-default-export
export default API
