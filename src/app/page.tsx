'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleCreateProfile = () => {
    router.push('/profil');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Des menus qui te ressemblent
          </h1>
          <p className="text-xl text-gray-700">
            On te prépare un menu aux petits oignons 🍲
          </p>
        </div>        
        <button 
          onClick={handleCreateProfile}
          className="bg-[#A3C9A8] text-white px-8 py-3 rounded-2xl font-medium hover:opacity-90 transition-opacity"
        >
          Créer mon profil nutrition
        </button>        
        <div>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}