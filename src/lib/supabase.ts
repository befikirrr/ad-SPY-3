// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcukpvcefvuewgktcqzg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdWtwdmNlZnZ1ZXdna3RjcXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk5NTgsImV4cCI6MjA2OTk5NTk1OH0.rVbhC2A7YnH2tUakWOn_-MRM8ZLxjj7Gbf09ncP0Z74'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
