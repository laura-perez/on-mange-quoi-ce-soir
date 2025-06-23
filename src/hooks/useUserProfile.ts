import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { UserProfile } from '@/types/UserProfile';

const LOCAL_STORAGE_KEY = 'user_profile';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  updateField: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  resetProfile: () => void;
  saveProfileToSupabase: () => Promise<{ success: boolean; error?: string }>;
  loadProfileFromSupabase: () => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  // Chargement initial depuis localStorage
  useEffect(() => {
    const loadLocalProfile = () => {
      try {
        const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile) as UserProfile;
          setProfile(parsedProfile);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil local:', error);
      }
    };

    loadLocalProfile();
  }, []);

  // Sauvegarde automatique en localStorage à chaque modification
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde locale:', error);
      }
    }
  }, [profile]);

  /**
   * Met à jour un champ spécifique du profil
   */
  const updateField = useCallback(<K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    setProfile(prev => {
      if (!prev) {
        // Création d'un nouveau profil avec valeurs par défaut
        const newProfile: UserProfile = {
          goal: '',
          age: 0,
          gender: 'non_precise',
          height_cm: 0,
          weight_kg: 0,
          physical_activity: 'sedentaire',
          diet_preferences: [],
          disliked_foods: [],
          cooking_level: 'debutant',
          cooking_time: '',
          household_size: 'solo',
          weekly_budget_eur: 'inconnu',
          batch_cooking: false,
          batch_days: [],
          updated_at: new Date().toISOString()
        };
        
        return {
          ...newProfile,
          [key]: value
        };
      }
      
      return {
        ...prev,
        [key]: value,
        updated_at: new Date().toISOString()
      };
    });
  }, []);

  /**
   * Réinitialise complètement le profil
   */
  const resetProfile = useCallback(() => {
    setProfile(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du profil local:', error);
    }
  }, []);

  /**
   * Sauvegarde le profil dans Supabase (upsert)
   */
  const saveProfileToSupabase = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!profile) {
      return { success: false, error: 'Aucun profil à sauvegarder' };
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const profileToSave = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileToSave, { onConflict: 'id' });

      if (error) {
        console.error('Erreur Supabase:', error);
        return { success: false, error: error.message };
      }

      // Met à jour le profil local avec l'ID utilisateur
      setProfile(profileToSave);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la sauvegarde:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [profile, supabase]);

  /**
   * Charge le profil depuis Supabase
   */
  const loadProfileFromSupabase = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun profil trouvé, ce n'est pas une erreur
          return { success: true };
        }
        console.error('Erreur Supabase:', error);
        return { success: false, error: error.message };
      }

      if (data) {
        setProfile(data as UserProfile);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors du chargement:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    profile,
    updateField,
    resetProfile,
    saveProfileToSupabase,
    loadProfileFromSupabase,
    loading
  };
}
