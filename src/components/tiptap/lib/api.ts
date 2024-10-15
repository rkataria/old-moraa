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
        fileName: `tiptap-.${file.name.split('.').pop()}`,
        bucketName: 'image-uploads',
        onProgressChange: setLoadingPercentage,
      })

      if (response?.url) {
        setLoadingPercentage?.(null)

        return response?.url
      }

      return '/image-placeholder.png'
    } catch (error) {
      console.error('Error uploading image:', error)
      setLoadingPercentage?.(null)

      return '/image-placeholder.png'
    }
  }
}

// eslint-disable-next-line import/no-default-export
export default API
