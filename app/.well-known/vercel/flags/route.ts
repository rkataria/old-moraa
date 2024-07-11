import { NextResponse, type NextRequest } from 'next/server'
import { verifyAccess, type ApiData } from '@vercel/flags'
import { useFlags } from '../../../../flags/client'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })
  const { flags } = useFlags()
  console.log('flags')

  function getDefinitions(_flags) {
    const result = {}
    for (const [key, value] of Object.entries(_flags)) {
      result[key] = {
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      }
    }

    return result
  }
  console.log('_flags', getDefinitions(flags))

  return NextResponse.json<ApiData>({
    definitions: getDefinitions(flags),
  })
}
