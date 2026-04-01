"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(params: {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
  previousUsername: string;
}): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: params.full_name,
      username: params.username,
      bio: params.bio,
      avatar_url: params.avatar_url,
    })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath(`/${params.previousUsername}`);
  if (params.username !== params.previousUsername) {
    revalidatePath(`/${params.username}`);
  }
}

export async function removeFollowerAction(followerId: string): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Use admin client to bypass RLS since we're deleting another user's follow row
  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );

  const { error } = await admin
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", user.id);
  if (error) throw error;
}
