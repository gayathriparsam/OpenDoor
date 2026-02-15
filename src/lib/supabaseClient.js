
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Prevent app crash if keys are not set yet
const isValid = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE');

export const supabase = isValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client that does nothing but prevents errors
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null })
        })
    };
