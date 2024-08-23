import { RefObject, useState, useMemo, useEffect } from 'react'

export function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref]
  )

  useEffect(() => {
    if (!ref.current || !ref) observer.disconnect()
    observer.observe(ref.current!)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isIntersecting
}
