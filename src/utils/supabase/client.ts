import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { Database } from '@/types/supabase-db'

export const supabaseClient = createSupabaseClient<Database, 'public'>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
