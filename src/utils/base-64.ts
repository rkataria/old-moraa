export const blobToBase64WithMime = (
  blob: Blob,
  mimeType: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      // Replace the incorrect MIME type if necessary
      const correctedBase64 = base64String.replace(
        /^data:.*;base64,/,
        `data:${mimeType};base64,`
      )
      resolve(correctedBase64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
