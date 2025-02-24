import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export { supabase };
