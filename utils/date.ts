export const getIsoDateString = (date: string) => {
  return new Date(date).toISOString()
}

export const getFormattedDate = (
  date: string,
  { includeTime = false }: { includeTime?: boolean } = {}
) => {
  // Extracting components from ISO date string
  const isoDate = new Date(date)
  const year = isoDate.getFullYear()
  const month = String(isoDate.getMonth() + 1).padStart(2, "0")
  const day = String(isoDate.getDate()).padStart(2, "0")
  const hours = String(isoDate.getHours()).padStart(2, "0")
  const minutes = String(isoDate.getMinutes()).padStart(2, "0")

  // Constructing mm-dd-yyyy format date string
  const mmddyyyyFormatDateString = `${month}-${day}-${year} ${includeTime ? `${hours}:${minutes}` : ""}`

  return mmddyyyyFormatDateString
}
