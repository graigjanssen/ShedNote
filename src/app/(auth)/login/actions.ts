"use server";

import { redirect } from "next/navigation";
import { authSchema } from "@/lib/schemas/auth";
import { createActionClient } from "@/lib/supabase/action-client";

export async function signInAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = authSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  }

  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  redirect("/dashboard");
}
