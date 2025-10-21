import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScraperJob {
  id: string;
  category: string;
  state: string;
  state_shortcut: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
  total_results: number;
  error_message: string | null;
}

export interface ScraperResult {
  id: string;
  job_id: string;
  name: string;
  address: string | null;
  location_link: string | null;
  average_rating: string | null;
  number_of_raters: string | null;
  hours: string | null;
  created_at: string;
}
