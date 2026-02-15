ALTER TABLE requests 
ADD COLUMN lead_id UUID REFERENCES leads(id);
