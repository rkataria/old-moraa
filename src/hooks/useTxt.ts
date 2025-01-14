import { useState, useEffect } from 'react'

export const useTxtData = (txtUrl: string) => {
  const [data, setData] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txtUrl) return

    const fetchTxt = async () => {
      try {
        setLoading(true)
        const response = await fetch(txtUrl)
        if (!response.ok) throw new Error('Failed to fetch TXT')

        const textData = await response.text()
        setData(textData)
        setLoading(false)
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        setError(err?.message)
        setLoading(false)
      }
    }

    fetchTxt()
  }, [txtUrl])

  return { data, loading, error }
}
