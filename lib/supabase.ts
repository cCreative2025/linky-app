import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string
          display_name: string
          bio: string | null
          avatar_emoji: string
          avatar_url: string | null
          theme: string
          accent_color: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profile']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profile']['Insert']>
      }
      links: {
        Row: {
          id: string
          title: string
          url: string
          description: string | null
          icon: string
          is_active: boolean
          order_index: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['links']['Row'], 'id' | 'click_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['links']['Insert']>
      }
    }
  }
}
