import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <header
        role="navigation"
        aria-label="En-tête de navigation"
        className="fixed top-0 left-0 right-0 z-50 bg-[#FFFBF5] border-b border-gray-200"
      >
        <div className="px-4 py-4">
          <h1 className="text-center text-xl font-semibold text-gray-900">
            On mange quoi ce soir ?
          </h1>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-screen-md mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
