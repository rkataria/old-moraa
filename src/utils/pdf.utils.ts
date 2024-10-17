export const updateLastVisitedPage = (frameId: string, position: number) => {
  const pdfPageStates = JSON.parse(
    localStorage.getItem('pdf-page-states') || '{}'
  )
  pdfPageStates[frameId] = position
  localStorage.setItem('pdf-page-states', JSON.stringify(pdfPageStates))
}

export const getLastVisitedPage = (frameId: string): number => {
  const pdfPageStates = JSON.parse(
    localStorage.getItem('pdf-page-states') || '{}'
  )

  return pdfPageStates[frameId] || 1
}
