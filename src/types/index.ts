// Types de base pour l'application
export * from './UserProfile';

export interface UserProfile {
  id: string
  email: string
  nom?: string
  prenom?: string
  age?: number
  sexe?: 'homme' | 'femme' | 'autre'
  taille?: number // en cm
  poids?: number // en kg
  niveau_activite: 'sedentaire' | 'leger' | 'modere' | 'intense' | 'tres_intense'
  objectif: 'maintien' | 'perte_poids' | 'prise_masse' | 'equilibre'
  budget_hebdomadaire?: number // en euros
  niveau_cuisine: 'debutant' | 'intermediaire' | 'avance'
  preferences_alimentaires?: string[]
  allergies?: string[]
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  titre: string
  description: string
  temps_preparation: number // en minutes
  temps_cuisson: number // en minutes
  difficulte: 'facile' | 'moyen' | 'difficile'
  nombre_personnes: number
  ingredients: Ingredient[]
  etapes: string[]
  valeurs_nutritionnelles: NutritionalValues
  tags: string[]
  image_url?: string
  created_at: string
}

export interface Ingredient {
  nom: string
  quantite: number
  unite: string
  prix_estime?: number // en euros
  calories_pour_100g?: number
}

export interface NutritionalValues {
  calories: number
  proteines: number // en grammes
  glucides: number // en grammes
  lipides: number // en grammes
  fibres: number // en grammes
  sucres: number // en grammes
  sel: number // en grammes
}

export interface WeeklyMenu {
  id: string
  user_id: string
  semaine_debut: string // Format ISO date
  repas: MealPlan[]
  liste_courses: ShoppingList
  cout_estime: number // en euros
  created_at: string
  updated_at: string
}

export interface MealPlan {
  jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'
  type_repas: 'petit_dejeuner' | 'dejeuner' | 'collation' | 'diner'
  recipe_id: string
  recipe: Recipe
  portions: number
}

export interface ShoppingList {
  categories: ShoppingCategory[]
  cout_total: number
}

export interface ShoppingCategory {
  nom: string // Ex: "Fruits et légumes", "Viandes et poissons", etc.
  items: ShoppingItem[]
}

export interface ShoppingItem {
  nom: string
  quantite: number
  unite: string
  prix_estime?: number
  achete?: boolean
}

// Types pour l'API OpenAI
export interface RecipeGenerationRequest {
  profile: UserProfile
  nombre_repas: number
  preferences?: string[]
  restrictions?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
