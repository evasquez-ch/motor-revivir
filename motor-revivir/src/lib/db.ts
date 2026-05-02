import { supabase } from './supabase'
import { SUBS_TEMPLATE, IVA } from './catalogo'
import type {
  Lead, Cliente, Cotizacion, CotizacionItem,
  OrdenTrabajo, Registro, UsuarioId, Subtarea
} from '@/types'

/* ─── HELPERS ─── */
const ts = () => new Date().toISOString()

function mkSubtareas(otId: string): Record<string, Subtarea[]> {
  const result: Record<string, Subtarea[]> = {}
  for (const [estado, labels] of Object.entries(SUBS_TEMPLATE)) {
    result[estado] = labels.map((label, i) => ({
      ot_id: otId, estado_padre: estado as any,
      label, completado: false, orden: i,
    }))
  }
  return result
}

/* ──────────────────────────────────────────────
   LEADS
────────────────────────────────────────────── */
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function upsertLead(lead: Partial<Lead>, uid: UsuarioId): Promise<Lead> {
  const payload = { ...lead, usuario_id: uid, updated_at: ts() }
  const { data, error } = await supabase
    .from('leads')
    .upsert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLeadEstado(id: number, estado: string, uid: UsuarioId) {
  const { error } = await supabase
    .from('leads')
    .update({ estado, usuario_id: uid, updated_at: ts() })
    .eq('id', id)
  if (error) throw error
}

/* ──────────────────────────────────────────────
   CLIENTES
────────────────────────────────────────────── */
export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data || []
}

export async function upsertCliente(cliente: Partial<Cliente>, uid: UsuarioId): Promise<Cliente> {
  const payload = { ...cliente, usuario_id: uid, updated_at: ts() }
  if (!payload.id) delete payload.id
  const { data, error } = await supabase
    .from('clientes')
    .upsert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ──────────────────────────────────────────────
   COTIZACIONES
────────────────────────────────────────────── */
export async function getCotizaciones(): Promise<Cotizacion[]> {
  const { data: cots, error } = await supabase
    .from('cotizaciones')
    .select('*, cotizacion_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (cots || []).map(c => ({
    ...c,
    items: (c.cotizacion_items || []).map((it: any) => ({
      id: it.id,
      cotizacion_id: it.cotizacion_id,
      nombre: it.nombre,
      cantidad: it.cantidad,
      precio_unit_neto: it.precio_unit_neto,
      costo_unit_neto: it.costo_unit_neto,
      kg_por_unidad: it.kg_por_unidad,
      es_personalizado: it.es_personalizado,
    })),
  }))
}

export async function crearCotizacion(cot: Omit<Cotizacion, 'items'>, items: CotizacionItem[], uid: UsuarioId): Promise<Cotizacion> {
  // 1. Insertar cotización
  const { data: cotData, error: cotErr } = await supabase
    .from('cotizaciones')
    .insert({ ...cot, usuario_id: uid, updated_at: ts() })
    .select()
    .single()
  if (cotErr) throw cotErr

  // 2. Insertar items
  const itemsPayload = items.map((item, i) => ({
    cotizacion_id: cotData.id,
    nombre: item.nombre,
    cantidad: item.cantidad,
    precio_unit_neto: item.precio_unit_neto,
    costo_unit_neto: item.costo_unit_neto,
    kg_por_unidad: item.kg_por_unidad,
    es_personalizado: item.es_personalizado || false,
    orden: i,
  }))
  const { data: itemsData, error: itemsErr } = await supabase
    .from('cotizacion_items')
    .insert(itemsPayload)
    .select()
  if (itemsErr) throw itemsErr

  return { ...cotData, items: itemsData || [] }
}

