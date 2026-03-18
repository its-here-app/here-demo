"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(params: {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
  previousUsername: string;
}): Promise<void> {
  const supabase = await createClient();
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
