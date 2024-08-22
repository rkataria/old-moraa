/* eslint-disable consistent-return */
/* eslint-disable import/no-default-export */
import { useState, useEffect, useRef } from 'react'

function useCountdown(initialSeconds: number, onEnd?: () => void) {
  const [seconds, setSeconds] = useState(-1)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (seconds < 0) {
      clearInterval(intervalRef.current!)

      return
    }

    if (seconds === 0) {
      onEnd?.()
      clearInterval(intervalRef.current!)

      return
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1)
    }, 1000)

    return () => clearInterval(intervalRef.current!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds])

  const startCountdown = () => {
    setSeconds(initialSeconds)
  }

  const resetCountdown = () => {
    clearInterval(intervalRef.current!)
    setSeconds(initialSeconds)
  }

  return { seconds, startCountdown, resetCountdown }
}

export default useCountdown
