// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateLastVisitedPage = (frameId: string, data: any) => {
  const pdfPageStates = JSON.parse(
    localStorage.getItem('pdf-page-states') || '{}'
  )
  pdfPageStates[frameId] = {
    ...pdfPageStates[frameId],
    ...data,
  }

  localStorage.setItem('pdf-page-states', JSON.stringify(pdfPageStates))
}

export const getLastVisitedPage = (frameId: string) => {
  const pdfPageStates = JSON.parse(
    localStorage.getItem('pdf-page-states') || '{}'
  )

  return pdfPageStates[frameId] || {}
}
