import { createClient } from '@supabase/supabase-js'

// Forçando a leitura das variáveis de ambiente do Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Supabase URL inválida ou não encontrada nas variáveis de ambiente.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
