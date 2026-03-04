import { createClient } from "../supabase/client";
import type { Profile } from "@/types";

export async function getUsers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getUserByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (error || !data) return null;
  return data;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data;
}

export async function getUserUsername(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();
  return data?.username ?? null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "username" | "bio" | "avatar_url">>
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

export async function uploadProfilePhoto(
  userId: string,
  file: File,
  currentUrl?: string
): Promise<string> {
  const supabase = createClient();

  if (currentUrl) {
    const oldFileName = currentUrl.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from("profile-photos").remove([oldFileName]);
    }
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, file);
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(fileName);

  return publicUrl;
}

export async function createUser(params: { name: string; username: string }) {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to create user");
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
