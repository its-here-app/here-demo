import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserUsername } from "@/lib/services/users";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const username = await getUserUsername(user.id);
  if (username) redirect(`/${username}`);

  redirect("/create-account");
}
