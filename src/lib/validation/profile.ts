import type { UserProfile } from '@/types/UserProfile';
import type { profileSteps } from '@/data/profileSteps';

type ProfileStep = typeof profileSteps[number];

/**
 * Utilitaires pour la validation des étapes et des profils utilisateur
 */
export class ProfileValidation {
  /**
   * Valide si une étape du profil est complète
   */
  static isStepValid(
    profile: UserProfile | null, 
    step: ProfileStep
  ): boolean {
    if (!profile || step.optional) return true;
    
    const value = profile[step.key];
    
    return this.validateFieldValue(step, value, profile);
  }

  /**
   * Valide la valeur d'un champ spécifique
   */
  private static validateFieldValue(
    step: ProfileStep, 
    value: any, 
    profile: UserProfile
  ): boolean {
    switch (step.type) {
      case 'input':
        return this.validateInputField(step.key, value);
      
      case 'multi-select':
        return Array.isArray(value) && (step.optional || value.length > 0);
      
      case 'days':
        // Seulement requis si batch_cooking est true
        return !profile.batch_cooking || (Array.isArray(value) && value.length > 0);
      
      case 'select':
      case 'boolean':
        return value !== undefined && value !== null;
      
      default:
        return true;
    }
  }

  /**
   * Valide un champ de saisie
   */
  private static validateInputField(key: keyof UserProfile, value: any): boolean {
    // Champs numériques obligatoires
    if (['age', 'height_cm', 'weight_kg'].includes(key as string)) {
      return typeof value === 'number' && value > 0;
    }
    
    // Champ disliked_foods est optionnel
    if (key === 'disliked_foods') {
      return true;
    }
    
    // Autres champs texte
    return typeof value === 'string' && value.trim().length > 0;
  }

  /**
   * Valide l'ensemble du profil
   */
  static isProfileComplete(profile: UserProfile | null): boolean {
    if (!profile) return false;

    const requiredFields: (keyof UserProfile)[] = [
      'goal', 'age', 'gender', 'height_cm', 'weight_kg',
      'physical_activity', 'cooking_level', 'cooking_time',
      'household_size', 'weekly_budget_eur', 'batch_cooking'
    ];

    return requiredFields.every(field => {
      const value = profile[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
