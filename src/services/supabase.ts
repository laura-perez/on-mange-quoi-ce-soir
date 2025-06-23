import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/UserProfile';

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

/**
 * Sauvegarde le profil utilisateur dans Supabase (upsert)
 */
export async function saveUserProfileToSupabase(
  profile: UserProfile,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const profileToSave = {
      ...profile,
      id: userId,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileToSave, { onConflict: 'id' });

    if (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur lors de la sauvegarde du profil:', error);
    return { success: false, error: errorMessage };
  }
}

// Instance singleton
export const supabaseService = new SupabaseService();
