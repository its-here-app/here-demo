import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              console.error("Cookie set error:", error);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (!existingProfile || !existingProfile.username) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name || user.user_metadata?.name || null,
          });

          return NextResponse.redirect(new URL("/create-account", request.url));
        }

        return NextResponse.redirect(
          new URL(`/${existingProfile.username}`, request.url)
        );
      }
    } else {
      console.error("Session exchange failed:", error);
    }
  }

  console.log("Fallback redirect to login");
  return NextResponse.redirect(new URL("/login", request.url));
}
