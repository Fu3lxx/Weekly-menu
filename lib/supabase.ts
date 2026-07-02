import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return url;
}

function getSupabaseAnonKey() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }
  return anonKey;
}

export function getBrowserSupabase() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

export function getServerSupabase() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}
