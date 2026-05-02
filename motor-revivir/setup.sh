#!/bin/bash
# setup.sh — Motor Revivir
# Ejecutar: bash setup.sh

echo "═══════════════════════════════════"
echo "  Motor Revivir — Setup"
echo "═══════════════════════════════════"

# 1. Instalar dependencias
echo ""
echo "1/3 Instalando dependencias..."
npm install

# 2. Verificar .env.local
if grep -q "TU_PROJECT_ID" .env.local; then
  echo ""
  echo "⚠  IMPORTANTE: Configura tu .env.local"
  echo "   Edita el archivo .env.local y reemplaza:"
  echo "   - TU_PROJECT_ID  → tu ID de proyecto Supabase"
  echo "   - TU_ANON_KEY    → tu clave anon de Supabase"
  echo ""
  echo "   Encuentra estos valores en:"
  echo "   Supabase Dashboard → Settings → API"
fi

# 3. Recordatorio SQL
echo ""
echo "2/3 Base de datos:"
echo "   Ejecuta supabase-schema.sql en Supabase SQL Editor"

echo ""
echo "3/3 Para iniciar el servidor:"
echo "   npm run dev"
echo ""
echo "Abre http://localhost:3000"
echo "═══════════════════════════════════"
