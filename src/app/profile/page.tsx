import { requireUser } from "@/lib/server";
import { Button } from "@/design";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-6 font-serif text-[clamp(32px,4vw,48px)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
          Perfil
        </h1>
        
        <div className="rounded-[20px] border border-terracotta-light bg-white/80 px-8 py-10">
          <h2 className="mb-4 font-serif text-[clamp(24px,3vw,32px)] font-semibold text-terracotta">
            Olá, {user.email?.split('@')[0] || 'Usuário'}!
          </h2>
          
          <p className="mb-6 text-base leading-[1.7] text-terracotta-light/80">
            Esta página está em construção. Aqui você poderá visualizar e editar suas informações de perfil.
          </p>
          
          <div className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            {/* Additional profile fields will be added here */}
          </div>
          
          <Button 
            variant="secondary" 
            size="md"
            className="w-full max-w-xs"
          >
            Editar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}