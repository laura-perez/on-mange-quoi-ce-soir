import { UserProfileWizard } from '@/components/forms/UserProfileWizard';

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-[#FFFBF5]">
      <UserProfileWizard />
    </main>
  );
}

export const metadata = {
  title: 'Mon Profil | On mange quoi ce soir ?',
  description: 'Créez votre profil nutritionnel personnalisé pour recevoir des recommandations de menus adaptés à vos besoins.',
};
