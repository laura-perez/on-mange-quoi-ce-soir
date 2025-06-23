import { createClient } from '@/lib/supabase/client';

export class SupabaseService {
  private supabase = createClient();

  // Authentification
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }
}

// Instance singleton
export const supabaseService = new SupabaseService();
