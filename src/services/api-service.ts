import { supabaseClient } from '@/utils/supabase/client'

export class APIService {
  static async getAuthenticatedUser() {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    return user
  }
  static supabase = supabaseClient
  static supabaseClient = supabaseClient
}
