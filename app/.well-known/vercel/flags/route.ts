import { NextResponse, type NextRequest } from 'next/server'
import { verifyAccess, type ApiData } from '@vercel/flags'
import { getFlags } from '../../../../flags/server'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })
  const flagsFromHappyKit = await getFlags({})
  console.log('flagsFromHappyKit', flagsFromHappyKit)

  const getDefinitions = () => {
    let definitions = {}
    if (!flagsFromHappyKit.flags)
      return {
        newFeature: {
          description: 'Controls whether the new feature is visible',
          origin: 'https://example.com/#new-feature',
          options: [
            { value: false, label: 'Off' },
            { value: true, label: 'On' },
          ],
        },
      }
    Object.keys(flagsFromHappyKit.flags!).map((flagKey) => {
      definitions[flagKey] = {
        options: [
          { value: flagsFromHappyKit[flagKey], label: 'Off' },
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
