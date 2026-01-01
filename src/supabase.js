import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://hyhfxemhuxzejdgjjrfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aGZ4ZW1odXh6ZWpkZ2pqcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzU5ODMsImV4cCI6MjA4Mjg1MTk4M30.ECm-MK6UKbkPgF9i343u17zFa8igarZBOuCW0QYioXc'
)