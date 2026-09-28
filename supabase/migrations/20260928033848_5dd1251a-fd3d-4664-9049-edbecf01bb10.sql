CREATE TABLE public.ab_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  weight INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ab_variants TO anon, authenticated;
GRANT ALL ON public.ab_variants TO service_role;
ALTER TABLE public.ab_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active variants" ON public.ab_variants FOR SELECT TO anon, authenticated USING (active = true);

CREATE TABLE public.ab_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (visitor_id)
);
GRANT SELECT, INSERT ON public.ab_assignments TO anon, authenticated;
GRANT ALL ON public.ab_assignments TO service_role;
ALTER TABLE public.ab_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can create their own assignment" ON public.ab_assignments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Visitors can read their own assignment" ON public.ab_assignments FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.ab_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  variant_id UUID REFERENCES public.ab_variants(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ab_events TO anon, authenticated;
GRANT ALL ON public.ab_events TO service_role;
ALTER TABLE public.ab_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record events" ON public.ab_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read events" ON public.ab_events FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX idx_ab_events_variant_type ON public.ab_events (variant_id, event_type);
CREATE INDEX idx_ab_assignments_variant ON public.ab_assignments (variant_id);