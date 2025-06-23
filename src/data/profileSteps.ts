// 🔧 Contexte : Tableau d’étapes du profil nutritionnel, à parcourir dynamiquement dans le composant `UserProfileWizard`.

import { UserProfile } from '@/types/UserProfile';

type StepType = 'select' | 'input' | 'multi-select' | 'boolean' | 'days';

interface ProfileStep {
  key: keyof UserProfile;
  label: string;
  type: StepType;
  options?: string[]; // pour les select et multi-select
  optional?: boolean;
}

export const profileSteps: ProfileStep[] = [
  {
    key: 'goal',
    label: 'Quel est ton objectif principal ?',
    type: 'select',
    options: ['Perdre du poids', 'Gagner en énergie', 'Prendre du muscle', 'Manger équilibré'],
  },
  {
    key: 'age',
    label: 'Quel âge as-tu ?',
    type: 'input',
  },
  {
    key: 'gender',
    label: 'Quel est ton genre ?',
    type: 'select',
    options: ['Femme', 'Homme', 'Autre', 'Non précisé'],
  },
  {
    key: 'height_cm',
    label: 'Quelle est ta taille en cm ?',
    type: 'input',
  },
  {
    key: 'weight_kg',
    label: 'Quel est ton poids en kg ?',
    type: 'input',
  },
  {
    key: 'physical_activity',
    label: 'Quel est ton niveau d’activité physique ?',
    type: 'select',
    options: ['Sédentaire', 'Modérée', 'Régulière', 'Intense', 'Athlète'],
  },
  {
    key: 'diet_preferences',
    label: 'As-tu un régime alimentaire ?',
    type: 'multi-select',
    options: ['Végétarien', 'Végétalien', 'Flexitarien', 'Sans gluten', 'Sans lactose', 'Pas de porc', 'Aucun'],
  },
  {
    key: 'disliked_foods',
    label: 'Y a-t-il des aliments que tu veux éviter ?',
    type: 'input',
    optional: true,
  },
  {
    key: 'cooking_level',
    label: 'Quel est ton niveau en cuisine ?',
    type: 'select',
    options: ['Débutant', 'À l’aise', 'Expérimenté', 'Passionné'],
  },
  {
    key: 'cooking_time',
    label: 'Combien de temps as-tu pour cuisiner ?',
    type: 'select',
    options: ['<30min', '<1h','J\'ai tout mon temps'],
  },
  {
    key: 'household_size',
    label: 'Tu cuisines pour combien de personnes ?',
    type: 'select',
    options: ['Solo', 'Couple', 'Famille'],
  },
  {
    key: 'weekly_budget_eur',
    label: 'Quel est ton budget alimentaire hebdo ?',
    type: 'select',
    options: ['<30€', '30–50€', '50–80€', '+80€'],
    optional: true
  },
  {
    key: 'batch_cooking',
    label: 'Veux-tu faire du batch cooking ?',
    type: 'boolean',
    optional: true
  },
  {
    key: 'batch_days',
    label: 'Quels jours préfères-tu cuisiner ?',
    type: 'days',
    optional: true
  },
];
