// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kstxfwegqrmkwgmdolfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdHhmd2VncXJta3dnbWRvbGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTU0NjAsImV4cCI6MjA2MDIzMTQ2MH0.Qd5_KkKUweGvmZ4oApsRPdrsssV5qeJYkVT6D54-MHM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);