'use client'

// Motor Revivir — App completa
// Este archivo contiene toda la lógica de la app.
// Los imports de páginas apuntan a placeholders — reemplázalos con el código real del artifact.

import { useState, useRef } from 'react'
import { IVA, CAT, pxQ, KANBAN_ESTADOS, PECFG, PIPES, PLBL, EMPRESA_INFO, SUBS_TEMPLATE } from '@/lib/catalogo'

/* ─── Tipos inline simplificados (evita errores TS de tipos opcionales) ─── */
interface Item {
  nombre?: string; n?: string
  cantidad?: number; qty?: number
  precio_unit_neto?: number; pu?: number
  costo_unit_neto?: number; cu?: number
  kg_por_unidad?: number; kg?: number
}
interface Cot {
  id: string; empresa: string; contacto?: string; cargo?: string
  rut?: string; dir?: string; direccion?: string; ciudad?: string
  tel?: string; telefono?: string; notas?: string; items: Item[]
}
interface OT {
  id: string; cotizacion_id?: string; cotId?: string
  cliente_id?: string; cliId?: string
  empresa: string; descripcion?: string; prods?: string
  estado: string; archivado?: boolean; fecha_entrada?: string; fent?: string
  fecha_entrega?: string; fdel?: string; ot_numero?: string; otn?: string
  notas?: string; monto_neto?: number; monto?: number; monto_con_iva?: number
  kg_plastico?: number; kg?: number
  items_cotizacion?: string[]; cotItems?: string[]
  item_index?: number; subtareas?: any; subs?: any
  usuario_id?: string; uid?: string
}

const USUARIOS: Record<string, {nombre:string;inicial:string;color:string}> = {
  enrique: { nombre:'Enrique Vásquez', inicial:'E', color:'#5BAF3A' },
  jenny:   { nombre:'Jenny Sáez',      inicial:'J', color:'#2B6CB0' },
}

