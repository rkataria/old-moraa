import { createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '@supabase/supabase-js'

import { supabaseClient } from '@/utils/supabase/client'

export const getUserThunk = createAsyncThunk<User | null>(
  'user/getUser',
  async () => {
    const session = await supabaseClient.auth.getSession()

    return session.data.session?.user || null
  }
)
