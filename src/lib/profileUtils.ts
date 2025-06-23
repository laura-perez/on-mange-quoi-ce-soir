import type { UserProfile } from '@/types/UserProfile';

/**
 * Utilitaires pour la gestion et la validation des profils utilisateur
 */
export class ProfileUtils {
  /**
   * Normalise une valeur d'affichage vers le format attendu par UserProfile
   */
  static normalizeValueForField(key: keyof UserProfile, value: string): any {
    switch (key) {
      case 'gender':
        return value.toLowerCase().replace(' ', '_').replace('é', 'e') as UserProfile['gender'];
      
      case 'physical_activity':
        return value.toLowerCase().replace('é', 'e') as UserProfile['physical_activity'];
      
      case 'cooking_level':
        return value.toLowerCase().replace(' ', '_').replace('é', 'e') as UserProfile['cooking_level'];
      
      case 'household_size':
        return value.toLowerCase() as UserProfile['household_size'];
      
      case 'weekly_budget_eur':
        if (value.includes('<30')) return 'moins_30';
        if (value.includes('30–50')) return '30_50';
        if (value.includes('50–80')) return '50_80';
        if (value.includes('+80')) return 'plus_80';
        return 'inconnu';
      
      case 'diet_preferences':
        return value.toLowerCase().replace('é', 'e').replace(' ', '_');
      
      default:
        return value;
    }
  }

  /**
   * Convertit un tableau de chaînes séparées par des virgules
   */
  static parseCommaSeparatedValues(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  /**
   * Convertit un tableau en chaîne séparée par des virgules
   */
  static formatArrayToString(values: string[]): string {
    return Array.isArray(values) ? values.join(', ') : '';
  }

  /**
   * Obtient le placeholder approprié pour un champ donné
   */
  static getPlaceholderForField(key: keyof UserProfile): string {
    switch (key) {
      case 'goal': return 'Ex: Manger plus équilibré';
      case 'age': return 'Ex: 25';
      case 'height_cm': return 'Ex: 170';
      case 'weight_kg': return 'Ex: 70';
      case 'disliked_foods': return 'Ex: champignons, tofu';
      default: return '';
    }
  }

  /**
   * Détermine si un champ nécessite une saisie numérique
   */
  static isNumericField(key: keyof UserProfile): boolean {
    return ['age', 'height_cm', 'weight_kg'].includes(key as string);
  }

  /**
   * Valide une valeur numérique
   */
  static validateNumericValue(value: string): number | null {
    const numValue = parseInt(value, 10);
    return (!isNaN(numValue) && numValue > 0) ? numValue : null;
  }

  /**
   * Normalise un nom de jour vers le format attendu
   */
  static normalizeDayName(day: string): string {
    return day.toLowerCase();
  }

  /**
   * Options prédéfinies pour les jours de la semaine
   */
  static getDaysOptions(): string[] {
    return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  }
}
