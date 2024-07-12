import { NextResponse, type NextRequest } from 'next/server'
import { verifyAccess } from '@vercel/flags'

import { FlagOverridesType, decrypt } from '@vercel/flags'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })
  const overrideCookie = cookies().get('vercel-flag-overrides')?.value
  const overrides = overrideCookie
    ? await decrypt<FlagOverridesType>(overrideCookie)
    : {}

  return NextResponse.json<any>({
    definitions: overrides,
  })
}
