import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Temporary placeholder until onboarding exists
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Mirror AI</h1>
        <p className="text-zinc-400">
          Authentication successful. Onboarding coming next.
        </p>
        <p className="text-sm text-zinc-500">
          Logged in as {session.user.email}
        </p>
      </div>
    </div>
  );
}
