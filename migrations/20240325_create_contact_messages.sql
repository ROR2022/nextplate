-- Crear tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Establecer políticas RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Solo administradores pueden leer todos los mensajes
CREATE POLICY "Admins can read all messages" 
  ON contact_messages
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Cualquiera puede insertar mensajes (formulario público)
CREATE POLICY "Anyone can submit contact messages" 
  ON contact_messages
  FOR INSERT 
  WITH CHECK (true);

-- Comentario para la tabla
COMMENT ON TABLE contact_messages IS 'Mensajes enviados a través del formulario de contacto'; 