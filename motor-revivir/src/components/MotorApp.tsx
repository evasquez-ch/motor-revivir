'use client'
/**
 * MOTOR REVIVIR — Componente principal
 * Conecta Supabase con la UI completa
 *
 * Para desarrollo sin Supabase: los datos viven en estado local (useState).
 * Para producción: descomenta las llamadas a la capa db.ts.
 */

import { useState, useRef, useCallback } from 'react'
import type { Lead, Cliente, Cotizacion, CotizacionItem, OrdenTrabajo, Registro, UsuarioId } from '@/types'
import { IVA, CAT, pxQ, KANBAN_ESTADOS, PECFG, PIPES, PLBL, EMPRESA_INFO, SUBS_TEMPLATE } from '@/lib/catalogo'

/* ─── Helpers ─── */
const USUARIOS: Record<UsuarioId, { nombre: string; inicial: string; color: string }> = {
  enrique: { nombre: 'Enrique Vásquez', inicial: 'E', color: '#5BAF3A' },
  jenny:   { nombre: 'Jenny Sáez',      inicial: 'J', color: '#2B6CB0' },
}

const f$  = (n: number) => { const a=Math.abs(n); if(a>=1e6) return `$${(a/1e6).toFixed(1)}M`; if(a>=1000) return `$${(a/1000).toFixed(0)}K`; return `$${a.toLocaleString('es-CL')}`; }
const ff  = (n: number) => `$${Math.abs(n).toLocaleString('es-CL')}`
const ts  = () => new Date().toLocaleString('es-CL', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
const tod = () => new Date().toLocaleDateString('es-CL', { day:'2-digit', month:'long', year:'numeric' })

const mkSubs = (est: string, done: number[] = []) =>
  (SUBS_TEMPLATE[est] || []).map((l, i) => ({ id: i, l, done: done.includes(i) }))

const mkSubsAll = () =>
  Object.fromEntries(KANBAN_ESTADOS.map(e => [e, mkSubs(e, [])]))

const progPed = (p: OrdenTrabajo) => {
  const idx = KANBAN_ESTADOS.indexOf(p.estado as any)
  let t=0, d=0
  KANBAN_ESTADOS.slice(0, idx+1).forEach(e => {
    const s = p.subtareas?.[e] || []
    t += s.length
    d += s.filter((x: any) => x.done || x.completado).length
  })
  return t > 0 ? Math.round(d/t*100) : 0
}

/* ─── UAv component ─── */
function UAv({ uid }: { uid?: UsuarioId }) {
  const u = uid ? USUARIOS[uid] : null
  if (!u) return null
  return (
    <span style={{
      width:18, height:18, borderRadius:'50%', display:'inline-flex',
      alignItems:'center', justifyContent:'center', fontSize:9,
      fontWeight:900, color:'#fff', background:u.color,
      marginLeft:4, verticalAlign:'middle', flexShrink:0,
    }} title={u.nombre}>{u.inicial}</span>
  )
}

/* ─── DnD Hook ─── */
function useDnD(setEst: (id: any, est: string) => void) {
  const ref = useRef<any>(null)
  const [dragId, setDragId] = useState<any>(null)
  const [overCol, setOverCol] = useState<string | null>(null)
  const onDragStart = (e: any, id: any) => { ref.current=id; setDragId(id); e.dataTransfer.effectAllowed='move'; }
  const onDragEnd   = () => { setDragId(null); setOverCol(null); ref.current=null; }
  const onDragOverCol  = (e: any, est: string) => { e.preventDefault(); setOverCol(est); }
  const onDropCol      = (e: any, est: string) => { e.preventDefault(); if(ref.current!=null) setEst(ref.current,est); setDragId(null); setOverCol(null); ref.current=null; }
  const onDragLeaveCol = () => setOverCol(null)
  return { dragId, overCol, onDragStart, onDragEnd, onDragOverCol, onDropCol, onDragLeaveCol }
}

/* ─── PDF Generator ─── */
function generarPDF(cot: Cotizacion) {
  const tvN  = cot.items.reduce((a,i) => a + (i.precio_unit_neto||i.pu||0) * (i.cantidad||i.qty||0), 0)
  const iva  = Math.round(tvN * IVA)
  const tvT  = tvN + iva
  const kgTot = cot.items.reduce((a,i) => a + (i.kg_por_unidad||i.kg||0) * (i.cantidad||i.qty||0), 0)
  const yogures = Math.round(kgTot / 0.006)

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>${cot.id} — revivir</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Archivo',sans-serif;background:#fff;color:#111;padding:15mm 16mm;font-size:11pt;}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm;}
.logo{font-size:24pt;font-weight:900;letter-spacing:-.5px;}.logo span{color:#5BAF3A;}
.logo-tag{font-size:8pt;color:#888;letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
.cot-id{font-size:18pt;font-weight:900;text-align:right;}
.cot-fecha{font-size:9pt;color:#888;text-align:right;margin-top:2px;}
.cot-titulo{font-size:9pt;font-weight:800;color:#5BAF3A;text-transform:uppercase;letter-spacing:1px;text-align:right;margin-top:3px;}
.div-g{height:3px;background:#5BAF3A;border-radius:2px;margin:5mm 0 7mm;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-bottom:5mm;}
.blk{background:#F7F7F5;border-radius:5px;padding:4mm 5mm;}
.lbl{font-size:7.5pt;color:#888;font-weight:700;margin-bottom:2px;}
.val{font-size:11pt;font-weight:800;}.sub{font-size:9pt;color:#555;}
.cond{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-bottom:5mm;}
.terms{background:#FFFBF0;border:1px solid #F0E0A0;border-radius:5px;padding:4mm 5mm;font-size:9pt;color:#555;margin-bottom:5mm;line-height:1.6;}
table{width:100%;border-collapse:collapse;margin-bottom:5mm;}
thead tr{background:#111;}th{padding:3mm 4mm;font-size:8pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;text-align:left;}
td{padding:3mm 4mm;border-bottom:1px solid #E8E8E8;font-size:10pt;}
tbody tr:last-child td{border-bottom:2px solid #111;}
.tr{text-align:right;}.tc{text-align:center;color:#555;}.tg{text-align:right;font-weight:800;color:#5BAF3A;}
.tots{margin-left:auto;width:75mm;}
.trow{display:flex;justify-content:space-between;padding:2.5mm 0;border-bottom:1px solid #E8E8E8;font-size:10pt;}
.tfin{border-bottom:none;border-top:2px solid #111;padding-top:3mm;font-size:13pt;font-weight:900;color:#5BAF3A;}
.imp{background:#F0FAF0;border:1.5px solid #5BAF3A;border-radius:5px;padding:4mm 5mm;display:flex;align-items:center;gap:4mm;margin:5mm 0;}
.imp-ico{font-size:18pt;}.imp-t{font-size:10pt;font-weight:800;color:#5BAF3A;margin-bottom:2px;}.imp-s{font-size:8.5pt;color:#555;}
.foot{border-top:2px solid #111;padding-top:5mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm;font-size:9pt;}
.ft{font-size:7.5pt;color:#888;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;}
.fv{color:#333;margin-bottom:2px;}.fb2{font-weight:700;}.fgr{color:#5BAF3A;font-weight:700;}
@page{size:A4;margin:0;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style></head><body>
<div class="hdr">
<div><div class="logo">revivir<span>.</span></div><div class="logo-tag">Diseño con plástico reciclado</div></div>
<div><div class="cot-id">${cot.id}</div><div class="cot-fecha">${tod()}</div><div class="cot-titulo">Cotización de productos de plástico reciclado</div></div>
</div>
<div class="div-g"></div>
<div class="grid2">
<div class="blk"><div class="lbl">INSTITUCIÓN</div><div class="val">${cot.empresa}</div>${cot.rut?`<div class="sub">RUT: ${cot.rut}</div>`:''}</div>
<div class="blk"><div class="lbl">SOLICITANTE</div><div class="val">${cot.contacto||'—'}</div>${cot.cargo?`<div class="sub">${cot.cargo}</div>`:''}</div>
<div class="blk"><div class="lbl">DIRECCIÓN</div><div class="val">${cot.direccion||cot.dir||'A coordinar'}</div>${(cot.ciudad)?`<div class="sub">${cot.ciudad}</div>`:''}</div>
<div class="blk"><div class="lbl">CONTACTO</div><div class="val">${cot.telefono||cot.tel||'—'}</div></div>
</div>
<div class="cond">
<div class="blk"><div class="lbl">ENTREGA</div><div class="val" style="font-size:10pt">A coordinar</div></div>
<div class="blk"><div class="lbl">PLAZO FABRICACIÓN</div><div class="val" style="font-size:10pt">30 días hábiles</div></div>
<div class="blk"><div class="lbl">CONDICIÓN DE PAGO</div><div class="val" style="font-size:10pt">A acordar</div></div>
<div class="blk"><div class="lbl">VIGENCIA</div><div class="val" style="font-size:10pt">15 días corridos</div></div>
</div>
<div class="terms"><strong>Nota:</strong> Cotización específica para la institución identificada, intransferible. Las combinaciones de colores son a coordinar con el equipo Revivir.${cot.notas?` <strong>Obs:</strong> ${cot.notas}`:''}</div>
<table>
<thead><tr><th>Producto</th><th class="tr">Val. Unit. Neto</th><th class="tc">Cantidad</th><th class="tr">Total Neto</th><th class="tr">Total con IVA</th></tr></thead>
<tbody>
${cot.items.map(i => {
  const nombre = i.nombre || i.n
  const pu = i.precio_unit_neto || i.pu || 0
  const qty = i.cantidad || i.qty || 0
  return `<tr><td style="font-weight:700">${nombre}</td><td class="tr">${ff(pu)}</td><td class="tc">${qty}</td><td class="tr">${ff(pu*qty)}</td><td class="tg">${ff(Math.round(pu*qty*(1+IVA)))}</td></tr>`
}).join('')}
</tbody>
</table>
<div class="tots">
<div class="trow"><span>NETO</span><span>${ff(tvN)}</span></div>
<div class="trow" style="color:#888"><span>IVA (19%)</span><span>${ff(iva)}</span></div>
<div class="trow tfin"><span>TOTAL</span><span>${ff(tvT)}</span></div>
</div>
<div class="imp"><div class="imp-ico">♻</div><div><div class="imp-t">Impacto ambiental de este pedido</div><div class="imp-s">${kgTot.toFixed(2)} kg de plástico reciclado · ~${yogures.toLocaleString()} envases de yogur recuperados</div></div></div>
<div class="foot">
<div><div class="ft">Datos de la empresa</div><div class="fv fb2">${EMPRESA_INFO.nombre}</div><div class="fv">${EMPRESA_INFO.direccion}</div><div class="fv">${EMPRESA_INFO.telefono}</div><div class="fv fgr">${EMPRESA_INFO.email} · ${EMPRESA_INFO.web}</div></div>
<div><div class="ft">Información de pago</div><div class="fv fb2">${EMPRESA_INFO.nombre}</div><div class="fv">Banco: <span class="fb2">${EMPRESA_INFO.banco}</span></div><div class="fv">${EMPRESA_INFO.tipo_cuenta}: <span class="fb2">${EMPRESA_INFO.cuenta}</span></div><div class="fv fgr">${EMPRESA_INFO.email}</div></div>
</div>
</body></html>`

  const w = window.open('', '_blank')
  if (!w) { alert('Permite ventanas emergentes para imprimir el PDF'); return }
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 1200)
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
export default function MotorApp() {
  const [usuario, setUsuario] = useState<UsuarioId | null>(null)
  const [page, setPage]       = useState('dashboard')
  const [menu, setMenu]       = useState(false)

  // Estado local (en producción, reemplazar con hooks que llaman a db.ts)
  const [leads,  setLeads]  = useState<Lead[]>([])
  const [cots,   setCots]   = useState<Cotizacion[]>([])
  const [peds,   setPeds]   = useState<OrdenTrabajo[]>([])
  const [regs,   setRegs]   = useState<Registro[]>([])
  const [clis,   setClis]   = useState<Cliente[]>([])

  // Modal estados
  const [modalCot,    setModalCot]    = useState(false)
  const [modalLead,   setModalLead]   = useState(false)
  const [editLead,    setEditLead]    = useState<Lead | null>(null)
  const [modalPed,    setModalPed]    = useState(false)
  const [modalCli,    setModalCli]    = useState(false)
  const [editCli,     setEditCli]     = useState<Cliente | null>(null)
  const [fichaOT,     setFichaOT]     = useState<OrdenTrabajo | null>(null)
  const [pdfCot,      setPdfCot]      = useState<Cotizacion | null>(null)

  // Filtros
  const [filtroLinea, setFiltroLinea] = useState('todos')
  const [filtroTemp,  setFiltroTemp]  = useState('todos')
  const [filtroPrio,  setFiltroPrio]  = useState('todos')
  const [filtroCot,   setFiltroCot]   = useState('todos')
  const [filtroRegCli,setFiltroRegCli]= useState('todos')
  const [filtroCliest,setFiltroCliest]= useState('todos')
  const [selCliente,  setSelCliente]  = useState<Cliente | null>(null)
  const [archProd,    setArchProd]    = useState(false)
  const [filCat,      setFilCat]      = useState('todos')

  if (!usuario) return <LoginPage onLogin={setUsuario} />

  /* ─── Actions ─── */
  const saveLead = (l: Lead) => {
    setLeads(prev => prev.find(x => x.id === l.id) ? prev.map(x => x.id===l.id?l:x) : [l,...prev])
  }
  const setEstLead = (id: number, est: string) => {
    setLeads(prev => prev.map(l => l.id===id ? {...l, estado:est as any, usuario_id:usuario, updated_at:ts()} : l))
  }
  const aprobarCot = (cotId: string) => {
    const cot = cots.find(c => c.id === cotId)
    if (!cot) return
    setCots(prev => prev.map(c => c.id===cotId ? {...c, estado:'aprobada' as any} : c))
    const cli = clis.find(c => c.nombre === cot.empresa)
    const newOTs: OrdenTrabajo[] = cot.items.map((item, i) => ({
      id: `${cotId}-OT${i+1}`,
      cotizacion_id: cotId,
      cliente_id: cli?.id || null,
      empresa: cot.empresa,
      descripcion: `${item.nombre||item.n} ×${item.cantidad||item.qty}`,
      estado: 'cotizacion' as any,
      archivado: false,
      fecha_entrada: new Date().toISOString().split('T')[0],
      fecha_entrega: '',
      ot_numero: `${cotId}-OT${i+1}`,
      notas: cot.notas || '',
      monto_neto: (item.precio_unit_neto||item.pu||0) * (item.cantidad||item.qty||0),
      monto_con_iva: Math.round((item.precio_unit_neto||item.pu||0) * (item.cantidad||item.qty||0) * (1+IVA)),
      kg_plastico: (item.kg_por_unidad||item.kg||0) * (item.cantidad||item.qty||0),
      items_cotizacion: cot.items.map(x => x.nombre||x.n||''),
      item_index: i,
      subtareas: mkSubsAll() as any,
      usuario_id: usuario,
      created_at: ts(),
      updated_at: ts(),
    }))
    setPeds(prev => [...newOTs, ...prev])
    if (!cli && cot.empresa) {
      setClis(prev => [{
        id: `CLI-${Date.now()}`, nombre: cot.empresa, contacto: cot.contacto||'',
        cargo: cot.cargo||'', email: '', tel: cot.telefono||cot.tel||'',
        rut: cot.rut||'', direccion: cot.direccion||cot.dir||'',
        ciudad: cot.ciudad||'', linea: 'Regalos Corp.' as any,
        estado: 'activo' as any, notas: '', usuario_id: usuario, updated_at: ts(),
      }, ...prev])
    }
    alert(`✓ Cotización aprobada\n\n${cot.items.length} Ficha${cot.items.length>1?'s':''} OT generadas en Producción:\n${cot.items.map((it,i)=>`· ${cotId}-OT${i+1}: ${it.nombre||it.n} ×${it.cantidad||it.qty}`).join('\n')}`)
  }
  const setEstOT = (id: string, est: string) => {
    setPeds(prev => prev.map(p => p.id===id ? {...p, estado:est as any, usuario_id:usuario, updated_at:ts()} : p))
  }
  const saveOT = (ot: OrdenTrabajo) => {
    setPeds(prev => prev.map(p => p.id===ot.id ? {...ot, usuario_id:usuario, updated_at:ts()} : p))
  }
  const moverReg = (otId: string) => {
    const ot = peds.find(p => p.id === otId)
    if (!ot) return
    const reg: Registro = {
      id: `REG-${Date.now()}`,
      ot_id: ot.id,
      cotizacion_id: ot.cotizacion_id,
      cliente_id: ot.cliente_id,
      empresa: ot.empresa,
      descripcion: ot.descripcion,
      monto_neto: ot.monto_neto,
      kg_plastico: ot.kg_plastico,
      fecha: new Date().toLocaleDateString('es-CL', {day:'2-digit', month:'short'}),
      notas: ot.notas,
      usuario_id: usuario,
      created_at: ts(),
    }
    setRegs(prev => [reg, ...prev])
    setPeds(prev => prev.map(p => p.id===otId ? {...p, estado:'registro' as any} : p))
  }

  const actOTs  = peds.filter(p => !p.archivado && p.estado !== 'registro')
  const lN      = leads.filter(l => l.estado === 'lead').length
  const sinOT   = actOTs.filter(p => !p.ot_numero && p.estado === 'cotizacion').length

  /* ─── Render por página ─── */
  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard peds={actOTs} leads={leads} cots={cots} />
      case 'crm':          return <CRM leads={leads} setLeads={setLeads} saveLead={saveLead} setEstLead={setEstLead} filtroLinea={filtroLinea} setFiltroLinea={setFiltroLinea} filtroTemp={filtroTemp} setFiltroTemp={setFiltroTemp} filtroPrio={filtroPrio} setFiltroPrio={setFiltroPrio} modalLead={modalLead} setModalLead={setModalLead} editLead={editLead} setEditLead={setEditLead} uid={usuario} />
      case 'cotizaciones': return <PagCotizaciones cots={cots} setCots={setCots} leads={leads} clis={clis} setClis={setClis} setPeds={setPeds} uid={usuario} modalCot={modalCot} setModalCot={setModalCot} filtro={filtroCot} setFiltro={setFiltroCot} aprobarCot={aprobarCot} pdfCot={pdfCot} setPdfCot={setPdfCot} />
      case 'clientes':     return <PagClientes clis={clis} setClis={setClis} peds={peds} cots={cots} regs={regs} uid={usuario} sel={selCliente} setSel={setSelCliente} modalCli={modalCli} setModalCli={setModalCli} editCli={editCli} setEditCli={setEditCli} filtro={filtroCliest} setFiltro={setFiltroCliest} />
      case 'produccion':   return <PagProduccion peds={actOTs} setPeds={setPeds} clis={clis} regs={regs} setRegs={setRegs} uid={usuario} ficha={fichaOT} setFicha={setFichaOT} modalPed={modalPed} setModalPed={setModalPed} arch={archProd} setArch={setArchProd} setEstOT={setEstOT} saveOT={saveOT} moverReg={moverReg} archivedPeds={peds.filter(p=>p.archivado)} />
      case 'registros':    return <PagRegistros regs={regs} filtro={filtroRegCli} setFiltro={setFiltroRegCli} />
      case 'catalogo':     return <PagCatalogo filCat={filCat} setFilCat={setFilCat} />
      case 'calculadora':  return <PagCalculadora />
      default:             return <Dashboard peds={actOTs} leads={leads} cots={cots} />
    }
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {/* Mobile header */}
      <div className="mh">
        <div style={{fontSize:18,fontWeight:900}}>revivir<span style={{color:'var(--green)'}}>.</span></div>
        <button className="hb" onClick={() => setMenu(true)}><span/><span/><span/></button>
      </div>
      <div className={`ov ${menu?'open':''}`} onClick={() => setMenu(false)} />
      <div className={`mp ${menu?'open':''}`}>
        <SbNav active={page} go={setPage} onClose={() => setMenu(false)} leads={leads} actOTs={actOTs} usuario={usuario} onLogout={() => setUsuario(null)} lN={lN} sinOT={sinOT} />
      </div>

      <div className="app">
        <aside className="sb">
          <SbNav active={page} go={setPage} leads={leads} actOTs={actOTs} usuario={usuario} onLogout={() => setUsuario(null)} lN={lN} sinOT={sinOT} />
        </aside>
        <main className="main">{renderPage()}</main>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => {
        if (page==='crm')          setModalLead(true)
        else if (page==='cotizaciones') setModalCot(true)
        else if (page==='clientes')     setModalCli(true)
        else if (page==='produccion')   setModalPed(true)
        else setPage('cotizaciones')
      }}>
        <span style={{fontSize:16}}>+</span>
        {page==='crm'?'Nuevo lead':page==='cotizaciones'?'Nueva cotización':page==='clientes'?'Nuevo cliente':page==='produccion'?'Nuevo pedido':'Nueva cotización'}
      </button>
    </>
  )
}

// ─── Sub-páginas y componentes importados desde archivos separados ───
// Para mantener este archivo manejable, las páginas viven en components/pages/
// pero aquí las incluimos inline para simplificar el setup inicial.
// En producción, mueve cada función a su propio archivo.

import { LoginPage } from './pages/LoginPage'
import { SbNav } from './pages/SbNav'
import { Dashboard } from './pages/Dashboard'
import { CRM } from './pages/CRM'
import { PagCotizaciones } from './pages/Cotizaciones'
import { PagClientes } from './pages/Clientes'
import { PagProduccion } from './pages/Produccion'
import { PagRegistros } from './pages/Registros'
import { PagCatalogo } from './pages/Catalogo'
import { PagCalculadora } from './pages/Calculadora'
import { GLOBAL_STYLES } from './styles'
