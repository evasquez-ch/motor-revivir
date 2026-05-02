'use client'
import { useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

import { useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

/* ─── CONFIG ─── */
const IVA = 0.19;
const USUARIOS = {
  enrique: { id:"enrique", nombre:"Enrique Vásquez", inicial:"E", color:"#5BAF3A" },
  jenny:   { id:"jenny",   nombre:"Jenny Sáez",      inicial:"J", color:"#2B6CB0" },
};
const KANBAN = ["cotizacion","produccion","terminacion","listo","entregado"];
const PECFG = {
  cotizacion: {label:"Cotización",  color:"#D97706", bdg:"a"},
  produccion: {label:"Producción",  color:"#2B6CB0", bdg:"b"},
  terminacion:{label:"Terminación", color:"#8B5CF6", bdg:"p"},
  listo:      {label:"Listo",       color:"#0D9488", bdg:"t"},
  entregado:  {label:"Entregado",   color:"#5BAF3A", bdg:"g"},
};
const PIPES = ["lead","contactado","cotizacion","negociacion","cerrado"];
const PLBL  = {lead:"Lead",contactado:"Contactado",cotizacion:"Cotiz. enviada",negociacion:"Negociación",cerrado:"Cerrado"};
const PBDG  = {lead:"m",contactado:"b",cotizacion:"a",negociacion:"p",cerrado:"g"};
const SUBS  = {
  cotizacion: ["Diseño del producto definido","Cotización enviada al cliente","Cotización aceptada","OT generada","Pago / anticipo recibido","Materiales verificados en stock","Compra de materiales realizada","Materiales retirados y disponibles"],
  produccion: ["Material enviado a taller CNC","Corte CNC completado","Material cortado retirado","Control de calidad OK"],
  terminacion:["Pulido realizado","DTF UV aplicado","Placas instaladas","Ensamble final completado","Revisión final OK"],
  listo:      ["Empaque realizado","Etiquetas puestas","Entrega coordinada con cliente"],
  entregado:  ["Producto entregado","Factura emitida","Pago final confirmado","Seguimiento postventa"],
};
const mkSubs = (e,d=[]) => (SUBS[e]||[]).map((l,i)=>({id:i,l,done:d.includes(i)}));

/* ─── CATÁLOGO REAL ─── */
const CAT = [
  {id:1,  n:"Galvano Personalizado + placa",           lnea:"Regalos Corp.", dim:"Variable",     vc:13187, r:{r0:27990,r1:25361,r2:23977,r3:21979}, kg:.80,  pp:58},
  {id:2,  n:"Galvano Básico Redondo + placa",          lnea:"Regalos Corp.", dim:"Variable",     vc:12874, r:{r0:24057,r1:22641,r2:21225,r3:19809}, kg:.75,  pp:48},
  {id:3,  n:"Galvano Básico sin placa",                lnea:"Regalos Corp.", dim:"Variable",     vc:9092,  r:{r0:16990,r1:15990,r2:14990,r3:13990}, kg:.65,  pp:48},
  {id:4,  n:"Medalla",                                 lnea:"Regalos Corp.", dim:"55x60 mm",     vc:1892,  r:{r0:3441, r1:3154, r2:2911, r3:2704},  kg:.055, pp:408},
  {id:5,  n:"Placa de Reconocimiento",                 lnea:"Regalos Corp.", dim:"200x120 mm",   vc:5471,  r:{r0:9946, r1:9118, r2:8416, r3:7815},  kg:.22,  pp:70},
  {id:6,  n:"Llavero Alza Smartphone",                 lnea:"Regalos Corp.", dim:"50x60 mm",     vc:1599,  r:{r0:3401, r1:2756, r2:2578, r3:2422},  kg:.055, pp:498},
  {id:7,  n:"Llavero Circular",                        lnea:"Regalos Corp.", dim:"50x50 mm",     vc:1494,  r:{r0:2716, r1:2490, r2:2298, r3:2134},  kg:.04,  pp:504},
  {id:8,  n:"Llavero Rectangular",                     lnea:"Regalos Corp.", dim:"60x35 mm",     vc:1348,  r:{r0:2451, r1:2247, r2:2074, r3:1926},  kg:.035, pp:310},
  {id:9,  n:"Organizador Escritorio",                  lnea:"Regalos Corp.", dim:"280x50 mm",    vc:4998,  r:{r0:9088, r1:8330, r2:7690, r3:7140},  kg:.45,  pp:114},
  {id:10, n:"Separador Libro",                         lnea:"Regalos Corp.", dim:"103x51 mm",    vc:1812,  r:{r0:3295, r1:3021, r2:2788, r3:2589},  kg:.03,  pp:346},
  {id:11, n:"Eleva Laptop (2 piezas)",                 lnea:"Regalos Corp.", dim:"298x94 mm",    vc:6247,  r:{r0:10412,r1:9611, r2:9465, r3:8925},  kg:.38,  pp:72},
  {id:12, n:"Posa Smartphone (2 piezas)",              lnea:"Regalos Corp.", dim:"65x70/125mm",  vc:4028,  r:{r0:6945, r1:6604, r2:6197, r3:5755},  kg:.18,  pp:120},
  {id:13, n:"Posavasos",                               lnea:"Regalos Corp.", dim:"90x90 mm",     vc:1955,  r:{r0:3259, r1:3008, r2:2870, r3:2754},  kg:.10,  pp:198},
  {id:14, n:"Joyero mediano",                          lnea:"Regalos Corp.", dim:"136x80 mm",    vc:2981,  r:{r0:4969, r1:4732, r2:4517, r3:4029},  kg:.15,  pp:160},
  {id:15, n:"Joyero pequeño",                          lnea:"Regalos Corp.", dim:"115x65 mm",    vc:2326,  r:{r0:3877, r1:3692, r2:3525, r3:3144},  kg:.10,  pp:210},
  {id:16, n:"Kit 1: Eleva+Llavero+Posavasos+Bolsa",   lnea:"Kits", dim:"Combo", vc:11084, r:{r0:19111,r1:18171,r2:17319,r3:16544}, kg:.535, pp:null},
  {id:17, n:"Kit 2: Org+Llavero+Posavasos+Bolsa",     lnea:"Kits", dim:"Combo", vc:9835,  r:{r0:16957,r1:16123,r2:15368,r3:14679}, kg:.48,  pp:null},
  {id:18, n:"Kit 3: Org+Eleva+Llavero+Bolsa",         lnea:"Kits", dim:"Combo", vc:14127, r:{r0:24357,r1:23159,r2:22074,r3:21085}, kg:.87,  pp:null},
  {id:19, n:"Kit Full: Org+Eleva+Llavero+Sep+Bolsa",  lnea:"Kits", dim:"Combo", vc:15940, r:{r0:27482,r1:26130,r2:24906,r3:23790}, kg:.90,  pp:null},
  {id:20, n:"Copero / Viñera 2 Copas",                lnea:"HoReCa", dim:"95x284 mm",  vc:4906,  r:{r0:8177, r1:7548, r2:7215, r3:6910},  kg:.55,  pp:66},
  {id:21, n:"Destapador Mediano",                      lnea:"HoReCa", dim:"54x100 mm",  vc:2188,  r:{r0:3978, r1:3646, r2:3366, r3:3125},  kg:.08,  pp:288},
  {id:22, n:"Destapador Pequeño Redondo",              lnea:"HoReCa", dim:"54x54 mm",   vc:1683,  r:{r0:3060, r1:2805, r2:2589, r3:2404},  kg:.05,  pp:504},
  {id:23, n:"Posavasos HoReCa",                        lnea:"HoReCa", dim:"90x90 mm",   vc:1955,  r:{r0:3259, r1:3008, r2:2876, r3:2754},  kg:.10,  pp:198},
  {id:24, n:"Tabla Cóctel",                            lnea:"HoReCa", dim:"200x300 mm", vc:10233, r:{r0:17056,r1:16243,r2:15505,r3:14619}, kg:.90,  pp:30},
  {id:25, n:"Tabla Café + Pastel",                     lnea:"HoReCa", dim:"136x80 mm",  vc:3750,  r:{r0:6250, r1:5769, r2:5515, r3:5000},  kg:.18,  pp:100},
  {id:26, n:"Posa Velas",                              lnea:"HoReCa", dim:"110x60 mm",  vc:2417,  r:{r0:4028, r1:3836, r2:3662, r3:3266},  kg:.10,  pp:248},
  {id:27, n:"Señalética Baño",                         lnea:"Señalética", dim:"175x175 mm", vc:4517, r:{r0:9033,r1:9033,r2:9033,r3:9033}, kg:.22, pp:36},
  {id:28, n:"Señalética Discapacitado",                lnea:"Señalética", dim:"175x175 mm", vc:4517, r:{r0:9033,r1:9033,r2:9033,r3:9033}, kg:.22, pp:36},
  {id:29, n:"Señalética Reservado",                    lnea:"Señalética", dim:"150x45 mm",  vc:3929, r:{r0:6549,r1:6549,r2:6549,r3:6549}, kg:.08, pp:228},
  {id:30, n:"Colgante Puerta Hotel",                   lnea:"Señalética", dim:"85x220 mm",  vc:5417, r:{r0:8333,r1:8333,r2:8333,r3:8333}, kg:.25, pp:88},
];

const pxQ = (p,q) => q<30?p.r.r0:q<100?p.r.r1:q<1000?p.r.r2:p.r.r3;
const f$  = n => { const a=Math.abs(n); if(a>=1e6) return `$${(a/1e6).toFixed(1)}M`; if(a>=1000) return `$${(a/1000).toFixed(0)}K`; return `$${a.toLocaleString("es-CL")}`; };
const ff  = n => `$${Math.abs(n).toLocaleString("es-CL")}`;
const ts  = () => new Date().toLocaleString("es-CL",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
const tod = () => new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});

/* ─── ESTILOS ─── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0F0F0F;--s1:#171717;--s2:#1F1F1F;--s3:#252525;
  --border:#2A2A2A;--text:#EFEFEF;--text2:#AAAAAA;--muted:#606060;
  --green:#5BAF3A;--gl:rgba(91,175,58,.12);--gs:rgba(91,175,58,.22);
  --purple:#8B5CF6;--pl:rgba(139,92,246,.12);
  --red:#C0392B;--rl:rgba(192,57,43,.12);
  --amber:#D97706;--al:rgba(217,119,6,.12);
  --blue:#2B6CB0;--bl:rgba(43,108,176,.12);
  --teal:#0D9488;--tl:rgba(13,148,136,.12);
}
html,body,#root{width:100%;min-height:100vh;}body{background:var(--bg);color:var(--text);font-family:'Archivo',sans-serif;min-height:100vh;margin:0;padding:0;}
button{cursor:pointer;font-family:'Archivo',sans-serif;}
input,select,textarea{font-family:'Archivo',sans-serif;}
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh;}
.sb{background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.lw{padding:18px 20px;border-bottom:1px solid var(--border);}
.ls{font-size:9px;color:var(--muted);letter-spacing:2.5px;text-transform:uppercase;margin-top:5px;font-family:'JetBrains Mono',monospace;}
.nav{padding:10px 8px;flex:1;display:flex;flex-direction:column;gap:1px;}
.ns{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;padding:10px 12px 5px;}
.ni{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:7px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .15s;border:1px solid transparent;user-select:none;}
.ni:hover{color:var(--text);background:var(--s2);}
.ni.on{color:var(--green);background:var(--gl);border-color:var(--gs);}
.nb{margin-left:auto;background:var(--red);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;font-family:'JetBrains Mono',monospace;}
.sf{padding:12px 16px;border-top:1px solid var(--border);}
.uc{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:all .15s;}
.uc:hover{background:var(--s2);}
.ua{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;flex-shrink:0;}
.un{font-size:12px;font-weight:700;color:var(--text2);}
.ur{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;}
.mh{display:none;align-items:center;justify-content:space-between;background:var(--s1);border-bottom:1px solid var(--border);padding:14px 18px;position:sticky;top:0;z-index:200;}
.hb{background:none;border:none;display:flex;flex-direction:column;gap:5px;padding:4px;}
.hb span{display:block;width:20px;height:2px;background:var(--text);border-radius:2px;}
.ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:300;}
.ov.open{display:block;}
.mp{position:fixed;top:0;left:0;bottom:0;width:264px;background:var(--s1);z-index:400;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .25s ease;}
.mp.open{transform:translateX(0);}
.main{padding:28px 32px;display:flex;flex-direction:column;gap:18px;min-height:100vh;}
.ph{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.pt{font-size:22px;font-weight:900;letter-spacing:-.5px;}
.ps{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:3px;}
.card{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:18px 20px;}
.ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;}
.ct{font-size:13px;font-weight:800;}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.st{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:16px 18px;}
.st.prime{background:var(--text);border-color:var(--text);}
.st.prime .sl,.st.prime .ss{color:rgba(0,0,0,.45);}
.st.prime .sv{color:#0F0F0F;}
.sl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:9px;}
.sv{font-size:24px;font-weight:800;letter-spacing:-.5px;font-family:'JetBrains Mono',monospace;line-height:1;}
.ss{font-size:10px;color:var(--muted);margin-top:6px;font-family:'JetBrains Mono',monospace;}
.bdg{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace;white-space:nowrap;}
.g{background:var(--gl);color:var(--green);}
.p{background:var(--pl);color:var(--purple);}
.r{background:var(--rl);color:var(--red);}
.a{background:var(--al);color:var(--amber);}
.b{background:var(--bl);color:var(--blue);}
.t{background:var(--tl);color:var(--teal);}
.m{background:var(--s2);color:var(--muted);}
.btn{padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid var(--border);background:var(--s2);color:var(--text);transition:all .15s;display:inline-flex;align-items:center;gap:6px;}
.btn:hover{border-color:var(--text2);}
.bg{background:var(--green);color:#fff;border-color:var(--green);}.bg:hover{opacity:.88;}
.bb{background:var(--bl);border-color:rgba(43,108,176,.3);color:var(--blue);}
.br2{background:var(--rl);border-color:rgba(192,57,43,.3);color:var(--red);}
.bgh{background:transparent;color:var(--muted);}.bgh:hover{color:var(--text);background:var(--s2);}
.dis{opacity:.3;pointer-events:none;}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;}
.md{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:26px;width:100%;max-width:680px;max-height:92vh;overflow-y:auto;}
.mdl{max-width:820px;}.mdxl{max-width:960px;}
.fg{margin-bottom:12px;}
.fl{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;display:block;margin-bottom:5px;}
.fi{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--text);outline:none;transition:border-color .15s;}
.fi:focus{border-color:var(--green);}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.brow{display:flex;gap:10px;margin-top:18px;}
.bp2{flex:1;background:var(--green);color:#fff;border:none;border-radius:8px;padding:11px;font-size:13px;font-weight:800;}
.bs2{flex:1;background:transparent;color:var(--text2);border:1px solid var(--border);border-radius:8px;padding:11px;font-size:13px;font-weight:700;}
.tw{overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;padding:0 12px 10px;border-bottom:1px solid var(--border);}
td{padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--s2);}
.fts{display:flex;gap:5px;flex-wrap:wrap;}
.fb{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .15s;}
.fb:hover{color:var(--text);border-color:var(--text2);}
.fb.on{color:var(--text);background:var(--s2);border-color:var(--text2);}
.tip{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;}
.ip{display:inline-flex;align-items:center;gap:5px;background:var(--gl);border:1px solid var(--gs);border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;color:var(--green);font-family:'JetBrains Mono',monospace;}
.fab{position:fixed;bottom:26px;right:30px;background:var(--green);color:#fff;border:none;border-radius:50px;padding:12px 20px;font-size:13px;font-weight:900;display:flex;align-items:center;gap:7px;box-shadow:0 4px 20px rgba(0,0,0,.4);transition:transform .15s;z-index:50;}
.fab:hover{transform:translateY(-2px);}
.kb{display:grid;grid-template-columns:repeat(5,minmax(195px,1fr));gap:10px;overflow-x:auto;padding-bottom:8px;}
.kc{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:10px;min-height:240px;display:flex;flex-direction:column;transition:background .15s;}
.kc.dov{background:rgba(91,175,58,.08);border-color:var(--green);}
.kch{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.kct{font-size:11px;font-weight:800;display:flex;align-items:center;gap:6px;}
.kcd{width:7px;height:7px;border-radius:50%;}
.kcn{font-size:10px;background:var(--border);color:var(--text2);padding:1px 6px;border-radius:8px;font-family:'JetBrains Mono',monospace;}
.fk{background:var(--s1);border:1px solid var(--border);border-radius:9px;padding:12px;margin-bottom:8px;cursor:grab;transition:all .15s;}
.fk:active{cursor:grabbing;}
.fk:hover{border-color:rgba(91,175,58,.4);box-shadow:0 2px 10px rgba(0,0,0,.25);}
.fk.dragging{opacity:.35;}
.fid{font-size:9px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;}
.fie{font-size:13px;font-weight:800;margin-bottom:3px;}
.fip{font-size:11px;color:var(--text2);margin-bottom:8px;line-height:1.4;}
.fif{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:8px;}
.fifr{display:flex;justify-content:space-between;margin-bottom:2px;}
.pb{height:3px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:3px;}
.pf{height:100%;border-radius:2px;transition:width .3s;}
.pt2{font-size:9px;color:var(--muted);font-family:'JetBrains Mono',monospace;}
.pipe{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;overflow-x:auto;}
.pc{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:12px;min-height:80px;transition:background .15s;}
.pc.dov{background:rgba(91,175,58,.08);border-color:var(--green);}
.pch{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:10px;display:flex;justify-content:space-between;}
.pk{background:var(--s1);border:1px solid var(--border);border-radius:8px;padding:11px;margin-bottom:8px;cursor:grab;transition:all .15s;}
.pk:active{cursor:grabbing;}
.pk:hover{border-color:var(--text2);}
.pk.dragging{opacity:.35;}
.dh{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap;}
.de{font-size:20px;font-weight:900;margin-bottom:4px;}
.dm{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;}
.das{display:flex;flex-direction:column;gap:7px;min-width:200px;}
.es{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:700;color:var(--text);outline:none;cursor:pointer;width:100%;}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.df{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:11px 13px;}
.dfl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:5px;}
.dfv{font-size:14px;font-weight:700;}
.df input{background:none;border:none;outline:none;color:var(--text);font-size:14px;font-weight:700;width:100%;font-family:'Archivo',sans-serif;}
.eb{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:13px;margin-bottom:8px;}
.ebh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.ebn{font-size:12px;font-weight:800;display:flex;align-items:center;gap:7px;}
.si{display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--border);}
.si:last-child{border-bottom:none;}
.ck{width:17px;height:17px;border-radius:4px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;position:relative;}
.ck.done{background:var(--green);border-color:var(--green);}
.ck.done::before{content:'';position:absolute;width:4px;height:8px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg) translate(-1px,-2px);}
.ck.lk{opacity:.3;cursor:not-allowed;}
.ck.ul{cursor:pointer;}
.ck.ul:hover:not(.done){border-color:var(--green);}
.sil{font-size:12px;flex:1;line-height:1.4;}
.sil.dt{text-decoration:line-through;color:var(--muted);}
.ci{display:grid;grid-template-columns:1fr 80px 110px 26px;gap:8px;align-items:center;background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:7px;}
.mb{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:13px;margin-top:10px;}
.mr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;}
.mr:last-child{margin-bottom:0;}
.mrf{font-size:14px;font-weight:800;color:var(--green);border-top:1px solid var(--border);padding-top:8px;margin-top:8px;}
.xb{background:none;border:none;color:var(--muted);font-size:16px;transition:color .15s;}
.xb:hover{color:var(--red);}
.catg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.carc{background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:16px;}
.arc{display:flex;align-items:center;gap:12px;padding:9px 13px;background:var(--s2);border:1px solid var(--border);border-radius:8px;margin-bottom:6px;}
.cav{width:40px;height:40px;border-radius:10px;background:var(--gl);border:1px solid var(--gs);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:var(--green);flex-shrink:0;}
.cnc{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:14px;margin:10px 0;}
.cncr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;}
.cncb{background:var(--s1);border:1px solid var(--border);border-radius:7px;padding:10px;}
.uav{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#fff;flex-shrink:0;margin-left:4px;vertical-align:middle;}
/* PDF modal */
.pdfm{background:#fff;color:#111;border-radius:12px;padding:28px;font-family:'Archivo',sans-serif;}
/* LOGIN */
.lgp{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden;}
.lgp::before{content:'';position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(91,175,58,.07) 0%,transparent 65%);top:-200px;right:-150px;pointer-events:none;}
.lgp::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(43,108,176,.05) 0%,transparent 65%);bottom:-100px;left:-100px;pointer-events:none;}
.lgc{background:var(--s1);border:1px solid var(--border);border-radius:24px;padding:48px 44px;width:100%;max-width:440px;position:relative;z-index:1;box-shadow:0 24px 80px rgba(0,0,0,.5);}
.lg-logo{margin-bottom:8px;}
.lg-logo-text{font-size:32px;font-weight:900;letter-spacing:-.5px;}
.lg-logo-text span{color:var(--green);}
.lg-tag{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:2px;text-transform:uppercase;margin-bottom:36px;}
.lg-ttl{font-size:18px;font-weight:800;color:var(--text);margin-bottom:6px;}
.lg-sub{font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.5;}
.lgu{width:100%;display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:14px;border:1px solid var(--border);background:var(--s2);color:var(--text);margin-bottom:12px;transition:all .2s;text-align:left;cursor:pointer;}
.lgu:hover{border-color:var(--green);background:rgba(91,175,58,.06);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2);}
.lgu:last-child{margin-bottom:0;}
.lgu-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,.3);}
.lgu-name{font-size:15px;font-weight:800;}
.lgu-role{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:3px;}
.lg-sep{display:flex;align-items:center;gap:12px;margin:24px 0;}
.lg-sep-line{flex:1;height:1px;background:var(--border);}
.lg-sep-text{font-size:11px;color:var(--muted);}
.lg-foot{text-align:center;font-size:11px;color:var(--muted);line-height:1.6;}
.lg-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);margin-right:5px;vertical-align:middle;}
@media(max-width:1200px){.sr{grid-template-columns:1fr 1fr;}.kb{grid-template-columns:repeat(3,minmax(180px,1fr));}.catg{grid-template-columns:1fr 1fr;}}
@media(max-width:900px){.pipe{grid-template-columns:1fr 1fr;}}
@media(max-width:768px){
  .app{grid-template-columns:1fr;}.sb{display:none;}.mh{display:flex;}.main{padding:18px 14px 100px;}
  .sr{grid-template-columns:1fr 1fr;}.kb{grid-template-columns:repeat(2,minmax(160px,1fr));}.dg{grid-template-columns:1fr;}.fr{grid-template-columns:1fr;}.catg{grid-template-columns:1fr;}
  .fab{bottom:18px;right:14px;left:14px;justify-content:center;border-radius:12px;}.das{min-width:unset;width:100%;}
}
@media(max-width:480px){.main{padding:12px 10px 100px;}.sr{grid-template-columns:1fr;}.kb{grid-template-columns:minmax(160px,1fr);}}
`;

/* ─── HELPERS ─── */
const UAv = ({uid}) => { const u=USUARIOS[uid]; if(!u) return null; return <span className="uav" style={{background:u.color}} title={u.nombre}>{u.inicial}</span>; };
const ChTip = ({active,payload,label}) => !active||!payload?.length?null:(
  <div className="tip"><div style={{color:"#666",marginBottom:5,fontWeight:600}}>{label}</div><div style={{color:"var(--green)"}}>Ingresos: {f$(payload[0]?.value)}</div><div style={{color:"var(--red)"}}>Costos: {f$(payload[1]?.value)}</div></div>
);
const progPed = p => {
  const idx=KANBAN.indexOf(p.estado); let t=0,d=0;
  KANBAN.slice(0,idx+1).forEach(e=>{const s=p.subs[e]||[];t+=s.length;d+=s.filter(x=>x.done).length;});
  return t>0?Math.round(d/t*100):0;
};

/* ─── DnD ─── */
function PDFModal({cot,onClose}) {
  const tvN=cot.items.reduce((a,i)=>a+i.pu*i.qty,0);
  const iva=Math.round(tvN*IVA); const tvT=tvN+iva;
  const kgTot=cot.items.reduce((a,i)=>a+i.kg*i.qty,0);
  const yogures=Math.round(kgTot/0.006);
  const printCSS=`
    @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Archivo',sans-serif;background:#fff;color:#111;font-size:11pt;padding:15mm 16mm;}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm;}
    .logo-img{height:30px;display:block;}
    .logo-tag{font-size:8pt;color:#888;letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
    .cot-id{font-size:18pt;font-weight:900;text-align:right;}.cot-fecha{font-size:9pt;color:#888;text-align:right;}
    .cot-titulo{font-size:9pt;font-weight:800;color:#5BAF3A;text-transform:uppercase;letter-spacing:1px;text-align:right;margin-top:3px;}
    .div-g{height:3px;background:#5BAF3A;border-radius:2px;margin:5mm 0 7mm;}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-bottom:5mm;}.cli-blk{background:#F7F7F5;border-radius:5px;padding:5mm 6mm;margin-bottom:5mm;border-left:3px solid #5BAF3A;}.cli-ttl{font-size:8pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#5BAF3A;margin-bottom:4px;}.cli-row{display:flex;gap:8px;margin-bottom:3px;font-size:10pt;align-items:baseline;}.cli-k{color:#888;font-weight:600;min-width:88px;flex-shrink:0;font-size:9pt;}.cli-v{font-weight:700;color:#111;}
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
    .cli-blk{background:#F7F7F5;border-radius:5px;padding:5mm 6mm;margin-bottom:5mm;border-left:3px solid #5BAF3A;}
.cli-title{font-size:8pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#5BAF3A;margin-bottom:4mm;}
.cli-row{display:flex;gap:3mm;margin-bottom:2mm;font-size:10pt;}
.cli-lbl{color:#888;font-weight:600;min-width:90px;flex-shrink:0;}
.cli-val{font-weight:700;color:#111;flex:1;}
.foot{border-top:2px solid #111;padding-top:5mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm;font-size:9pt;}
    .ft{font-size:7.5pt;color:#888;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;}
    .fv{color:#333;margin-bottom:2px;}.fb2{font-weight:700;}.fgr{color:#5BAF3A;font-weight:700;}
    @page{size:A4;margin:0;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  `;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${cot.id}</title><style>${printCSS}</style></head><body>
<div class="hdr"><div><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDgzNiAyODIiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAzMC4zLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMyBCdWlsZCAxODIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogIzhhZGM1YjsKICAgICAgfQoKICAgICAgLnN0MSB7CiAgICAgICAgZmlsbDogIzFkMWQxYjsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDIxLjcsMTEyLjcyYy0zLjA1LDAtNS45NS42Ni04LjYxLDEuOTYtMi42LDEuMjctNS4wMiwyLjk2LTcuMTgsNS4wMS0yLjE1LDIuMDQtNC4wMiw0LjM2LTUuNTYsNi44OS0uMzQuNTYtLjY3LDEuMTMtLjk3LDEuNjl2LTYuOTljMC01LjExLTIuODEtNy45My03LjkzLTcuOTNoLTYuMjRjLTUuMDEsMC03Ljc3LDIuODItNy43Nyw3LjkzdjY4LjE5YzAsNS4xMSwyLjc2LDcuOTMsNy43Nyw3LjkzaDcuMDRjNS4wMSwwLDcuNzctMi44Miw3Ljc3LTcuOTN2LTI2LjI1YzAtMy42Mi40NC03LjE4LDEuMzItMTAuNTkuODctMy4zOCwyLjE5LTYuNDMsMy45Mi05LjA5LDEuNzEtMi42MSwzLjktNC43NSw2LjUxLTYuMzYsMi41Ny0xLjU4LDUuNjQtMi4zOCw5LjEzLTIuMzgsNS4yMSwwLDguMDktMi44Miw4LjA5LTcuOTN2LTYuMjRjMC0yLjUxLS41NS00LjQ2LTEuNjMtNS44LTEuMTQtMS40MS0zLjA1LTIuMTMtNS42Ni0yLjEzWiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTUwMC4zMSwxMjIuODhjLTMuMTQtMy41My03LjExLTYuMzUtMTEuNzgtOC4zOS00LjY3LTIuMDMtMTAuMDMtMy4wNi0xNS45My0zLjA2LTYuMjEsMC0xMi4wMiwxLjA4LTE3LjI2LDMuMjEtNS4yNiwyLjEzLTkuODEsNS4xOS0xMy41NCw5LjA5LTMuNzIsMy44OS02LjY2LDguNTctOC43NCwxMy45Mi0yLjA3LDUuMzQtMy4xMiwxMS4zMS0zLjEyLDE3LjcyLDAsNS44OSwxLjA1LDExLjU2LDMuMTIsMTYuODUsMi4wNyw1LjMsNS4xLDEwLjAxLDguOTgsMTQuMDEsMy44OCwzLjk5LDguNjcsNy4yMSwxNC4yNCw5LjU1LDUuNTcsMi4zNSwxMS44NiwzLjU0LDE4LjcyLDMuNTRzMTIuMjctLjk3LDE3LjA5LTIuODljNC43NC0xLjg4LDguNTItMy43MiwxMS4yMi01LjQ1LDQuMDktMi40OCw1LjAyLTYuMTMsMi42NS0xMC42MWwtMS45Mi0zLjE5Yy0xLjI0LTIuMTEtMi43Ny0zLjM3LTQuNTQtMy43Ny0xLjctLjM4LTMuNzEtLjAzLTUuOTgsMS4wNS0uMDQuMDItLjA4LjA0LS4xMS4wNi0xLjg1LDEuMTMtNC4yOSwyLjI4LTcuMjUsMy40My0yLjg4LDEuMTEtNi4xNiwxLjY4LTkuNzMsMS42OC0yLjk1LDAtNS44MS0uNDYtOC41LTEuMzgtMi42Ny0uOTEtNS4wNy0yLjI2LTcuMTMtNC4wMi0yLjA2LTEuNzUtMy43OS0zLjk4LTUuMTYtNi42LTEuMTktMi4yOS0xLjk5LTQuOTgtMi4zNy04LjAxaDQ4LjQ1YzIuMzYsMCw0LjM0LS44Miw1LjkxLTIuNDUsMS41NS0xLjYxLDIuMzQtMy41MSwyLjM0LTUuNjQsMC01LjY1LS44My0xMS0yLjQ2LTE1LjkxLTEuNjUtNC45My00LjA3LTkuMjItNy4yMS0xMi43NVpNNDcyLjEyLDEyOS4yMWM0LjM5LDAsNy45MSwxLjQyLDEwLjc0LDQuMzYsMi41OSwyLjY5LDQuMSw2LjQ5LDQuNDcsMTEuMzNoLTMzLjQzYzEuMDMtNC41MiwzLjA0LTguMjMsNi0xMS4wNSwzLjIyLTMuMDcsNy4zMy00LjYzLDEyLjIyLTQuNjNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTg4LjMzLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjAuMzUsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIwLjM1LDExMy4zNmgtNy4wNGMtNS4wMSwwLTcuNzcsMi44Mi03Ljc3LDcuOTN2NjguMTljMCw1LjExLDIuNzYsNy45Myw3Ljc3LDcuOTNoNy4wNGM1LjAxLDAsNy43Ny0yLjgyLDcuNzctNy45M3YtNjguMTljMC01LjExLTIuNzYtNy45My03Ljc3LTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzExLjkxLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsMTEzLjM2aC03LjA0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi02OC4xOWMwLTUuMTEtMi43Ni03LjkzLTcuNzctNy45M1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNODE5LjM3LDExNC44NGMtMS4xNC0xLjQxLTMuMDUtMi4xMy01LjY2LTIuMTMtMy4wNSwwLTUuOTUuNjYtOC42MSwxLjk2LTIuNiwxLjI3LTUuMDIsMi45Ni03LjE4LDUuMDEtMi4xNSwyLjA0LTQuMDIsNC4zNi01LjU2LDYuODktLjM0LjU2LS42NywxLjEzLS45NywxLjY5di02Ljk5YzAtNS4xMS0yLjgxLTcuOTMtNy45My03LjkzaC02LjI0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi0yNi4yNWMwLTMuNjIuNDQtNy4xOCwxLjMyLTEwLjU5Ljg3LTMuMzgsMi4xOS02LjQzLDMuOTItOS4wOSwxLjcxLTIuNjEsMy45LTQuNzUsNi41MS02LjM2LDIuNTctMS41OCw1LjY0LTIuMzgsOS4xMy0yLjM4LDUuMjEsMCw4LjA5LTIuODIsOC4wOS03Ljkzdi02LjI0YzAtMi41MS0uNTUtNC40Ni0xLjYzLTUuOFoiLz4KICA8L2c+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTMxOS40NCw4NS4wMWMtMS41Mi0xNi4zNS03LjI0LTMxLjM3LTIwLjA2LTQyLjA3LTE3LjY2LTE0LjczLTUzLjQtMTkuMDEtNzQuMTYsNi4yNy05LjM0LDExLjM3LTE2LjE5LDI0LjEzLTIyLjE5LDM3LjQ0LTguNjUsMTkuMTUtMTUuMiwzOS4wMS0yMC4xOSw2MC42Ny0uNzktMS43OC0xLjEzLTIuNDQtMS4zOS0zLjE0LTEwLjk4LTI4Ljg0LTIzLjI5LTU3LjA1LTQwLjU0LTgyLjgtMTEuOTEtMTcuNzgtMjUuMTQtMzQuNDgtNDQuMDktNDUuMzMtMTUuMDYtOC42Mi0zMC44OC0xMS4wNS00Ny4wMS0yLjU4LTE0LjU2LDcuNjUtMjMuNjIsMTkuOTYtMjkuMDYsMzUuMi02LjIsMTcuMzgtNi4xOSwzNS4zOS00LjY3LDUzLjM3LDIuNTEsMjkuODEsMTEuMTUsNTguMDYsMjMuNjcsODUuMSwxMi45NiwyNy45OSwyOS40OSw1My4zNiw1NC41Miw3Mi4zNSwyNi4yOCwxOS45Myw1NC4yLDE2Ljg5LDc0LjMtOS4zMyw4LjE2LTEwLjY0LDE0LjMxLTIyLjgyLDIxLjQ2LTM0LjQ1LDEuMSwxLjM2LDIuNjYsMy4zNSw0LjI5LDUuMjksNS41Miw2LjU2LDEyLjUxLDExLDIxLjAzLDExLjY3LDE2LjMyLDEuMjksMzEuMTctMi45NCw0NC4xLTEzLjM5LDE2LjAyLTEyLjk1LDI3Ljg4LTI5LjI4LDM3LjcyLTQ3LjA4LDE0Ljk2LTI3LjA3LDI1LjIxLTU1LjU2LDIyLjI3LTg3LjE5Wk0xNTkuMzQsMjIyLjE0Yy0xLjM3LDIuNS0yLjk2LDQuOTUtNC44MSw3LjM0LTEuNCwxLjgyLTIuOSwzLjQ0LTQuNDUsNC45Mi0yLjgzLDIuODQtNS44Niw1LjExLTkuMDksNi40NS0uMDEsMC0uMDIsMC0uMDQuMDEtLjg2LjQzLTEuNzMuODMtMi42MSwxLjE4LS4xMS4wNi0uMjEuMTItLjMyLjE3bC0uMDItLjA0Yy0xMS40Miw0LjM4LTI0LjMsMi4wNC0zNS4zNi03LjM3LTEyLjQ0LTEwLjU5LTIxLjItMjQuMTYtMjkuNC0zOC4wNy0xNC41My0yNC42Ni0yMy4xNS01MS4zNC0yNi42OC03OS42OS0uNC0zLjE4LS43Ni02LjM2LTEuMTMtOS43MS0xLjIxLTEwLjg4LS43MS0yMS45MiwxLjg4LTMyLjU1LjQtMS42NC44NS0zLjI3LDEuMzYtNC44OSw1LjAyLTE1Ljc2LDE3LjM2LTIxLjc5LDMzLjE0LTE2Ljc2LDEzLjMxLDQuMjMsMjMuNjUsMTMuMDIsMzIuODMsMjMuMTEsMTQuMTUsMTUuNTcsMjUuMjUsMzIuNywzMy43MSw1MS4xMWwuMDItLjAzczYuNDcsMTMuMjcsMTAuNywyNC4wNmM1LjI0LDEzLjM2LDguOTUsMjMuNTYsMTQuNjYsMzcuNTNoMHMtNS4yNywxOC4xMS0xNC4zOSwzMy4yMlpNMjkwLjMsMTIxLjU2Yy01Ljc2LDI4LjMtMTcuNDEsNTQuODYtNDIuNDIsNzUuMTQtMi4xMiwxLjcyLTQuMzEsMy4yNS02LjU3LDQuNTctLjgzLjUzLTIuOTksMS43OS02LjE2LDIuOTMtNC44MywxLjgtMTAuMDQsMi42LTE1LjcxLDIuMDQtLjA0LDAtLjA3LS4wMS0uMTEtLjAxLS4wMywwLS4wNSwwLS4wOCwwLS4wOCwwLS4xNS0uMDMtLjIyLS4wMy0uNzgtLjA5LTEuNTMtLjIxLTIuMjYtLjM1LS4yNi0uMDUtLjUyLS4xLS43Ny0uMTYtLjc4LS4xOC0xLjUyLS4zOS0yLjI0LS42NC0uMTEtLjA0LS4yMS0uMDgtLjMyLS4xMi0uNjctLjI0LTEuMzEtLjUyLTEuOTMtLjgyLS4xMS0uMDUtLjIyLS4xLS4zMi0uMTYtLjA3LS4wNC0uMTMtLjA4LS4yMS0uMTItLjQ5LS4yNS0uOTctLjUyLTEuNDQtLjgzLS4wMi0uMDEtLjA0LS4wMi0uMDYtLjAzLS4wMy0uMDItLjA2LS4wNS0uMS0uMDctLjMyLS4yMS0uNjMtLjQzLS45NC0uNjYtLjMtLjIyLS41OS0uNDUtLjg3LS42OC0uMDUtLjA0LS4xLS4wOC0uMTQtLjEyLS4zNi0uMzEtLjcxLS42Mi0xLjA0LS45My00Ljk2LTQuNjktOC41NS0xMS4zOS04LjU1LTExLjM5bDguNTktMzcuMjhoMGMuMzUtMS40NS43LTIuOTEsMS4wOC00LjM2LDIuMTQtOC43NiwzLjc0LTEzLjQ4LDMuNzQtMTMuNDgsMCwwLDEuODYtNi4yMywyLjgtOS4zNCw1LjA3LTE2Ljc1LDExLjI3LTMzLjEyLDIyLjc0LTQ2LjcyLDQuMDQtNC43OSw4Ljc0LTkuMzIsMTMuOTUtMTIuNzUsMTcuOTQtMTEuODMsMzcuNzUtMi43LDQwLjkzLDE4LjYuMDguNTQuMTYsMS4wOC4yMywxLjYyLDEuNTYsMTIuMDUuODQsMjQuMjctMS41OCwzNi4xOFoiLz4KPC9zdmc+" style="height:30px;display:block;margin-bottom:4px;" alt="revivir"/><div class="logo-tag">Diseño con plástico reciclado</div></div>
<div><div class="cot-id">${cot.id}</div><div class="cot-fecha">${tod()}</div><div class="cot-titulo">Cotización de productos de plástico reciclado</div></div></div>
<div class="div-g"></div>
<div class="cli-blk">
<div class="cli-ttl">Datos del cliente</div>
<div class="cli-row"><span class="cli-k">Institución:</span><span class="cli-v">${cot.empresa}${cot.rut?" · RUT: "+cot.rut:""}</span></div>
${cot.contacto?`<div class="cli-row"><span class="cli-k">Solicitante:</span><span class="cli-v">${cot.contacto}${cot.cargo?" · "+cot.cargo:""}</span></div>`:""}
${(cot.tel||cot.telefono)?`<div class="cli-row"><span class="cli-k">Teléfono:</span><span class="cli-v">${cot.tel||cot.telefono}</span></div>`:""}
<div class="cli-row"><span class="cli-k">Dirección:</span><span class="cli-v">${[cot.dir||cot.direccion,cot.ciudad].filter(Boolean).join(", ")||"A coordinar"}</span></div>
</div>
<div class="cond">
<div class="blk"><div class="lbl">ENTREGA</div><div class="val" style="font-size:10pt">A coordinar</div></div>
<div class="blk"><div class="lbl">PLAZO FABRICACIÓN</div><div class="val" style="font-size:10pt">30 días hábiles</div></div>
<div class="blk"><div class="lbl">CONDICIÓN DE PAGO</div><div class="val" style="font-size:10pt">A acordar</div></div>
<div class="blk"><div class="lbl">VIGENCIA</div><div class="val" style="font-size:10pt">15 días corridos</div></div>
</div>
<div class="terms"><strong>Nota:</strong> La presente cotización se realiza específicamente para la institución identificada y es intransferible. Las combinaciones de colores son a coordinar.${cot.notas?` <strong>Observaciones:</strong> ${cot.notas}`:""}</div>
<table><thead><tr><th>Producto</th><th class="tr">Valor Unit. Neto</th><th class="tc">Cantidad</th><th class="tr">Total Neto</th><th class="tr">Total con IVA</th></tr></thead>
<tbody>${cot.items.map(i=>`<tr><td style="font-weight:700">${i.n}</td><td class="tr">${ff(i.pu)}</td><td class="tc">${i.qty}</td><td class="tr">${ff(i.pu*i.qty)}</td><td class="tg">${ff(Math.round(i.pu*i.qty*(1+IVA)))}</td></tr>`).join("")}</tbody></table>
<div class="tots"><div class="trow"><span>NETO</span><span>${ff(tvN)}</span></div><div class="trow" style="color:#888"><span>IVA (19%)</span><span>${ff(iva)}</span></div><div class="trow tfin"><span>TOTAL</span><span>${ff(tvT)}</span></div></div>
<div class="imp"><div class="imp-ico">♻</div><div><div class="imp-t">Impacto ambiental de este pedido</div><div class="imp-s">${kgTot.toFixed(2)} kg de plástico reciclado · ~${yogures.toLocaleString()} envases de yogur recuperados</div></div></div>
<div class="foot">
<div><div class="ft">Datos de la empresa</div><div class="fv fb2">Ventas Jenny Catalina Sáez Hernández E.I.R.L</div><div class="fv">Coronel 2355, oficina 11, Providencia, Santiago</div><div class="fv">Representante: <span class="fb2">Jenny Sáez</span> · +56 9 3207 6408</div><div class="fv fgr">info@tiendarevivir.cl · tiendarevivir.cl</div></div>
<div><div class="ft">Información de pago</div><div class="fv fb2">Ventas Jenny Catalina Sáez Hernández E.I.R.L</div><div class="fv">Banco: <span class="fb2">Mercado Pago</span></div><div class="fv">Cuenta Vista: <span class="fb2">1012406684</span></div><div class="fv">Email: <span class="fgr">info@tiendarevivir.cl</span></div></div>
</div></body></html>`;

  return (
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="md mdl" style={{background:"#f5f5f5",padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:800,color:"#111"}}>Vista previa — {cot.id}</div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn bb" style={{fontSize:12}} onClick={()=>{
              const w=window.open("","_blank");
              w.document.write(html);w.document.close();
              setTimeout(()=>w.print(),1000);
            }}>⬇ Descargar / Imprimir PDF</button>
            <button className="btn" style={{fontSize:12}} onClick={onClose}>Cerrar</button>
          </div>
        </div>
        <div className="pdfm" style={{maxHeight:"70vh",overflowY:"auto"}}>
          {/* PREVIEW */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDgzNiAyODIiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAzMC4zLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMyBCdWlsZCAxODIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogIzhhZGM1YjsKICAgICAgfQoKICAgICAgLnN0MSB7CiAgICAgICAgZmlsbDogIzFkMWQxYjsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDIxLjcsMTEyLjcyYy0zLjA1LDAtNS45NS42Ni04LjYxLDEuOTYtMi42LDEuMjctNS4wMiwyLjk2LTcuMTgsNS4wMS0yLjE1LDIuMDQtNC4wMiw0LjM2LTUuNTYsNi44OS0uMzQuNTYtLjY3LDEuMTMtLjk3LDEuNjl2LTYuOTljMC01LjExLTIuODEtNy45My03LjkzLTcuOTNoLTYuMjRjLTUuMDEsMC03Ljc3LDIuODItNy43Nyw3LjkzdjY4LjE5YzAsNS4xMSwyLjc2LDcuOTMsNy43Nyw3LjkzaDcuMDRjNS4wMSwwLDcuNzctMi44Miw3Ljc3LTcuOTN2LTI2LjI1YzAtMy42Mi40NC03LjE4LDEuMzItMTAuNTkuODctMy4zOCwyLjE5LTYuNDMsMy45Mi05LjA5LDEuNzEtMi42MSwzLjktNC43NSw2LjUxLTYuMzYsMi41Ny0xLjU4LDUuNjQtMi4zOCw5LjEzLTIuMzgsNS4yMSwwLDguMDktMi44Miw4LjA5LTcuOTN2LTYuMjRjMC0yLjUxLS41NS00LjQ2LTEuNjMtNS44LTEuMTQtMS40MS0zLjA1LTIuMTMtNS42Ni0yLjEzWiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTUwMC4zMSwxMjIuODhjLTMuMTQtMy41My03LjExLTYuMzUtMTEuNzgtOC4zOS00LjY3LTIuMDMtMTAuMDMtMy4wNi0xNS45My0zLjA2LTYuMjEsMC0xMi4wMiwxLjA4LTE3LjI2LDMuMjEtNS4yNiwyLjEzLTkuODEsNS4xOS0xMy41NCw5LjA5LTMuNzIsMy44OS02LjY2LDguNTctOC43NCwxMy45Mi0yLjA3LDUuMzQtMy4xMiwxMS4zMS0zLjEyLDE3LjcyLDAsNS44OSwxLjA1LDExLjU2LDMuMTIsMTYuODUsMi4wNyw1LjMsNS4xLDEwLjAxLDguOTgsMTQuMDEsMy44OCwzLjk5LDguNjcsNy4yMSwxNC4yNCw5LjU1LDUuNTcsMi4zNSwxMS44NiwzLjU0LDE4LjcyLDMuNTRzMTIuMjctLjk3LDE3LjA5LTIuODljNC43NC0xLjg4LDguNTItMy43MiwxMS4yMi01LjQ1LDQuMDktMi40OCw1LjAyLTYuMTMsMi42NS0xMC42MWwtMS45Mi0zLjE5Yy0xLjI0LTIuMTEtMi43Ny0zLjM3LTQuNTQtMy43Ny0xLjctLjM4LTMuNzEtLjAzLTUuOTgsMS4wNS0uMDQuMDItLjA4LjA0LS4xMS4wNi0xLjg1LDEuMTMtNC4yOSwyLjI4LTcuMjUsMy40My0yLjg4LDEuMTEtNi4xNiwxLjY4LTkuNzMsMS42OC0yLjk1LDAtNS44MS0uNDYtOC41LTEuMzgtMi42Ny0uOTEtNS4wNy0yLjI2LTcuMTMtNC4wMi0yLjA2LTEuNzUtMy43OS0zLjk4LTUuMTYtNi42LTEuMTktMi4yOS0xLjk5LTQuOTgtMi4zNy04LjAxaDQ4LjQ1YzIuMzYsMCw0LjM0LS44Miw1LjkxLTIuNDUsMS41NS0xLjYxLDIuMzQtMy41MSwyLjM0LTUuNjQsMC01LjY1LS44My0xMS0yLjQ2LTE1LjkxLTEuNjUtNC45My00LjA3LTkuMjItNy4yMS0xMi43NVpNNDcyLjEyLDEyOS4yMWM0LjM5LDAsNy45MSwxLjQyLDEwLjc0LDQuMzYsMi41OSwyLjY5LDQuMSw2LjQ5LDQuNDcsMTEuMzNoLTMzLjQzYzEuMDMtNC41MiwzLjA0LTguMjMsNi0xMS4wNSwzLjIyLTMuMDcsNy4zMy00LjYzLDEyLjIyLTQuNjNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTg4LjMzLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjAuMzUsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIwLjM1LDExMy4zNmgtNy4wNGMtNS4wMSwwLTcuNzcsMi44Mi03Ljc3LDcuOTN2NjguMTljMCw1LjExLDIuNzYsNy45Myw3Ljc3LDcuOTNoNy4wNGM1LjAxLDAsNy43Ny0yLjgyLDcuNzctNy45M3YtNjguMTljMC01LjExLTIuNzYtNy45My03Ljc3LTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzExLjkxLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsMTEzLjM2aC03LjA0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi02OC4xOWMwLTUuMTEtMi43Ni03LjkzLTcuNzctNy45M1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNODE5LjM3LDExNC44NGMtMS4xNC0xLjQxLTMuMDUtMi4xMy01LjY2LTIuMTMtMy4wNSwwLTUuOTUuNjYtOC42MSwxLjk2LTIuNiwxLjI3LTUuMDIsMi45Ni03LjE4LDUuMDEtMi4xNSwyLjA0LTQuMDIsNC4zNi01LjU2LDYuODktLjM0LjU2LS42NywxLjEzLS45NywxLjY5di02Ljk5YzAtNS4xMS0yLjgxLTcuOTMtNy45My03LjkzaC02LjI0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi0yNi4yNWMwLTMuNjIuNDQtNy4xOCwxLjMyLTEwLjU5Ljg3LTMuMzgsMi4xOS02LjQzLDMuOTItOS4wOSwxLjcxLTIuNjEsMy45LTQuNzUsNi41MS02LjM2LDIuNTctMS41OCw1LjY0LTIuMzgsOS4xMy0yLjM4LDUuMjEsMCw4LjA5LTIuODIsOC4wOS03Ljkzdi02LjI0YzAtMi41MS0uNTUtNC40Ni0xLjYzLTUuOFoiLz4KICA8L2c+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTMxOS40NCw4NS4wMWMtMS41Mi0xNi4zNS03LjI0LTMxLjM3LTIwLjA2LTQyLjA3LTE3LjY2LTE0LjczLTUzLjQtMTkuMDEtNzQuMTYsNi4yNy05LjM0LDExLjM3LTE2LjE5LDI0LjEzLTIyLjE5LDM3LjQ0LTguNjUsMTkuMTUtMTUuMiwzOS4wMS0yMC4xOSw2MC42Ny0uNzktMS43OC0xLjEzLTIuNDQtMS4zOS0zLjE0LTEwLjk4LTI4Ljg0LTIzLjI5LTU3LjA1LTQwLjU0LTgyLjgtMTEuOTEtMTcuNzgtMjUuMTQtMzQuNDgtNDQuMDktNDUuMzMtMTUuMDYtOC42Mi0zMC44OC0xMS4wNS00Ny4wMS0yLjU4LTE0LjU2LDcuNjUtMjMuNjIsMTkuOTYtMjkuMDYsMzUuMi02LjIsMTcuMzgtNi4xOSwzNS4zOS00LjY3LDUzLjM3LDIuNTEsMjkuODEsMTEuMTUsNTguMDYsMjMuNjcsODUuMSwxMi45NiwyNy45OSwyOS40OSw1My4zNiw1NC41Miw3Mi4zNSwyNi4yOCwxOS45Myw1NC4yLDE2Ljg5LDc0LjMtOS4zMyw4LjE2LTEwLjY0LDE0LjMxLTIyLjgyLDIxLjQ2LTM0LjQ1LDEuMSwxLjM2LDIuNjYsMy4zNSw0LjI5LDUuMjksNS41Miw2LjU2LDEyLjUxLDExLDIxLjAzLDExLjY3LDE2LjMyLDEuMjksMzEuMTctMi45NCw0NC4xLTEzLjM5LDE2LjAyLTEyLjk1LDI3Ljg4LTI5LjI4LDM3LjcyLTQ3LjA4LDE0Ljk2LTI3LjA3LDI1LjIxLTU1LjU2LDIyLjI3LTg3LjE5Wk0xNTkuMzQsMjIyLjE0Yy0xLjM3LDIuNS0yLjk2LDQuOTUtNC44MSw3LjM0LTEuNCwxLjgyLTIuOSwzLjQ0LTQuNDUsNC45Mi0yLjgzLDIuODQtNS44Niw1LjExLTkuMDksNi40NS0uMDEsMC0uMDIsMC0uMDQuMDEtLjg2LjQzLTEuNzMuODMtMi42MSwxLjE4LS4xMS4wNi0uMjEuMTItLjMyLjE3bC0uMDItLjA0Yy0xMS40Miw0LjM4LTI0LjMsMi4wNC0zNS4zNi03LjM3LTEyLjQ0LTEwLjU5LTIxLjItMjQuMTYtMjkuNC0zOC4wNy0xNC41My0yNC42Ni0yMy4xNS01MS4zNC0yNi42OC03OS42OS0uNC0zLjE4LS43Ni02LjM2LTEuMTMtOS43MS0xLjIxLTEwLjg4LS43MS0yMS45MiwxLjg4LTMyLjU1LjQtMS42NC44NS0zLjI3LDEuMzYtNC44OSw1LjAyLTE1Ljc2LDE3LjM2LTIxLjc5LDMzLjE0LTE2Ljc2LDEzLjMxLDQuMjMsMjMuNjUsMTMuMDIsMzIuODMsMjMuMTEsMTQuMTUsMTUuNTcsMjUuMjUsMzIuNywzMy43MSw1MS4xMWwuMDItLjAzczYuNDcsMTMuMjcsMTAuNywyNC4wNmM1LjI0LDEzLjM2LDguOTUsMjMuNTYsMTQuNjYsMzcuNTNoMHMtNS4yNywxOC4xMS0xNC4zOSwzMy4yMlpNMjkwLjMsMTIxLjU2Yy01Ljc2LDI4LjMtMTcuNDEsNTQuODYtNDIuNDIsNzUuMTQtMi4xMiwxLjcyLTQuMzEsMy4yNS02LjU3LDQuNTctLjgzLjUzLTIuOTksMS43OS02LjE2LDIuOTMtNC44MywxLjgtMTAuMDQsMi42LTE1LjcxLDIuMDQtLjA0LDAtLjA3LS4wMS0uMTEtLjAxLS4wMywwLS4wNSwwLS4wOCwwLS4wOCwwLS4xNS0uMDMtLjIyLS4wMy0uNzgtLjA5LTEuNTMtLjIxLTIuMjYtLjM1LS4yNi0uMDUtLjUyLS4xLS43Ny0uMTYtLjc4LS4xOC0xLjUyLS4zOS0yLjI0LS42NC0uMTEtLjA0LS4yMS0uMDgtLjMyLS4xMi0uNjctLjI0LTEuMzEtLjUyLTEuOTMtLjgyLS4xMS0uMDUtLjIyLS4xLS4zMi0uMTYtLjA3LS4wNC0uMTMtLjA4LS4yMS0uMTItLjQ5LS4yNS0uOTctLjUyLTEuNDQtLjgzLS4wMi0uMDEtLjA0LS4wMi0uMDYtLjAzLS4wMy0uMDItLjA2LS4wNS0uMS0uMDctLjMyLS4yMS0uNjMtLjQzLS45NC0uNjYtLjMtLjIyLS41OS0uNDUtLjg3LS42OC0uMDUtLjA0LS4xLS4wOC0uMTQtLjEyLS4zNi0uMzEtLjcxLS42Mi0xLjA0LS45My00Ljk2LTQuNjktOC41NS0xMS4zOS04LjU1LTExLjM5bDguNTktMzcuMjhoMGMuMzUtMS40NS43LTIuOTEsMS4wOC00LjM2LDIuMTQtOC43NiwzLjc0LTEzLjQ4LDMuNzQtMTMuNDgsMCwwLDEuODYtNi4yMywyLjgtOS4zNCw1LjA3LTE2Ljc1LDExLjI3LTMzLjEyLDIyLjc0LTQ2LjcyLDQuMDQtNC43OSw4Ljc0LTkuMzIsMTMuOTUtMTIuNzUsMTcuOTQtMTEuODMsMzcuNzUtMi43LDQwLjkzLDE4LjYuMDguNTQuMTYsMS4wOC4yMywxLjYyLDEuNTYsMTIuMDUuODQsMjQuMjctMS41OCwzNi4xOFoiLz4KPC9zdmc+" style={{height:24,display:"block"}} alt="revivir"/>
              <div style={{fontSize:9,color:"#888",letterSpacing:"2px",textTransform:"uppercase"}}>Diseño con plástico reciclado</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:900}}>{cot.id}</div>
              <div style={{fontSize:10,color:"#888"}}>{tod()}</div>
              <div style={{fontSize:9,fontWeight:800,color:"#5BAF3A",textTransform:"uppercase",letterSpacing:"1px",marginTop:2}}>Cotización de productos de plástico reciclado</div>
            </div>
          </div>
          <div style={{height:3,background:"#5BAF3A",borderRadius:2,marginBottom:14}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[["INSTITUCIÓN",cot.empresa,cot.rut?`RUT: ${cot.rut}`:""],["SOLICITANTE",cot.contacto||"—",cot.cargo||""],["DIRECCIÓN",cot.dir||"A coordinar",cot.ciudad||""],["CONTACTO",cot.tel||"—",""]].map(([l,v,s])=>(
              <div key={l} style={{background:"#F7F7F5",borderRadius:5,padding:"10px 12px"}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#888",marginBottom:3}}>{l}</div>
                <div style={{fontSize:12,fontWeight:800}}>{v}</div>
                {s&&<div style={{fontSize:11,color:"#555"}}>{s}</div>}
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
            {[["ENTREGA","A coordinar"],["PLAZO","30 días hábiles"],["PAGO","A acordar"],["VIGENCIA","15 días corridos"]].map(([l,v])=>(
              <div key={l} style={{background:"#F7F7F5",borderRadius:5,padding:"8px 10px"}}>
                <div style={{fontSize:8,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:"#888",marginBottom:2}}>{l}</div>
                <div style={{fontSize:11,fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#FFFBF0",border:"1px solid #F0E0A0",borderRadius:5,padding:"10px 12px",marginBottom:12,fontSize:11,color:"#555",lineHeight:1.6}}>
            <strong>Nota:</strong> Cotización específica para la institución identificada, intransferible. Vigencia 15 días. Colores a coordinar.
            {cot.notas&&<> <strong>Observaciones:</strong> {cot.notas}</>}
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}>
            <thead><tr style={{background:"#111"}}>
              {["Producto","Val. Unit. Neto","Cant.","Total Neto","Total c/IVA"].map((h,i)=><th key={i} style={{padding:"8px 10px",fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:"#fff",textAlign:i>0?"right":"left"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {cot.items.map((it,i)=>(
                <tr key={i} style={{background:i%2===0?"#fff":"#FAFAF8"}}>
                  <td style={{padding:"8px 10px",fontSize:11,fontWeight:700,borderBottom:"1px solid #E8E8E8"}}>{it.n}</td>
                  <td style={{padding:"8px 10px",fontSize:11,textAlign:"right",borderBottom:"1px solid #E8E8E8"}}>{ff(it.pu)}</td>
                  <td style={{padding:"8px 10px",fontSize:11,textAlign:"center",color:"#555",borderBottom:"1px solid #E8E8E8"}}>{it.qty}</td>
                  <td style={{padding:"8px 10px",fontSize:11,textAlign:"right",borderBottom:"1px solid #E8E8E8"}}>{ff(it.pu*it.qty)}</td>
                  <td style={{padding:"8px 10px",fontSize:11,textAlign:"right",fontWeight:800,color:"#5BAF3A",borderBottom:"1px solid #E8E8E8"}}>{ff(Math.round(it.pu*it.qty*(1+IVA)))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <div style={{width:240}}>
              {[["NETO",tvN,false],["IVA (19%)",iva,true],["TOTAL",tvT,false]].map(([l,v,dim])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #E8E8E8",fontSize:l==="TOTAL"?13:11,fontWeight:l==="TOTAL"?900:400,color:l==="TOTAL"?"#5BAF3A":dim?"#888":"#111"}}>
                  <span>{l}</span><span>{ff(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#F0FAF0",border:"1.5px solid #5BAF3A",borderRadius:5,padding:"10px 12px",display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:18}}>♻</span>
            <div><div style={{fontSize:11,fontWeight:800,color:"#5BAF3A"}}>Impacto ambiental</div><div style={{fontSize:10,color:"#555"}}>{kgTot.toFixed(2)} kg reciclados · ~{yogures.toLocaleString()} envases yogur</div></div>
          </div>
          <div style={{borderTop:"2px solid #111",paddingTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:10}}>
            <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#888",marginBottom:3}}>DATOS EMPRESA</div>
              <div style={{fontWeight:700}}>Ventas Jenny Catalina Sáez Hernández E.I.R.L</div>
              <div style={{color:"#333"}}>Coronel 2355, of. 11, Providencia, Santiago</div>
              <div style={{color:"#333"}}>+56 9 3207 6408</div>
              <div style={{color:"#5BAF3A",fontWeight:700}}>info@tiendarevivir.cl</div>
            </div>
            <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#888",marginBottom:3}}>DATOS DE PAGO</div>
              <div style={{fontWeight:700}}>Ventas Jenny Catalina Sáez Hernández E.I.R.L</div>
              <div style={{color:"#333"}}>Banco: Mercado Pago</div>
              <div style={{color:"#333"}}>Cuenta Vista: <strong>1012406684</strong></div>
              <div style={{color:"#5BAF3A",fontWeight:700}}>info@tiendarevivir.cl</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ─── */
function ModalCot({onClose,onSave,leads,clis,uid}) {
  const [empresa,setEmpresa]=useState("");
  const [contacto,setContacto]=useState(""); const [rut,setRut]=useState("");
  const [dir,setDir]=useState(""); const [ciudad,setCiudad]=useState("");
  const [tel,setTel]=useState(""); const [cargo,setCargo]=useState(""); const [notas,setNotas]=useState("");
  const [items,setItems]=useState([]);
  const [tab,setTab]=useState("cat");
  const [sel,setSel]=useState(CAT[0].id); const [qty,setQty]=useState(50);
  const [cn,setCN]=useState(""); const [cq,setCQ]=useState(50);
  const [cpu,setCPU]=useState(""); const [ccu,setCCU]=useState(""); const [ckg,setCKG]=useState("");
  const [cnc,setCNC]=useState(false);
  const [piezas,setPiezas]=useState([{w:100,h:80}]);
  const PW=950,PH=1200;

  const autoFill=em=>{
    setEmpresa(em);
    const c=clis.find(x=>x.n===em)||leads.find(x=>x.empresa===em);
    if(c){setContacto(c.ct||c.contacto||"");setRut(c.rut||"");setDir(c.dir||"");setCiudad(c.ciudad||"");setTel(c.tel||"");setCargo(c.cargo||"");}
  };
  const empresas=[...new Set([...leads.map(l=>l.empresa),...clis.map(c=>c.n)])];
  const addCat=()=>{
    const p=CAT.find(x=>x.id===parseInt(sel));if(!p)return;
    const q=parseInt(qty)||1; const pu=pxQ(p,q);
    setItems(prev=>[...prev,{n:p.n,qty:q,pu,cu:p.vc,kg:p.kg,uid:Date.now()}]);setQty(50);
  };
  const addCustom=()=>{
    if(!cn||!cpu)return;
    setItems(prev=>[...prev,{n:cn,qty:parseInt(cq)||1,pu:parseInt(cpu)||0,cu:parseInt(ccu)||0,kg:parseFloat(ckg)||0,uid:Date.now(),custom:true}]);
    setCN("");setCPU("");setCCU("");setCKG("");
  };
  const cncRes=piezas.map(pz=>{const pF=Math.floor(PW/pz.w);const fi=Math.floor(PH/pz.h);const pp=pF*fi;const q=parseInt(cq)||1;const pl=Math.ceil(q/pp);return{...pz,pp,pl,cost:pl*205000};});
  const tvN=items.reduce((a,i)=>a+i.pu*i.qty,0);
  const tcN=items.reduce((a,i)=>a+(i.cu||0)*i.qty,0);
  const mg=tvN>0?Math.round((tvN-tcN)/tvN*100):0;
  const iva=Math.round(tvN*IVA); const tvT=tvN+iva;
  const tkg=items.reduce((a,i)=>a+i.kg*i.qty,0);
  const selProd=CAT.find(x=>x.id===parseInt(sel));
  const selPu=selProd?pxQ(selProd,parseInt(qty)||1):0;

  return (
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="md mdxl">
        <div style={{fontSize:17,fontWeight:900,marginBottom:18}}>Nueva Cotización</div>
        <div style={{background:"var(--s2)",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,marginBottom:10,color:"var(--text2)"}}>Datos del cliente</div>
          <div className="fr" style={{marginBottom:10}}>
            <div className="fg"><label className="fl">Empresa cliente</label>
              <input list="emp-list" className="fi" value={empresa}
                onChange={e=>autoFill(e.target.value)}
                placeholder="Escribe o selecciona empresa"/>
              <datalist id="emp-list">
                {empresas.map(em=><option key={em} value={em}/>)}
              </datalist>
            </div>
            <div className="fg"><label className="fl">Fecha</label><input className="fi" type="date" defaultValue={new Date().toISOString().split("T")[0]}/></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">Solicitante / Contacto</label><input className="fi" value={contacto} onChange={e=>setContacto(e.target.value)} placeholder="Nombre completo"/></div>
            <div className="fg"><label className="fl">Cargo</label><input className="fi" value={cargo} onChange={e=>setCargo(e.target.value)} placeholder="Cargo"/></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">RUT empresa</label><input className="fi" value={rut} onChange={e=>setRut(e.target.value)} placeholder="76.000.000-0"/></div>
            <div className="fg"><label className="fl">Teléfono</label><input className="fi" value={tel} onChange={e=>setTel(e.target.value)} placeholder="+56 9..."/></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">Dirección</label><input className="fi" value={dir} onChange={e=>setDir(e.target.value)} placeholder="Calle 1234"/></div>
            <div className="fg"><label className="fl">Ciudad</label><input className="fi" value={ciudad} onChange={e=>setCiudad(e.target.value)} placeholder="Santiago"/></div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          <button className={`btn ${tab==="cat"?"bg":""}`} style={{fontSize:12}} onClick={()=>setTab("cat")}>Del catálogo</button>
          <button className={`btn ${tab==="custom"?"bg":""}`} style={{fontSize:12}} onClick={()=>setTab("custom")}>Personalizado / nuevo</button>
        </div>
        {tab==="cat"&&(
          <div style={{background:"var(--s2)",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 90px auto",gap:8,alignItems:"end"}}>
              <div><label className="fl">Producto</label>
                <select className="fi" value={sel} onChange={e=>setSel(parseInt(e.target.value))}>
                  {["Regalos Corp.","Kits","HoReCa","Señalética"].map(ln=>(
                    <optgroup key={ln} label={ln}>{CAT.filter(p=>p.lnea===ln).map(p=><option key={p.id} value={p.id}>{p.n}</option>)}</optgroup>
                  ))}
                </select>
              </div>
              <div><label className="fl">Cantidad</label><input className="fi" type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)}/></div>
              <div style={{paddingTop:18}}><button className="btn bg" onClick={addCat}>+ Agregar</button></div>
            </div>
            {selProd&&<div style={{display:"flex",gap:14,marginTop:10,fontSize:11,fontFamily:"JetBrains Mono",color:"var(--muted)",flexWrap:"wrap"}}>
              <span>Precio neto: <strong style={{color:"var(--green)"}}>{ff(selPu)}</strong></span>
              <span>Costo: <strong style={{color:"var(--red)"}}>{ff(selProd.vc)}</strong></span>
              <span>Margen: <strong style={{color:Math.round((selPu-selProd.vc)/selPu*100)>=35?"var(--green)":"var(--amber)"}}>{Math.round((selPu-selProd.vc)/selPu*100)}%</strong></span>
              <span style={{color:"var(--green)"}}>♻ {selProd.kg} kg/u</span>
            </div>}
          </div>
        )}
        {tab==="custom"&&(
          <div style={{background:"var(--s2)",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:10,color:"var(--amber)"}}>⚙ Producto personalizado</div>
            <div className="fr">
              <div className="fg"><label className="fl">Nombre del producto</label><input className="fi" value={cn} onChange={e=>setCN(e.target.value)} placeholder="Ej: Señalética especial"/></div>
              <div className="fg"><label className="fl">Cantidad</label><input className="fi" type="number" value={cq} onChange={e=>setCQ(e.target.value)}/></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0"}}>
              <button className={`btn ${cnc?"bg":""}`} style={{fontSize:11}} onClick={()=>setCNC(!cnc)}>{cnc?"▼":"▶"} Calc. CNC · Plancha 1/2: 950×1200mm · $205.000</button>
            </div>
            {cnc&&(
              <div className="cnc">
                {piezas.map((pz,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end",marginBottom:8}}>
                    <div><label className="fl">Pieza {i+1} — Ancho (mm)</label><input className="fi" type="number" value={pz.w} onChange={e=>setPiezas(p=>p.map((x,j)=>j===i?{...x,w:parseInt(e.target.value)||10}:x))}/></div>
                    <div><label className="fl">Alto (mm)</label><input className="fi" type="number" value={pz.h} onChange={e=>setPiezas(p=>p.map((x,j)=>j===i?{...x,h:parseInt(e.target.value)||10}:x))}/></div>
                    {piezas.length>1&&<button className="xb" style={{marginTop:16}} onClick={()=>setPiezas(p=>p.filter((_,j)=>j!==i))}>×</button>}
                  </div>
                ))}
                <button className="btn" style={{fontSize:11,marginBottom:10}} onClick={()=>setPiezas(p=>[...p,{w:100,h:80}])}>+ Pieza</button>
                <div className="cncr">
                  {cncRes.map((r,i)=>(
                    <div key={i} className="cncb">
                      <div style={{fontSize:9,color:"var(--muted)",fontFamily:"JetBrains Mono",marginBottom:4}}>PIEZA {i+1} ({r.w}×{r.h}mm)</div>
                      <div style={{fontFamily:"JetBrains Mono",fontSize:16,fontWeight:700,color:"var(--green)"}}>{r.pp} por plancha</div>
                      <div style={{fontSize:10,color:"var(--muted)",fontFamily:"JetBrains Mono",marginTop:4}}>{cq} u → {r.pl} plancha{r.pl!==1?"s":""} · {ff(r.cost)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="fr3">
              <div className="fg"><label className="fl">Precio unit. neto ($)</label><input className="fi" type="number" value={cpu} onChange={e=>setCPU(e.target.value)} placeholder="0"/></div>
              <div className="fg"><label className="fl">Costo unit. neto ($)</label><input className="fi" type="number" value={ccu} onChange={e=>setCCU(e.target.value)} placeholder="0"/></div>
              <div className="fg"><label className="fl">Kg plástico / u</label><input className="fi" type="number" step="0.01" value={ckg} onChange={e=>setCKG(e.target.value)} placeholder="0.0"/></div>
            </div>
            <button className="btn bg" style={{fontSize:12}} onClick={addCustom}>+ Agregar producto personalizado</button>
          </div>
        )}
        {items.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"JetBrains Mono",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>Productos en la cotización</div>
            {items.map(i=>(
              <div key={i.uid} className="ci">
                <div><div style={{fontSize:13,fontWeight:700}}>{i.n}{i.custom&&<span style={{fontSize:9,color:"var(--amber)",marginLeft:5,fontFamily:"JetBrains Mono"}}>CUSTOM</span>}</div>
                  <div style={{fontSize:10,color:"var(--muted)",fontFamily:"JetBrains Mono"}}>{ff(i.pu)} neto · margen {i.pu>0?Math.round((i.pu-i.cu)/i.pu*100):0}%</div></div>
                <div style={{textAlign:"center",fontFamily:"JetBrains Mono",fontSize:13,fontWeight:600}}>×{i.qty}</div>
                <div style={{textAlign:"right",fontFamily:"JetBrains Mono",fontSize:13,fontWeight:700,color:"var(--green)"}}>{ff(i.pu*i.qty)}</div>
                <button className="xb" onClick={()=>setItems(p=>p.filter(x=>x.uid!==i.uid))}>×</button>
              </div>
            ))}
            <div className="mb">
              <div className="mr"><span style={{color:"var(--muted)",fontFamily:"JetBrains Mono"}}>Total neto</span><span style={{fontFamily:"JetBrains Mono",fontWeight:600}}>{ff(tvN)}</span></div>
              <div className="mr"><span style={{color:"var(--muted)",fontFamily:"JetBrains Mono"}}>IVA (19%)</span><span style={{fontFamily:"JetBrains Mono",fontWeight:600}}>{ff(iva)}</span></div>
              <div className="mr"><span style={{color:"var(--muted)",fontFamily:"JetBrains Mono"}}>Total con IVA</span><span style={{fontFamily:"JetBrains Mono",fontWeight:700}}>{ff(tvT)}</span></div>
              <div className="mr"><span style={{color:"var(--muted)",fontFamily:"JetBrains Mono"}}>Costos estimados</span><span style={{fontFamily:"JetBrains Mono",fontWeight:600,color:"var(--red)"}}>{ff(tcN)}</span></div>
              <div className="mr mrf"><span>Utilidad bruta</span><span>{ff(tvN-tcN)} ({mg}%)</span></div>
              <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid var(--border)"}}><span className="ip">♻ {tkg.toFixed(2)} kg plástico reciclado</span></div>
            </div>
          </div>
        )}
        <div className="fg"><label className="fl">Notas / Observaciones</label><textarea className="fi" rows={2} value={notas} onChange={e=>setNotas(e.target.value)} style={{resize:"vertical"}} placeholder="Colores, personalización, fechas..."/></div>
        <div className="brow">
          <button className="bs2" onClick={onClose}>Cancelar</button>
          <button className="bp2" onClick={()=>{
            const empFinal = empresa.trim();
            if(!empFinal){alert("Debes indicar la empresa cliente.");return;}
            if(!items.length){alert("Agrega al menos un producto.");return;}
            onSave({id:`COT-${String(Date.now()).slice(-3)}`,empresa:empFinal,contacto,cargo,rut,dir,ciudad,tel,items:items.map(i=>({n:i.n,qty:i.qty,pu:i.pu,cu:i.cu||0,kg:i.kg})),estado:"borrador",fecha:new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"short"}),notas,uid,updatedAt:ts()});
            onClose();
          }}>Guardar cotización</button>
        </div>
      </div>
    </div>
  );
}


export function PagCotizaciones({cots,setCots,leads,clis,setClis,peds,setPeds,uid}) {
  const [modal,setModal]=useState(false);
  const [pdfCot,setPdf]=useState(null);
  const [filtro,setFiltro]=useState("todos");
  const vis=filtro==="todos"?cots:cots.filter(c=>c.estado===filtro);
  const cambiar=(id,est)=>{
    setCots(p=>p.map(c=>c.id===id?{...c,estado:est,uid,updatedAt:ts()}:c));
    // Al aprobar: generar una OT por cada producto de la cotización
    if(est==="aprobada"){
      const cot=cots.find(c=>c.id===id);
      if(!cot) return;
      const cli=clis.find(c=>c.n===cot.empresa);
      const cliId=cli?.id||null;
      const fechaHoy=new Date().toISOString().split("T")[0];
      const newOTs=cot.items.map((item,i)=>{
        const otId=`OT-${id}-${i+1}`;
        const subs=Object.fromEntries(KANBAN.map(e=>[e,mkSubs(e,[])]));
        return {
          id:otId,
          cotId:id,
          cotItems:cot.items.map(x=>x.n), // todas las OT de esta cot conocen sus hermanas
          itemIdx:i,
          cliId,
          empresa:cot.empresa,
          prods:`${item.n} ×${item.qty}`,
          estado:"cotizacion",
          arch:false,
          fent:fechaHoy,
          fdel:"",
          ot:true,
          otn:otId,
          notas:`Cotización ${id}${cot.notas?" · "+cot.notas:""}`,
          subs,
          monto:Math.round(item.pu*item.qty*(1+IVA)),
          montoNeto:item.pu*item.qty,
          kg:item.kg*item.qty,
          uid,
          updatedAt:ts(),
        };
      });
      setPeds(prev=>[...newOTs,...prev]);
      // Si el cliente no existe en clis, créalo automáticamente
      if(!cli && cot.empresa){
        const newCli={id:`CLI-${Date.now()}`,n:cot.empresa,ct:cot.contacto||"",cargo:cot.cargo||"",email:"",tel:cot.tel||"",rut:cot.rut||"",dir:cot.dir||"",ciudad:cot.ciudad||"",linea:"Regalos Corp.",est:"activo",notas:"",uid,updatedAt:ts()};
        setClis(prev=>[newCli,...prev]);
      }
    }
  };
  const BM={borrador:"m",enviada:"a",aprobada:"g",rechazada:"r",cerrada:"t"};
  return (
    <>
      {modal&&<ModalCot leads={leads} clis={clis} uid={uid} onClose={()=>setModal(false)} onSave={c=>setCots(p=>[c,...p])}/>}
      {pdfCot&&<PDFModal cot={pdfCot} onClose={()=>setPdf(null)}/>}
      <div className="ph"><div><div className="pt">Cotizaciones</div><div className="ps">{cots.length} cotizacion{cots.length!==1?"es":""} · IVA Chile 19%</div></div>
        <button className="btn bg" onClick={()=>setModal(true)}>+ Nueva cotización</button>
      </div>
      <div className="sr">
        {["borrador","enviada","aprobada","cerrada"].map(es=>{
          const c=cots.filter(x=>x.estado===es);
          const m=c.reduce((a,x)=>a+x.items.reduce((b,i)=>b+i.pu*i.qty,0),0);
          return <div key={es} className="st"><div className="sl">{es.charAt(0).toUpperCase()+es.slice(1)}</div><div className="sv" style={{fontSize:22}}>{c.length}</div>{m>0&&<div className="ss">{f$(m)} neto</div>}</div>;
        })}
      </div>
      {cots.length===0?(
        <div className="card" style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>
          <div style={{fontSize:28,marginBottom:8}}>📋</div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sin cotizaciones</div>
          <div style={{fontSize:12}}>Crea tu primera cotización para empezar.</div>
        </div>
      ):(
        <div className="card">
          <div className="ch"><div className="ct">Todas las cotizaciones</div>
            <div className="fts">{["todos","borrador","enviada","aprobada","rechazada","cerrada"].map(x=><button key={x} className={`fb ${filtro===x?"on":""}`} onClick={()=>setFiltro(x)}>{x==="todos"?"Todas":x.charAt(0).toUpperCase()+x.slice(1)}</button>)}</div>
          </div>
          {vis.map((c,i)=>{
            const tvN=c.items.reduce((a,i)=>a+i.pu*i.qty,0);
            const tvT=Math.round(tvN*(1+IVA));
            const mg=tvN>0?Math.round((tvN-c.items.reduce((a,i)=>a+(i.cu||0)*i.qty,0))/tvN*100):0;
            return (
              <div key={i} style={{background:"var(--s2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--muted)"}}>{c.id}</span>
                      <span className={`bdg ${BM[c.estado]||"m"}`}>{c.estado.charAt(0).toUpperCase()+c.estado.slice(1)}</span>
                      <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--muted)"}}>{c.fecha}</span>
                      <UAv uid={c.uid}/>
                    </div>
                    <div style={{fontSize:15,fontWeight:800}}>{c.empresa}</div>
                    {c.notas&&<div style={{fontSize:10,color:"var(--muted)",fontFamily:"JetBrains Mono",marginTop:2}}>{c.notas}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"JetBrains Mono",fontSize:17,fontWeight:700,color:"var(--green)"}}>{ff(tvN)} <span style={{fontSize:10,color:"var(--muted)"}}>neto</span></div>
                    <div style={{fontFamily:"JetBrains Mono",fontSize:12,color:"var(--text2)"}}>{ff(tvT)} con IVA</div>
                    <div style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--muted)"}}>Margen {mg}%</div>
                  </div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                  {c.items.map((it,j)=><span key={j} style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:5,padding:"3px 9px",fontSize:10,fontFamily:"JetBrains Mono"}}>{it.n} ×{it.qty} · {ff(it.pu)}</span>)}
                </div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <button className="btn bb" style={{fontSize:11}} onClick={()=>setPdf(c)}>📄 Ver / Imprimir PDF</button>
                  {c.estado==="borrador"&&<button className="btn" style={{fontSize:11}} onClick={()=>cambiar(c.id,"enviada")}>Marcar enviada</button>}
                  {c.estado==="enviada"&&<><button className="btn" style={{fontSize:11,color:"var(--green)",borderColor:"rgba(91,175,58,.3)"}} onClick={()=>{cambiar(c.id,"aprobada");setTimeout(()=>alert(`¡Cotización aprobada!\n\nSe generaron ${c.items.length} Ficha${c.items.length>1?"s":""} OT en producción:\n${c.items.map((it,i)=>`· OT-${c.id}-${i+1}: ${it.n} ×${it.qty}`).join("\n")}`),100);}}>✓ Aprobar → Generar OTs</button><button className="btn br2" style={{fontSize:11}} onClick={()=>cambiar(c.id,"rechazada")}>✗ Rechazar</button></>}
                  {c.estado==="aprobada"&&<button className="btn" style={{fontSize:11}} onClick={()=>cambiar(c.id,"cerrada")}>Cerrar</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

