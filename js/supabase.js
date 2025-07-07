const SUPABASE_URL = 'https://gcynafozefgnmxpbtoeb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeW5hZm96ZWZnbm14cGJ0b2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzgwNDIsImV4cCI6MjA2NzIxNDA0Mn0.rl_kSHx2WZn-e7JNnx-nHnGAaHWuYLDZlz2R143jyoY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabaseClient as supabase };