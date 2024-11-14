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
