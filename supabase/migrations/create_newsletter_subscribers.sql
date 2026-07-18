-- Create newsletter_subscribers table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'homepage',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anon and service_role to insert
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

-- Only service_role can select
CREATE POLICY "Service role can view" ON public.newsletter_subscribers
  FOR SELECT
  TO service_role
  USING (true);
