-- Create whatsapp_sessions table
CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'STOPPED',
    api_key VARCHAR(255),
    push_name VARCHAR(255),
    connected_phone VARCHAR(50),
    webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id VARCHAR(255) PRIMARY KEY, -- The waappa message id
    session_name VARCHAR(255) REFERENCES public.whatsapp_sessions(session_name) ON DELETE CASCADE,
    timestamp BIGINT NOT NULL,
    from_jid VARCHAR(255) NOT NULL,
    to_jid VARCHAR(255) NOT NULL,
    from_me BOOLEAN DEFAULT FALSE,
    body TEXT,
    has_media BOOLEAN DEFAULT FALSE,
    media_url TEXT,
    media_type VARCHAR(50),
    ack INTEGER,
    ack_name VARCHAR(50),
    source VARCHAR(50),
    contact_phone VARCHAR(50),
    contact_type VARCHAR(50) DEFAULT 'unknown', -- 'student', 'teacher', 'unknown'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for fast chatting queries
CREATE INDEX IF NOT EXISTS idx_wa_messages_contact_phone ON public.whatsapp_messages(contact_phone);
CREATE INDEX IF NOT EXISTS idx_wa_messages_timestamp ON public.whatsapp_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_wa_messages_contact_type ON public.whatsapp_messages(contact_type);

-- RLS Policies
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and write sessions and messages
CREATE POLICY "Allow all access to authenticated users on whatsapp_sessions" ON public.whatsapp_sessions FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Allow all access to authenticated users on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_sessions_modtime
BEFORE UPDATE ON public.whatsapp_sessions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_whatsapp_messages_modtime
BEFORE UPDATE ON public.whatsapp_messages
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
