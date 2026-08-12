import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase anon key (first 20 chars):", supabaseAnonKey?.slice(0, 20));
console.log("Supabase anon key length:", supabaseAnonKey?.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);