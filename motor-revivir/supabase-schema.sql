-- ═══════════════════════════════════════════════════════════
-- MOTOR REVIVIR — Esquema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ── USUARIOS (tabla interna, no auth de Supabase) ──
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,            -- 'enrique' | 'jenny'
  nombre TEXT NOT NULL,
  inicial TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO usuarios VALUES
  ('enrique', 'Enrique Vásquez', 'E', '#5BAF3A', NOW()),
  ('jenny',   'Jenny Sáez',      'J', '#2B6CB0', NOW())
ON CONFLICT (id) DO NOTHING;

-- ── CLIENTES ──
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY DEFAULT ('CLI-' || gen_random_uuid()::text),
  nombre TEXT NOT NULL,
  contacto TEXT,
  cargo TEXT,
  email TEXT,
  tel TEXT,
  rut TEXT,
  direccion TEXT,
  ciudad TEXT,
  linea TEXT DEFAULT 'Regalos Corp.',
  estado TEXT DEFAULT 'prospecto',   -- prospecto | activo | inactivo
  notas TEXT,
  usuario_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── LEADS ──
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  empresa TEXT NOT NULL,
  contacto TEXT,
  cargo TEXT,
  linea TEXT DEFAULT 'Regalos Corp.',
  monto NUMERIC DEFAULT 0,
  estado TEXT DEFAULT 'lead',       -- lead | contactado | cotizacion | negociacion | cerrado
  temperatura TEXT DEFAULT 'frio',  -- frio | tibio | caliente
  prioridad TEXT DEFAULT 'media',   -- baja | media | alta
  dias_sin_contacto INTEGER DEFAULT 0,
  notas TEXT,
  usuario_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── COTIZACIONES ──
CREATE TABLE IF NOT EXISTS cotizaciones (
  id TEXT PRIMARY KEY,              -- COT-001, COT-002...
  empresa TEXT NOT NULL,
  contacto TEXT,
  cargo TEXT,
  rut TEXT,
  direccion TEXT,
  ciudad TEXT,
  telefono TEXT,
  estado TEXT DEFAULT 'borrador',   -- borrador | enviada | aprobada | rechazada | cerrada
  notas TEXT,
  fecha TEXT,
  usuario_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ITEMS DE COTIZACIÓN ──
CREATE TABLE IF NOT EXISTS cotizacion_items (
  id BIGSERIAL PRIMARY KEY,
  cotizacion_id TEXT REFERENCES cotizaciones(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unit_neto NUMERIC NOT NULL,
  costo_unit_neto NUMERIC DEFAULT 0,
  kg_por_unidad NUMERIC DEFAULT 0,
  es_personalizado BOOLEAN DEFAULT FALSE,
  orden INTEGER DEFAULT 0
);

-- ── ÓRDENES DE TRABAJO (OTs) ──
CREATE TABLE IF NOT EXISTS ordenes_trabajo (
  id TEXT PRIMARY KEY,              -- OT-COT001-1, OT-COT001-2...
  cotizacion_id TEXT REFERENCES cotizaciones(id),
  cliente_id TEXT REFERENCES clientes(id),
  empresa TEXT NOT NULL,
  descripcion TEXT NOT NULL,        -- "Galvano Personalizado ×100"
  estado TEXT DEFAULT 'cotizacion', -- cotizacion | produccion | terminacion | listo | entregado | registro
  archivado BOOLEAN DEFAULT FALSE,
  fecha_entrada DATE,
  fecha_entrega DATE,
  ot_numero TEXT,
  notas TEXT,
  monto_neto NUMERIC DEFAULT 0,
  monto_con_iva NUMERIC DEFAULT 0,
  kg_plastico NUMERIC DEFAULT 0,
  -- Para conectar OTs hermanas de la misma cotización
  items_cotizacion JSONB,           -- array de nombres de todos los items de la cotización
  item_index INTEGER DEFAULT 0,     -- qué item es esta OT dentro de la cotización
  usuario_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUBTAREAS DE OT ──
CREATE TABLE IF NOT EXISTS ot_subtareas (
  id BIGSERIAL PRIMARY KEY,
  ot_id TEXT REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
  estado_padre TEXT NOT NULL,       -- cotizacion | produccion | terminacion | listo | entregado
  label TEXT NOT NULL,
  completado BOOLEAN DEFAULT FALSE,
  orden INTEGER DEFAULT 0
);

-- ── REGISTROS (trabajos completados) ──
CREATE TABLE IF NOT EXISTS registros (
  id TEXT PRIMARY KEY DEFAULT ('REG-' || gen_random_uuid()::text),
  ot_id TEXT,                       -- referencia a OT original
  cotizacion_id TEXT,
  cliente_id TEXT REFERENCES clientes(id),
  empresa TEXT NOT NULL,
  descripcion TEXT,
  monto_neto NUMERIC DEFAULT 0,
  kg_plastico NUMERIC DEFAULT 0,
  fecha TEXT,
  notas TEXT,
  usuario_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ÍNDICES para rendimiento ──
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_cots_empresa ON cotizaciones(empresa);
CREATE INDEX IF NOT EXISTS idx_ots_estado ON ordenes_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_ots_cotizacion ON ordenes_trabajo(cotizacion_id);
CREATE INDEX IF NOT EXISTS idx_ots_cliente ON ordenes_trabajo(cliente_id);
CREATE INDEX IF NOT EXISTS idx_regs_cliente ON registros(cliente_id);
CREATE INDEX IF NOT EXISTS idx_subtareas_ot ON ot_subtareas(ot_id);

-- ── ROW LEVEL SECURITY (RLS) ──
-- Por ahora abierto para el equipo interno (Enrique y Jenny)
-- En producción puedes restringir por usuario_id

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizacion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_trabajo ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_subtareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- Política: acceso público (mientras no uses Supabase Auth)
-- Cambia esto cuando implementes login real con Supabase Auth
CREATE POLICY "Acceso total equipo" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON cotizaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON cotizacion_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON ordenes_trabajo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON ot_subtareas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total equipo" ON registros FOR ALL USING (true) WITH CHECK (true);

-- ── FUNCIÓN: updated_at automático ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cotizaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ordenes_trabajo FOR EACH ROW EXECUTE FUNCTION update_updated_at();
