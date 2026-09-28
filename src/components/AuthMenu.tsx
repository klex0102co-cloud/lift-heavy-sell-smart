import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading) return null;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex items-center gap-2 rounded-[10px] border border-white/15 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:border-oxblood hover:text-oxblood"
      >
        <User className="size-3.5" />
        Sign in
      </Link>
    );
  }

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <button
      onClick={handleSignOut}
      title={user.email ?? "Account"}
      className="flex items-center gap-2 rounded-[10px] border border-white/15 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:border-oxblood hover:text-oxblood"
    >
      <LogOut className="size-3.5" />
      Sign out
    </button>
  );
}
