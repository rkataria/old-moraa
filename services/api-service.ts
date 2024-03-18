import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Database } from './types/supabase-db-overrides'

export class APIService {
  static supabaseClient = createClientComponentClient<Database>()

  static async getAuthenticatedUser() {
    const {
      data: { user },
    } = await APIService.supabaseClient.auth.getUser()

    return user
  }
}
