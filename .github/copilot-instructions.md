# Instructions GitHub Copilot - On mange quoi ce soir ?

## Contexte du projet
Application web mobile-first de génération de menus personnalisés avec IA, développée avec Next.js 15, TypeScript, Tailwind CSS et Supabase.

## Règles de développement

### Approche de développement
- **Exécuter UNIQUEMENT les tâches spécifiées** dans chaque prompt - pas de fonctionnalités supplémentaires
- **Suivre les prompts à la lettre** - ne pas improviser ou ajouter des features non demandées
- **Donner des conseils de qualité** seulement quand c'est pertinent et apporte une vraie valeur

### Standards de qualité Enterprise (Apple/Google)

#### Architecture & Structure
- **Séparation claire des responsabilités** : composants UI, logique métier, services API
- **Patterns établis** : Custom hooks, service layer, barrel exports
- **Structure de dossiers cohérente** : `/components`, `/hooks`, `/services`, `/lib`, `/types`
- **Single Responsibility Principle** : une fonction/composant = une responsabilité

#### Performance
- **React optimizations** : `memo`, `useMemo`, `useCallback` quand approprié
- **Lazy loading** : composants et routes avec `Suspense`
- **Bundle splitting** : imports dynamiques pour les gros composants
- **Éviter les re-renders** : optimiser les dépendances des hooks

#### Sécurité
- **Validation stricte** : zod pour les schémas de validation
- **Sanitisation** : toujours nettoyer les inputs utilisateur
- **Gestion d'erreurs robuste** : try/catch avec fallbacks appropriés
- **Variables d'environnement** : jamais d'API keys en dur dans le code

#### Maintenabilité
- **Code auto-documenté** : noms explicites, commentaires JSDoc quand nécessaire
- **Types TypeScript précis** : éviter `any`, utiliser des unions et interfaces strictes
- **Gestion d'état prévisible** : patterns cohérents pour les états loading/error/success
- **Tests unitaires** : coverage des fonctions critiques

#### UX/UI
- **États de chargement** : skeletons ou spinners appropriés
- **Gestion d'erreur élégante** : messages d'erreur compréhensibles
- **Feedback utilisateur** : confirmations, toasts, indicateurs visuels
- **Accessibilité** : ARIA labels, navigation clavier, contraste

## Configuration technique

### Stack
- **Frontend** : Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend** : Supabase (auth, database, storage)
- **IA** : OpenAI GPT-4 via Supabase Edge Functions
- **Deployment** : Vercel

### Outils de qualité
- **ESLint** : rules strictes avec Prettier integration
- **Prettier** : formatage automatique cohérent
- **TypeScript strict mode** : configuration stricte activée
- **EditorConfig** : normalisation des styles d'édition

### Structure des fichiers
```
src/
├── app/          # Pages et layouts Next.js 14+ (App Router)
├── components/   # Composants React réutilisables
│   ├── ui/       # Composants d'interface de base
│   ├── layout/   # Composants de mise en page
│   └── forms/    # Formulaires spécifiques
├── hooks/        # Custom hooks React
├── services/     # Services API (Supabase, OpenAI)
├── lib/          # Utilitaires et helpers
└── types/        # Types TypeScript
```

## Bonnes pratiques spécifiques

### Composants React
```typescript
// ✅ Exemple de composant bien structuré
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = memo(({ variant, size = 'md', loading, children, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});

Button.displayName = 'Button';
```

### Hooks personnalisés
```typescript
// ✅ Hook avec gestion d'état complète
export function useAsyncOperation<T>() {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await operation();
      setState({ data, loading: false, error: null });
      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { data: null, error: errorMessage };
    }
  }, []);

  return { ...state, execute };
}
```

### Services API
```typescript
// ✅ Service avec gestion d'erreur robuste
export class APIService {
  private async handleRequest<T>(request: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
    try {
      const data = await request();
      return { data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue' 
      };
    }
  }
}
```

## À éviter absolument
- ❌ Fonctionnalités non demandées dans le prompt
- ❌ Types `any` sans justification
- ❌ Mutations directes d'état
- ❌ Logique métier dans les composants UI
- ❌ Hardcoding de valeurs (utiliser des constantes)
- ❌ Composants de plus de 200 lignes sans décomposition

## Domaine métier - Cuisine & Nutrition
- **Terminologie française** : utilisateur privilégier les termes culinaires français
- **Unités métriques** : grammes, litres, celsius
- **Respect des contraintes alimentaires** : allergies, régimes, préférences
- **Logique nutritionnelle** : calculs BMR, TDEE, macronutriments

---

**Remember** : Quality over speed. Better to write less code that's bulletproof than more code that's fragile.
