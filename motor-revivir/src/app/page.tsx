'use client'
// La app completa vive en /app — este archivo redirige
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => { router.replace('/app') }, [router])
  return null
}
