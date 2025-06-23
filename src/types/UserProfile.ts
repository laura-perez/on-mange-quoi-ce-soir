export interface UserProfile {
  id?: string; // optionnel si pas encore connecté
  goal: string;
  age: number;
  gender: 'homme' | 'femme' | 'autre' | 'non_precise';
  height_cm: number;
  weight_kg: number;
  physical_activity: 'sedentaire' | 'moderee' | 'reguliere' | 'intense' | 'autre';
  diet_preferences: string[]; // vegan, sans lactose, etc.
  disliked_foods: string[]; // ex : champignons, tofu
  cooking_level: 'debutant' | 'a_laise' | 'experimente' | 'passionne';
  cooking_time: string; // ex : "<30min", "dimanche", etc.
  household_size: 'solo' | 'couple' | 'famille' | 'variable';
  weekly_budget_eur: 'moins_30' | '30_50' | '50_80' | 'plus_80' | 'inconnu';
  batch_cooking: boolean;
  batch_days: string[]; // ["dimanche", "mercredi"]
  created_at?: string;
  updated_at?: string;
}
