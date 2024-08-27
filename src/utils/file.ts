export function dataURLToFile(dataURL: string, fileName: string): File {
  // Convert the data URL to a Blob
  const byteString = atob(dataURL.split(',')[1])
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([ab], { type: mimeString })

  // Convert the Blob to a File
  return new File([blob], fileName, { type: mimeString })
}
