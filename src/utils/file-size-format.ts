export function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes === 0) return '0 Bytes'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
  const formattedSize = (sizeInBytes / 1024 ** i).toFixed(2)

  return `${formattedSize} ${sizes[i]}`
}
