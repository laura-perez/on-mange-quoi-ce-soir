# On mange quoi ce soir ? 🍽️

**Application web mobile-first** qui génère chaque semaine un menu personnalisé selon le profil nutritionnel de l'utilisateur.

## Objectif

Permettre à chacun·e de mieux manger sans y penser :

- Création d'un profil nutrition (objectif, budget, goûts, niveau de cuisine…)
- Génération de recettes adaptées via l'API ChatGPT
- Sélection des plats désirés (avec possibilité d'alternatives)
- Génération automatique d'une liste de courses claire
- Sauvegarde des menus (si connecté)

## Stack

- Frontend : Next.js (TypeScript) + Tailwind CSS
- Backend : Supabase (auth, db, storage)
- IA : OpenAI GPT-4-turbo (via Supabase Edge Functions)
- Hosting : Vercel

## Fonctionnalités MVP

1. Création de profil nutrition guidée
2. Sélection du nombre de repas souhaités
3. Génération de suggestions de recettes
4. Sélection des recettes et portions
5. Génération locale de la liste de courses
6. Auth facultative pour sauvegarder menus & préférences

## Installation

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
src/
├── app/          # Pages et layouts Next.js 14
├── components/   # Composants React réutilisables
├── hooks/        # Custom hooks React
├── services/     # Services API (Supabase, OpenAI)
├── lib/          # Utilitaires et helpers
└── types/        # Types TypeScript
```

## Configuration

1. Créer un fichier `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

2. Configurer votre projet Supabase avec les tables nécessaires

## Instructions pour Copilot 🤖

Copilot doit suivre les intentions de cette application centrée utilisateur :

- Proposer du code lisible, clair, documenté
- Optimiser la logique métier
- Respecter la structure des composants React + Tailwind
- Proposer des noms de fonction cohérents avec le domaine
