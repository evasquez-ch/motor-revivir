'use client'
// Motor Revivir — App completa con Supabase
// Este archivo es el punto de entrada de la app Next.js
// Importa el componente principal que tiene toda la UI

import dynamic from 'next/dynamic'

// Cargamos la app sin SSR porque usa hooks de browser
const MotorApp = dynamic(() => import('@/components/MotorApp'), { ssr: false })

export default function AppPage() {
  return <MotorApp />
}
