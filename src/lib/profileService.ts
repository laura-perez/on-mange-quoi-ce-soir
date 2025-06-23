import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { saveUserProfileToSupabase } from '@/services/supabase';
import type { UserProfile } from '@/types/UserProfile';

/**
 * Service pour la gestion des profils utilisateur avec Supabase
 */
export class ProfileService {
  private supabase;

  constructor() {
    this.supabase = createClientComponentClient();
  }

  /**
   * Sauvegarde le profil utilisateur sur Supabase
   * @param profile - Le profil à sauvegarder
   * @param showWarning - Afficher un warning si l'utilisateur n'est pas connecté
   */
  async saveProfile(
    profile: UserProfile | null, 
    showWarning: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    if (!profile) {
      return { success: false, error: 'Aucun profil à sauvegarder' };
    }

    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (user?.id) {
        const result = await saveUserProfileToSupabase(profile, user.id);
        if (!result.success) {
          console.error('Erreur lors de la sauvegarde:', result.error);
          return { success: false, error: result.error };
        }
        return { success: true };
      } else {
        if (showWarning) {
          console.warn("Utilisateur non connecté, profil non sauvegardé à distance");
        }
        return { success: false, error: 'Utilisateur non connecté' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la finalisation:', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  async isUserAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      return !!user?.id;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  }
}
