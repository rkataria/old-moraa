import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'

import { Database } from './types/supabase-db-overrides'

export class APIService {
  static supabaseClient = createClientComponentClient<Database>()

  static async getAuthenticatedUser() {
    const {
      data: { user },
    } = await APIService.supabaseClient.auth.getUser()

    return user
  }

  static API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  static apiManager = axios.create({
    baseURL: this.API_BASE_URL,
    timeout: 10000,
  })
}
