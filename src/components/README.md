# Components

Structure des composants React de l'application.

## Organisation

- `ui/` - Composants d'interface utilisateur réutilisables (Button, Input, Modal, etc.)
- `layout/` - Composants de mise en page (Header, Footer, Sidebar, etc.)
- `forms/` - Formulaires spécifiques à l'application
- `recipes/` - Composants liés aux recettes et à la cuisine

## Convention de nommage

- Utilisez PascalCase pour les noms de composants
- Un fichier par composant
- Exportez toujours les composants via `index.ts`

## Exemple

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium',
        variant === 'primary'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-900'
      )}
    >
      {children}
    </button>
  );
}
```
