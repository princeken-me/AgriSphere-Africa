import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-supabase-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const authService = {
  async signInWithEmail(email: string, password?: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
      if (error) throw error;
      return data;
    }
    return { user: { id: 'usr_farmer_001', email } };
  },
  async signInWithGoogle() {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      return data;
    }
    return { user: { id: 'usr_farmer_001', email: 'kwame.owusu@agrisphere.africa' } };
  },
  async signUp(email: string, password?: string, fullName?: string, role?: string, country?: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || '',
        options: { data: { fullName, role, country } }
      });
      if (error) throw error;
      return data;
    }
    return { user: { id: 'usr_farmer_001', email, fullName, role, country } };
  },
  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    return { error: null };
  },
  async resetPassword(email: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    }
    return { data: {} };
  }
};

