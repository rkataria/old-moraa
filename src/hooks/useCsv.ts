import { useState, useEffect } from 'react'

import Papa from 'papaparse'

export const useCsvData = (csvUrl: string) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!csvUrl) return

    const fetchCsv = async () => {
      try {
        setLoading(true)
        const response = await fetch(csvUrl)
        if (!response.ok) throw new Error('Failed to fetch CSV')

        const csvText = await response.text()

        Papa.parse(csvText, {
          skipEmptyLines: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          complete: (result: any) => {
            setData(result.data)
            setLoading(false)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (err: any) => {
            throw err
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCsv()
  }, [csvUrl])

  return { data, loading, error }
}
