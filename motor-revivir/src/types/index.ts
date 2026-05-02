// ═══════════════════════════════════════════
// MOTOR REVIVIR — Tipos TypeScript
// ═══════════════════════════════════════════

export type UsuarioId = 'enrique' | 'jenny'

export interface Usuario {
  id: UsuarioId
  nombre: string
  inicial: string
  color: string
}

export type EstadoLead = 'lead' | 'contactado' | 'cotizacion' | 'negociacion' | 'cerrado'
export type Temperatura = 'frio' | 'tibio' | 'caliente'
export type Prioridad = 'baja' | 'media' | 'alta'
export type EstadoCliente = 'prospecto' | 'activo' | 'inactivo'
export type EstadoCot = 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'cerrada'
export type EstadoOT = 'cotizacion' | 'produccion' | 'terminacion' | 'listo' | 'entregado' | 'registro'
export type LineaNegocio = 'Regalos Corp.' | 'Señalética' | 'Mobiliario' | 'HoReCa' | 'Viñas' | 'Mixto'

export interface Lead {
  id: number
  empresa: string
  contacto: string
  cargo: string
  linea: LineaNegocio
  monto: number
  estado: EstadoLead
  temperatura: Temperatura
  prioridad: Prioridad
  dias_sin_contacto: number
  notas: string
  usuario_id: UsuarioId
  created_at?: string
  updated_at?: string
}

export interface Cliente {
  id: string
  nombre: string
  contacto: string
  cargo: string
  email: string
  tel: string
  rut: string
  direccion: string
  ciudad: string
  linea: LineaNegocio
  estado: EstadoCliente
  notas: string
  usuario_id: UsuarioId
  created_at?: string
  updated_at?: string
}

export interface CotizacionItem {
  id?: number
  cotizacion_id?: string
  nombre: string
  cantidad: number
  precio_unit_neto: number
  costo_unit_neto: number
  kg_por_unidad: number
  es_personalizado?: boolean
  orden?: number
}

export interface Cotizacion {
  id: string
  empresa: string
  contacto: string
  cargo: string
  rut: string
  direccion: string
  ciudad: string
  telefono: string
  estado: EstadoCot
  notas: string
  fecha: string
  items: CotizacionItem[]   // se une desde cotizacion_items
  usuario_id: UsuarioId
  created_at?: string
  updated_at?: string
}

export interface Subtarea {
  id?: number
  ot_id?: string
  estado_padre: EstadoOT
  label: string
  completado: boolean
  orden: number
}

export interface OrdenTrabajo {
  id: string
  cotizacion_id: string | null
  cliente_id: string | null
  empresa: string
  descripcion: string
  estado: EstadoOT
  archivado: boolean
  fecha_entrada: string
  fecha_entrega: string
  ot_numero: string
  notas: string
  monto_neto: number
  monto_con_iva: number
  kg_plastico: number
  items_cotizacion: string[]   // nombres de todos los items de la misma cotización
  item_index: number
  subtareas: Record<string, Subtarea[]>  // agrupadas por estado_padre
  usuario_id: UsuarioId
  created_at?: string
  updated_at?: string
}

export interface Registro {
  id: string
  ot_id: string | null
  cotizacion_id: string | null
  cliente_id: string | null
  empresa: string
  descripcion: string
  monto_neto: number
  kg_plastico: number
  fecha: string
  notas: string
  usuario_id: UsuarioId
  created_at?: string
}

// Producto del catálogo (no se guarda en DB, es constante)
export interface ProductoCatalogo {
  id: number
  n: string
  lnea: string
  dim: string
  vc: number   // costo
  r: { r0: number; r1: number; r2: number; r3: number }  // precios por rango
  kg: number
  pp: number | null  // piezas por plancha
}
