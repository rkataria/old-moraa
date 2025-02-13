export function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000)
}

export function getRemainingTimestamp(
  startTimestamp: number,
  totalDuration: number
) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const elapsedTime = currentTimestamp - startTimestamp
  const remainingTime = totalDuration - elapsedTime

  return Math.max(remainingTime, 0)
}

export function getPaddedDuration(duration: number) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
