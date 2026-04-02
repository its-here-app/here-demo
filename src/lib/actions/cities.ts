"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function upsertCityAction(params: {
  google_place_id: string;
  display_name: string;
}): Promise<string> {
  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );

  // Try to find existing city first
  const { data: existing } = await admin
    .from("cities")
    .select("id")
    .eq("google_place_id", params.google_place_id)
    .maybeSingle();

  if (existing) return existing.id;

  // Insert new city
  const { data: inserted, error } = await admin
    .from("cities")
    .insert({
      google_place_id: params.google_place_id,
      display_name: params.display_name,
    })
    .select("id")
    .single();

  if (error) throw error;
  return inserted.id;
}
