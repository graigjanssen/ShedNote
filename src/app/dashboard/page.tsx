import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-neutral-400">
          Please{" "}
          <a href="/login" className="underline">
            sign in
          </a>
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm">Signed in as {user.email}</p>

      <div className="flex-gap-3">
        <Link
          href="/entries/new"
          className="rounded bg-blue-600 px-3 py-1 hover:bg-blue-500"
        >
          New entry
        </Link>
        <form action="/signout" method="post">
          <button className="rounded bg-neutral-800 px-3 py-1 hover:bg-neutral-700">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
