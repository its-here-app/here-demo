import { createClient } from "./supabase/client";

export function track(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {}
) {
  const supabase = createClient();
  // fire-and-forget — never block the UI on analytics
  supabase.from("events").insert({ user_id: userId, event, properties });
}
