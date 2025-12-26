
import { createClient } from '@supabase/supabase-js';

// Vercel/Production ke liye Environment Variables use karein
// Agar variables nahi milte to fallback (hardcoded) values use hongi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oeapydozfzsqimrqwwin.supabase.co'; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYXB5ZG96ZnpzcWltcnF3d2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTIwNzksImV4cCI6MjA4MjMyODA3OX0.QR25X94rbtBlqdKiqls3Upd37nhc4zsJuNDhFgZJQc4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
