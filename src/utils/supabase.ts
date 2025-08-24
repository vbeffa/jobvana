import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);
// const channelA = supabase
//   .channel("skills-changes")
//   .on("postgres_changes", { event: "*", schema: "public" }, (payload) =>
//     console.log(payload)
//   )
//   .subscribe();
// console.log(channelA);

export default supabase;