const f$  = (n:number) => { const a=Math.abs(n); if(a>=1e6) return `$${(a/1e6).toFixed(1)}M`; if(a>=1000) return `$${(a/1000).toFixed(0)}K`; return `$${a.toLocaleString('es-CL')}`; }
const ff  = (n:number) => `$${Math.abs(n).toLocaleString('es-CL')}`
const ts  = () => new Date().toLocaleString('es-CL',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
const tod = () => new Date().toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'})
const mkSubsAll = () => Object.fromEntries(KANBAN_ESTADOS.map(e=>[e,(SUBS_TEMPLATE[e]||[]).map((l,i)=>({id:i,l,done:false}))]))

// ── Importar páginas ──
import { LoginPage }       from './pages/LoginPage'
import { SbNav }           from './pages/SbNav'
import { Dashboard }       from './pages/Dashboard'
import { CRM }             from './pages/CRM'
import { PagCotizaciones } from './pages/Cotizaciones'
import { PagClientes }     from './pages/Clientes'
import { PagProduccion }   from './pages/Produccion'
import { PagRegistros }    from './pages/Registros'
import { PagCatalogo }     from './pages/Catalogo'
import { PagCalculadora }  from './pages/Calculadora'
import { GLOBAL_STYLES }   from './styles'

export default function MotorApp() {
  const [usuario, setUsuario] = useState<string|null>(null)
  const [page,    setPage]    = useState('dashboard')
  const [menu,    setMenu]    = useState(false)
  const [leads,   setLeads]   = useState<any[]>([])
  const [cots,    setCots]    = useState<any[]>([])
  const [peds,    setPeds]    = useState<any[]>([])
  const [regs,    setRegs]    = useState<any[]>([])
  const [clis,    setClis]    = useState<any[]>([])

  if (!usuario) return <><style>{GLOBAL_STYLES}</style><LoginPage onLogin={setUsuario}/></>

  const actOTs = peds.filter((p:any) => !p.archivado && p.estado !== 'registro')
  const lN     = leads.filter((l:any) => l.estado === 'lead').length
  const sinOT  = actOTs.filter((p:any) => !p.ot_numero && p.estado === 'cotizacion').length

  const aprobarCot = (cotId: string) => {
    const cot = cots.find((c:any) => c.id === cotId)
    if (!cot) return
    setCots((prev:any[]) => prev.map((c:any) => c.id===cotId ? {...c, estado:'aprobada'} : c))
    const cli = clis.find((c:any) => c.nombre === cot.empresa || c.n === cot.empresa)
    const newOTs = (cot.items||[]).map((item:Item, i:number) => {
      const pu = item.precio_unit_neto || item.pu || 0
      const qty = item.cantidad || item.qty || 0
      const kg = item.kg_por_unidad || item.kg || 0
      const nombre = item.nombre || item.n || ''
      return {
        id: `${cotId}-OT${i+1}`,
        cotizacion_id: cotId, cotId,
        cliente_id: cli?.id || null, cliId: cli?.id || null,
        empresa: cot.empresa,
        descripcion: `${nombre} ×${qty}`, prods: `${nombre} ×${qty}`,
        estado: 'cotizacion', archivado: false,
        fecha_entrada: new Date().toISOString().split('T')[0], fent: new Date().toISOString().split('T')[0],
        fecha_entrega: '', fdel: '',
        ot_numero: `${cotId}-OT${i+1}`, otn: `${cotId}-OT${i+1}`,
        notas: cot.notas || '',
        monto_neto: pu * qty, monto: pu * qty,
        monto_con_iva: Math.round(pu * qty * (1 + IVA)),
        kg_plastico: kg * qty, kg: kg * qty,
        items_cotizacion: (cot.items||[]).map((x:Item) => x.nombre||x.n||''),
        cotItems: (cot.items||[]).map((x:Item) => x.nombre||x.n||''),
        item_index: i,
        subtareas: mkSubsAll(), subs: mkSubsAll(),
        usuario_id: usuario, uid: usuario,
        updatedAt: ts(),
      }
    })
    setPeds((prev:any[]) => [...newOTs, ...prev])
    if (!cli && cot.empresa) {
      setClis((prev:any[]) => [{
        id:`CLI-${Date.now()}`, n:cot.empresa, nombre:cot.empresa,
        ct:cot.contacto||'', contacto:cot.contacto||'',
        cargo:cot.cargo||'', email:'', tel:cot.telefono||cot.tel||'',
        rut:cot.rut||'', dir:cot.dir||cot.direccion||'',
        direccion:cot.dir||cot.direccion||'',
        ciudad:cot.ciudad||'', linea:'Regalos Corp.',
        est:'activo', estado:'activo', notas:'',
        usuario_id:usuario, uid:usuario, updatedAt:ts(),
      }, ...prev])
    }
    const n = (cot.items||[]).length
    alert(`✓ Cotización aprobada\n\n${n} Ficha${n>1?'s':''} OT generadas en Producción:\n${(cot.items||[]).map((it:Item,i:number)=>`· ${cotId}-OT${i+1}: ${it.nombre||it.n} ×${it.cantidad||it.qty}`).join('\n')}`)
  }

  const renderPage = () => {
    const props = { leads, setLeads, cots, setCots, peds, setPeds, regs, setRegs, clis, setClis, uid:usuario, aprobarCot }
    switch (page) {
      case 'dashboard':    return <Dashboard    {...props} actOTs={actOTs}/>
      case 'crm':          return <CRM          {...props}/>
      case 'cotizaciones': return <PagCotizaciones {...props}/>
      case 'clientes':     return <PagClientes  {...props}/>
      case 'produccion':   return <PagProduccion {...props} actOTs={actOTs}/>
      case 'registros':    return <PagRegistros {...props}/>
      case 'catalogo':     return <PagCatalogo/>
      case 'calculadora':  return <PagCalculadora/>
      default:             return <Dashboard    {...props} actOTs={actOTs}/>
    }
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="mh">
        <div style={{fontSize:18,fontWeight:900}}>revivir<span style={{color:'var(--green)'}}>.</span></div>
        <button className="hb" onClick={()=>setMenu(true)}><span/><span/><span/></button>
      </div>
      <div className={`ov ${menu?'open':''}`} onClick={()=>setMenu(false)}/>
      <div className={`mp ${menu?'open':''}`}>
        <SbNav active={page} go={setPage} onClose={()=>setMenu(false)} leads={leads} actOTs={actOTs} usuario={usuario} onLogout={()=>setUsuario(null)} lN={lN} sinOT={sinOT}/>
      </div>
      <div className="app">
        <aside className="sb">
          <SbNav active={page} go={setPage} leads={leads} actOTs={actOTs} usuario={usuario} onLogout={()=>setUsuario(null)} lN={lN} sinOT={sinOT}/>
        </aside>
        <main className="main">{renderPage()}</main>
      </div>
      <button className="fab" onClick={()=>{
        if(['crm','cotizaciones','clientes','produccion'].includes(page)){
          const btn=document.querySelector<HTMLButtonElement>('.btn.bg');
          if(btn){btn.click();return;}
        }
        setPage('cotizaciones')
      }}>
        <span style={{fontSize:16}}>+</span>
        {page==='crm'?'Nuevo lead':page==='cotizaciones'?'Nueva cotización':page==='clientes'?'Nuevo cliente':page==='produccion'?'Nuevo pedido':'Nueva cotización'}
      </button>
    </>
  )
}