export async function actualizarEstadoCot(
  cotId: string,
  estado: string,
  uid: UsuarioId,
  cot?: Cotizacion,
  cliId?: string | null,
  setPeds?: (fn: (prev: OrdenTrabajo[]) => OrdenTrabajo[]) => void,
  setClis?: (fn: (prev: Cliente[]) => Cliente[]) => void,
) {
  await supabase.from('cotizaciones').update({ estado, usuario_id: uid, updated_at: ts() }).eq('id', cotId)

  if (estado === 'aprobada' && cot) {
    const fechaHoy = new Date().toISOString().split('T')[0]
    const itemNames = cot.items.map(i => i.nombre)

    // Crear una OT por cada item
    const otsPayload = cot.items.map((item, i) => ({
      id: `${cotId}-OT${i + 1}`,
      cotizacion_id: cotId,
      cliente_id: cliId || null,
      empresa: cot.empresa,
      descripcion: `${item.nombre} ×${item.cantidad}`,
      estado: 'cotizacion',
      archivado: false,
      fecha_entrada: fechaHoy,
      fecha_entrega: '',
      ot_numero: `${cotId}-OT${i + 1}`,
      notas: cot.notas || '',
      monto_neto: item.precio_unit_neto * item.cantidad,
      monto_con_iva: Math.round(item.precio_unit_neto * item.cantidad * (1 + IVA)),
      kg_plastico: item.kg_por_unidad * item.cantidad,
      items_cotizacion: itemNames,
      item_index: i,
      usuario_id: uid,
      updated_at: ts(),
    }))

    const { data: otsData, error: otErr } = await supabase
      .from('ordenes_trabajo')
      .insert(otsPayload)
      .select()
    if (otErr) throw otErr

    // Insertar subtareas para cada OT
    const subsPayload: any[] = []
    for (const ot of (otsData || [])) {
      for (const [estado, labels] of Object.entries(SUBS_TEMPLATE)) {
        labels.forEach((label, i) => {
          subsPayload.push({ ot_id: ot.id, estado_padre: estado, label, completado: false, orden: i })
        })
      }
    }
    if (subsPayload.length > 0) {
      await supabase.from('ot_subtareas').insert(subsPayload)
    }
  }
}

/* ──────────────────────────────────────────────
   ÓRDENES DE TRABAJO
────────────────────────────────────────────── */
export async function getOrdenesTrabajo(): Promise<OrdenTrabajo[]> {
  const { data: ots, error } = await supabase
    .from('ordenes_trabajo')
    .select('*, ot_subtareas(*)')
    .eq('archivado', false)
    .order('created_at', { ascending: false })
  if (error) throw error

  return (ots || []).map(ot => {
    const subs: Record<string, Subtarea[]> = {}
    for (const estado of Object.keys(SUBS_TEMPLATE)) {
      subs[estado] = (ot.ot_subtareas || [])
        .filter((s: any) => s.estado_padre === estado)
        .sort((a: any, b: any) => a.orden - b.orden)
    }
    return { ...ot, subtareas: subs, items_cotizacion: ot.items_cotizacion || [] }
  })
}

export async function actualizarEstadoOT(otId: string, estado: string, uid: UsuarioId) {
  await supabase.from('ordenes_trabajo').update({ estado, usuario_id: uid, updated_at: ts() }).eq('id', otId)
}

export async function actualizarSubtarea(subId: number, completado: boolean) {
  await supabase.from('ot_subtareas').update({ completado }).eq('id', subId)
}

export async function generarOTNumero(otId: string, uid: UsuarioId) {
  await supabase.from('ordenes_trabajo').update({
    ot_numero: otId, usuario_id: uid, updated_at: ts()
  }).eq('id', otId)
}

export async function moverOTaRegistros(ot: OrdenTrabajo, uid: UsuarioId): Promise<Registro> {
  // Crear registro
  const reg = {
    ot_id: ot.id,
    cotizacion_id: ot.cotizacion_id,
    cliente_id: ot.cliente_id,
    empresa: ot.empresa,
    descripcion: ot.descripcion,
    monto_neto: ot.monto_neto,
    kg_plastico: ot.kg_plastico,
    fecha: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
    notas: ot.notas,
    usuario_id: uid,
  }
  const { data, error } = await supabase.from('registros').insert(reg).select().single()
  if (error) throw error

  // Marcar OT como registro
  await supabase.from('ordenes_trabajo').update({ estado: 'registro', usuario_id: uid, updated_at: ts() }).eq('id', ot.id)
  return data
}

export async function guardarOTCompleta(ot: OrdenTrabajo, uid: UsuarioId) {
  await supabase.from('ordenes_trabajo').update({
    estado: ot.estado,
    fecha_entrega: ot.fecha_entrega,
    notas: ot.notas,
    usuario_id: uid,
    updated_at: ts(),
  }).eq('id', ot.id)

  // Actualizar subtareas
  for (const subs of Object.values(ot.subtareas)) {
    for (const sub of subs) {
      if (sub.id) {
        await supabase.from('ot_subtareas').update({ completado: sub.completado }).eq('id', sub.id)
      }
    }
  }
}

/* ──────────────────────────────────────────────
   REGISTROS
────────────────────────────────────────────── */
export async function getRegistros(): Promise<Registro[]> {
  const { data, error } = await supabase
    .from('registros')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
