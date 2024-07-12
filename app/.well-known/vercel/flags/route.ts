import { NextResponse, type NextRequest } from 'next/server'
import { verifyAccess, type ApiData } from '@vercel/flags'
import { getFlags } from '../../../../flags/server'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })
  const flagsFromHappyKit = await getFlags({})

  const getDefinitions = () => {
    let definitions = {}
    if (!flagsFromHappyKit.flags) {
      return {}
    }

    const flags = flagsFromHappyKit.flags

    Object.keys(flags).map((flagKey) => {
      definitions[flagKey] = {
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      }
    })
    return definitions
  }

  return NextResponse.json<ApiData>({
    definitions: getDefinitions(),
  })
}
