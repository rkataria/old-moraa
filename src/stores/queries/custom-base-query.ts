import { PostgrestError } from '@supabase/supabase-js'

import type { BaseQueryFn } from '@reduxjs/toolkit/query'

/**
 * Creates a "fake" baseQuery to be used if your api *only* uses the `queryFn` definition syntax.
 * This also allows you to specify a specific error type to be shared by all your `queryFn` definitions.
 */
export const supabaseBaseQuery = (): BaseQueryFn<
  void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  PostgrestError,
  object
> =>
  function () {
    throw new Error(
      'When using `supabaseBaseQuery`, all queries & mutations must use the `queryFn` definition syntax.'
    )
  }
