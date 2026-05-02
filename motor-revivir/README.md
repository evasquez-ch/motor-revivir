# Motor Revivir 🌱

Sistema interno de gestión para **Revivir** — leads, cotizaciones, producción y registros.

---

## Stack

- **Frontend**: Next.js 14 + TypeScript + React
- **Base de datos**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **Repo**: GitHub

---

## Setup en 5 pasos

### 1. Clonar y instalar

```bash
git clone https://github.com/TU_USUARIO/motor-revivir.git
cd motor-revivir
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → New Project
2. Nómbralo `motor-revivir`
3. Guarda la contraseña de la DB
4. Espera a que cargue (~2 min)

### 3. Ejecutar el esquema SQL

1. En Supabase: **SQL Editor → New Query**
2. Pega el contenido de `supabase-schema.sql`
3. Click **Run**

### 4. Configurar variables de entorno

Copia `.env.local` y llena los valores:

```bash
cp .env.local.example .env.local
```

Obtén los valores en Supabase → **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public key

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel:
# Dashboard → tu proyecto → Settings → Environment Variables
# Agregar: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
```

O conecta el repo de GitHub directamente desde vercel.com → Import Project.

---

## Estructura del proyecto

```
motor-revivir/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Redirige a /app
│   │   ├── globals.css         # Estilos globales
│   │   └── app/
│   │       └── page.tsx        # App principal
│   ├── components/
│   │   ├── MotorApp.tsx        # Componente raíz
│   │   ├── styles.ts           # Estilos en JS
│   │   └── pages/              # Sub-páginas
│   │       ├── LoginPage.tsx
│   │       ├── SbNav.tsx
│   │       ├── Dashboard.tsx
│   │       ├── CRM.tsx
│   │       ├── Cotizaciones.tsx
│   │       ├── Clientes.tsx
│   │       ├── Produccion.tsx
│   │       ├── Registros.tsx
│   │       ├── Catalogo.tsx
│   │       └── Calculadora.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase
│   │   ├── catalogo.ts         # Productos y constantes
│   │   └── db.ts               # Funciones de acceso a datos
│   └── types/
│       └── index.ts            # Tipos TypeScript
├── supabase-schema.sql         # Esquema de la BD
├── .env.local                  # Variables (NO subir a git)
├── .gitignore
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Flujo de trabajo

```
Lead (CRM) 
  → Cotización creada 
  → Cotización enviada al cliente 
  → Cotización APROBADA ← aquí se generan las Fichas OT automáticamente
  → Fichas OT entran al Kanban de Producción (una por producto)
  → Cada ficha avanza: Cotización → Producción → Terminación → Listo → Entregado
  → Al marcar "Pasar a Registros" → desaparece del kanban y queda en historial
  → El historial conecta con la ficha del cliente
```

---

## Usuarios

- **Enrique Vásquez** (verde) — Fundador
- **Jenny Sáez** (azul) — Ventas

Cada acción queda registrada con el usuario que la realizó.

---

## Próximos pasos sugeridos

- [ ] Autenticación real con Supabase Auth (reemplazar login actual)
- [ ] Notificaciones WhatsApp cuando una OT cambia de estado (n8n + Twilio)
- [ ] Exportación de reportes a Excel
- [ ] Módulo de contabilidad con movimientos reales
- [ ] App móvil con Expo (mismo backend Supabase)
