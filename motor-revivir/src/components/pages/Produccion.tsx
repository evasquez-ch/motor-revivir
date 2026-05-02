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
function useDnD(setEst) {
  const ref=useRef(null);
  const [dragId,setDragId]=useState(null);
  const [overCol,setOverCol]=useState(null);
  const onDragStart=(e,id)=>{ref.current=id;setDragId(id);e.dataTransfer.effectAllowed="move";};
  const onDragEnd=()=>{setDragId(null);setOverCol(null);ref.current=null;};
  const onDragOverCol=(e,est)=>{e.preventDefault();setOverCol(est);};
  const onDropCol=(e,est)=>{e.preventDefault();if(ref.current!==null)setEst(ref.current,est);setDragId(null);setOverCol(null);ref.current=null;};
  const onDragLeaveCol=()=>setOverCol(null);
  return {dragId,overCol,onDragStart,onDragEnd,onDragOverCol,onDropCol,onDragLeaveCol};
}

/* ─── PDF INLINE ─── */

/* ─── PDF OT ─── */
function generarPDFOT(ot) {
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
  <title>${ot.id} — OT Revivir</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Archivo',sans-serif;background:#fff;color:#111;padding:15mm 16mm;font-size:11pt;}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6mm;}
  .logo-img{height:28px;display:block;}
  .logo-tag{font-size:8pt;color:#888;letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
  .ot-id{font-size:18pt;font-weight:900;text-align:right;}
  .ot-sub{font-size:9pt;color:#888;text-align:right;margin-top:2px;}
  .ot-titulo{font-size:9pt;font-weight:800;color:#D97706;text-transform:uppercase;letter-spacing:1px;text-align:right;margin-top:3px;}
  .div-g{height:3px;background:#5BAF3A;border-radius:2px;margin:4mm 0 6mm;}
  .info-blk{background:#F7F7F5;border-radius:5px;padding:5mm 6mm;margin-bottom:5mm;}
  .info-ttl{font-size:8pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:4px;}
  .info-row{display:flex;gap:8px;margin-bottom:3px;font-size:10pt;}
  .info-k{color:#888;font-weight:600;min-width:110px;flex-shrink:0;font-size:9pt;}
  .info-v{font-weight:700;color:#111;}
  .subs{margin-bottom:5mm;}
  .sub-sec{margin-bottom:4mm;}
  .sub-ttl{font-size:9pt;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:2mm 3mm;border-radius:3px;margin-bottom:2mm;display:flex;align-items:center;gap:2mm;}
  .sub-item{display:flex;align-items:center;gap:3mm;padding:2mm 3mm;border-bottom:1px solid #E8E8E8;font-size:10pt;}
  .check{width:14px;height:14px;border:2px solid #ccc;border-radius:3px;flex-shrink:0;position:relative;display:inline-block;}
  .check.done{background:#5BAF3A;border-color:#5BAF3A;}
  .check.done::before{content:'';position:absolute;width:3px;height:7px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg);top:0px;left:3px;}
  .imp{background:#F0FAF0;border:1.5px solid #5BAF3A;border-radius:5px;padding:4mm 5mm;display:flex;align-items:center;gap:4mm;margin-bottom:5mm;}
  .foot{border-top:2px solid #111;padding-top:4mm;font-size:9pt;color:#333;}
  @page{size:A4;margin:0;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  </style></head><body>
  <div class="hdr"><div><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDgzNiAyODIiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAzMC4zLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMyBCdWlsZCAxODIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogIzhhZGM1YjsKICAgICAgfQoKICAgICAgLnN0MSB7CiAgICAgICAgZmlsbDogIzFkMWQxYjsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDIxLjcsMTEyLjcyYy0zLjA1LDAtNS45NS42Ni04LjYxLDEuOTYtMi42LDEuMjctNS4wMiwyLjk2LTcuMTgsNS4wMS0yLjE1LDIuMDQtNC4wMiw0LjM2LTUuNTYsNi44OS0uMzQuNTYtLjY3LDEuMTMtLjk3LDEuNjl2LTYuOTljMC01LjExLTIuODEtNy45My03LjkzLTcuOTNoLTYuMjRjLTUuMDEsMC03Ljc3LDIuODItNy43Nyw3LjkzdjY4LjE5YzAsNS4xMSwyLjc2LDcuOTMsNy43Nyw3LjkzaDcuMDRjNS4wMSwwLDcuNzctMi44Miw3Ljc3LTcuOTN2LTI2LjI1YzAtMy42Mi40NC03LjE4LDEuMzItMTAuNTkuODctMy4zOCwyLjE5LTYuNDMsMy45Mi05LjA5LDEuNzEtMi42MSwzLjktNC43NSw2LjUxLTYuMzYsMi41Ny0xLjU4LDUuNjQtMi4zOCw5LjEzLTIuMzgsNS4yMSwwLDguMDktMi44Miw4LjA5LTcuOTN2LTYuMjRjMC0yLjUxLS41NS00LjQ2LTEuNjMtNS44LTEuMTQtMS40MS0zLjA1LTIuMTMtNS42Ni0yLjEzWiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTUwMC4zMSwxMjIuODhjLTMuMTQtMy41My03LjExLTYuMzUtMTEuNzgtOC4zOS00LjY3LTIuMDMtMTAuMDMtMy4wNi0xNS45My0zLjA2LTYuMjEsMC0xMi4wMiwxLjA4LTE3LjI2LDMuMjEtNS4yNiwyLjEzLTkuODEsNS4xOS0xMy41NCw5LjA5LTMuNzIsMy44OS02LjY2LDguNTctOC43NCwxMy45Mi0yLjA3LDUuMzQtMy4xMiwxMS4zMS0zLjEyLDE3LjcyLDAsNS44OSwxLjA1LDExLjU2LDMuMTIsMTYuODUsMi4wNyw1LjMsNS4xLDEwLjAxLDguOTgsMTQuMDEsMy44OCwzLjk5LDguNjcsNy4yMSwxNC4yNCw5LjU1LDUuNTcsMi4zNSwxMS44NiwzLjU0LDE4LjcyLDMuNTRzMTIuMjctLjk3LDE3LjA5LTIuODljNC43NC0xLjg4LDguNTItMy43MiwxMS4yMi01LjQ1LDQuMDktMi40OCw1LjAyLTYuMTMsMi42NS0xMC42MWwtMS45Mi0zLjE5Yy0xLjI0LTIuMTEtMi43Ny0zLjM3LTQuNTQtMy43Ny0xLjctLjM4LTMuNzEtLjAzLTUuOTgsMS4wNS0uMDQuMDItLjA4LjA0LS4xMS4wNi0xLjg1LDEuMTMtNC4yOSwyLjI4LTcuMjUsMy40My0yLjg4LDEuMTEtNi4xNiwxLjY4LTkuNzMsMS42OC0yLjk1LDAtNS44MS0uNDYtOC41LTEuMzgtMi42Ny0uOTEtNS4wNy0yLjI2LTcuMTMtNC4wMi0yLjA2LTEuNzUtMy43OS0zLjk4LTUuMTYtNi42LTEuMTktMi4yOS0xLjk5LTQuOTgtMi4zNy04LjAxaDQ4LjQ1YzIuMzYsMCw0LjM0LS44Miw1LjkxLTIuNDUsMS41NS0xLjYxLDIuMzQtMy41MSwyLjM0LTUuNjQsMC01LjY1LS44My0xMS0yLjQ2LTE1LjkxLTEuNjUtNC45My00LjA3LTkuMjItNy4yMS0xMi43NVpNNDcyLjEyLDEyOS4yMWM0LjM5LDAsNy45MSwxLjQyLDEwLjc0LDQuMzYsMi41OSwyLjY5LDQuMSw2LjQ5LDQuNDcsMTEuMzNoLTMzLjQzYzEuMDMtNC41MiwzLjA0LTguMjMsNi0xMS4wNSwzLjIyLTMuMDcsNy4zMy00LjYzLDEyLjIyLTQuNjNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTg4LjMzLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjAuMzUsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIwLjM1LDExMy4zNmgtNy4wNGMtNS4wMSwwLTcuNzcsMi44Mi03Ljc3LDcuOTN2NjguMTljMCw1LjExLDIuNzYsNy45Myw3Ljc3LDcuOTNoNy4wNGM1LjAxLDAsNy43Ny0yLjgyLDcuNzctNy45M3YtNjguMTljMC01LjExLTIuNzYtNy45My03Ljc3LTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzExLjkxLDExMy4zNmgtNy41MmMtNC40NywwLTcuNDcsMi4yNC04LjY2LDYuNDJsLTE1LjIsNDQuOTZjLS40NCwxLjIxLS44NiwyLjU5LTEuMjQsNC4xMi0uMzEsMS4yNi0uNTgsMi40Mi0uNzgsMy40NC0uMjctMS4wMi0uNTQtMi4xNi0uOC0zLjQtLjMzLTEuNTMtLjcyLTIuOTItMS4xNi00LjEzbC0xNS4xOS00NC45M2MtMS4yMS00LjI0LTQuMjEtNi40Ny04LjY4LTYuNDdoLTcuNTJjLTIuODYsMC00LjkyLjg3LTYuMTEsMi42LTEuMTksMS43Mi0xLjI5LDMuOTgtLjMsNi43bDI0Ljk1LDY4LjQ0YzEuMjEsNC4xMyw0LjIxLDYuMzEsOC42OCw2LjMxaDEyLjgxYzQuMzQsMCw3LjM0LTIuMTcsOC42Ni02LjI0bDI0LjY1LTY4LjUxYy45OS0yLjczLjg2LTUtLjQtNi43Mi0xLjI1LTEuNzEtMy4zMy0yLjU3LTYuMTctMi41N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsMTEzLjM2aC03LjA0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi02OC4xOWMwLTUuMTEtMi43Ni03LjkzLTcuNzctNy45M1oiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03NDMuOTIsODEuMzRoLTcuMDRjLTUuMDEsMC03Ljc3LDIuODEtNy43Nyw3LjkzdjQuOGMwLDUuMDEsMi43Niw3Ljc3LDcuNzcsNy43N2g3LjA0YzUuMTEsMCw3LjkzLTIuNzYsNy45My03Ljc3di00LjhjMC01LjExLTIuODItNy45My03LjkzLTcuOTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNODE5LjM3LDExNC44NGMtMS4xNC0xLjQxLTMuMDUtMi4xMy01LjY2LTIuMTMtMy4wNSwwLTUuOTUuNjYtOC42MSwxLjk2LTIuNiwxLjI3LTUuMDIsMi45Ni03LjE4LDUuMDEtMi4xNSwyLjA0LTQuMDIsNC4zNi01LjU2LDYuODktLjM0LjU2LS42NywxLjEzLS45NywxLjY5di02Ljk5YzAtNS4xMS0yLjgxLTcuOTMtNy45My03LjkzaC02LjI0Yy01LjAxLDAtNy43NywyLjgyLTcuNzcsNy45M3Y2OC4xOWMwLDUuMTEsMi43Niw3LjkzLDcuNzcsNy45M2g3LjA0YzUuMDEsMCw3Ljc3LTIuODIsNy43Ny03Ljkzdi0yNi4yNWMwLTMuNjIuNDQtNy4xOCwxLjMyLTEwLjU5Ljg3LTMuMzgsMi4xOS02LjQzLDMuOTItOS4wOSwxLjcxLTIuNjEsMy45LTQuNzUsNi41MS02LjM2LDIuNTctMS41OCw1LjY0LTIuMzgsOS4xMy0yLjM4LDUuMjEsMCw4LjA5LTIuODIsOC4wOS03Ljkzdi02LjI0YzAtMi41MS0uNTUtNC40Ni0xLjYzLTUuOFoiLz4KICA8L2c+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTMxOS40NCw4NS4wMWMtMS41Mi0xNi4zNS03LjI0LTMxLjM3LTIwLjA2LTQyLjA3LTE3LjY2LTE0LjczLTUzLjQtMTkuMDEtNzQuMTYsNi4yNy05LjM0LDExLjM3LTE2LjE5LDI0LjEzLTIyLjE5LDM3LjQ0LTguNjUsMTkuMTUtMTUuMiwzOS4wMS0yMC4xOSw2MC42Ny0uNzktMS43OC0xLjEzLTIuNDQtMS4zOS0zLjE0LTEwLjk4LTI4Ljg0LTIzLjI5LTU3LjA1LTQwLjU0LTgyLjgtMTEuOTEtMTcuNzgtMjUuMTQtMzQuNDgtNDQuMDktNDUuMzMtMTUuMDYtOC42Mi0zMC44OC0xMS4wNS00Ny4wMS0yLjU4LTE0LjU2LDcuNjUtMjMuNjIsMTkuOTYtMjkuMDYsMzUuMi02LjIsMTcuMzgtNi4xOSwzNS4zOS00LjY3LDUzLjM3LDIuNTEsMjkuODEsMTEuMTUsNTguMDYsMjMuNjcsODUuMSwxMi45NiwyNy45OSwyOS40OSw1My4zNiw1NC41Miw3Mi4zNSwyNi4yOCwxOS45Myw1NC4yLDE2Ljg5LDc0LjMtOS4zMyw4LjE2LTEwLjY0LDE0LjMxLTIyLjgyLDIxLjQ2LTM0LjQ1LDEuMSwxLjM2LDIuNjYsMy4zNSw0LjI5LDUuMjksNS41Miw2LjU2LDEyLjUxLDExLDIxLjAzLDExLjY3LDE2LjMyLDEuMjksMzEuMTctMi45NCw0NC4xLTEzLjM5LDE2LjAyLTEyLjk1LDI3Ljg4LTI5LjI4LDM3LjcyLTQ3LjA4LDE0Ljk2LTI3LjA3LDI1LjIxLTU1LjU2LDIyLjI3LTg3LjE5Wk0xNTkuMzQsMjIyLjE0Yy0xLjM3LDIuNS0yLjk2LDQuOTUtNC44MSw3LjM0LTEuNCwxLjgyLTIuOSwzLjQ0LTQuNDUsNC45Mi0yLjgzLDIuODQtNS44Niw1LjExLTkuMDksNi40NS0uMDEsMC0uMDIsMC0uMDQuMDEtLjg2LjQzLTEuNzMuODMtMi42MSwxLjE4LS4xMS4wNi0uMjEuMTItLjMyLjE3bC0uMDItLjA0Yy0xMS40Miw0LjM4LTI0LjMsMi4wNC0zNS4zNi03LjM3LTEyLjQ0LTEwLjU5LTIxLjItMjQuMTYtMjkuNC0zOC4wNy0xNC41My0yNC42Ni0yMy4xNS01MS4zNC0yNi42OC03OS42OS0uNC0zLjE4LS43Ni02LjM2LTEuMTMtOS43MS0xLjIxLTEwLjg4LS43MS0yMS45MiwxLjg4LTMyLjU1LjQtMS42NC44NS0zLjI3LDEuMzYtNC44OSw1LjAyLTE1Ljc2LDE3LjM2LTIxLjc5LDMzLjE0LTE2Ljc2LDEzLjMxLDQuMjMsMjMuNjUsMTMuMDIsMzIuODMsMjMuMTEsMTQuMTUsMTUuNTcsMjUuMjUsMzIuNywzMy43MSw1MS4xMWwuMDItLjAzczYuNDcsMTMuMjcsMTAuNywyNC4wNmM1LjI0LDEzLjM2LDguOTUsMjMuNTYsMTQuNjYsMzcuNTNoMHMtNS4yNywxOC4xMS0xNC4zOSwzMy4yMlpNMjkwLjMsMTIxLjU2Yy01Ljc2LDI4LjMtMTcuNDEsNTQuODYtNDIuNDIsNzUuMTQtMi4xMiwxLjcyLTQuMzEsMy4yNS02LjU3LDQuNTctLjgzLjUzLTIuOTksMS43OS02LjE2LDIuOTMtNC44MywxLjgtMTAuMDQsMi42LTE1LjcxLDIuMDQtLjA0LDAtLjA3LS4wMS0uMTEtLjAxLS4wMywwLS4wNSwwLS4wOCwwLS4wOCwwLS4xNS0uMDMtLjIyLS4wMy0uNzgtLjA5LTEuNTMtLjIxLTIuMjYtLjM1LS4yNi0uMDUtLjUyLS4xLS43Ny0uMTYtLjc4LS4xOC0xLjUyLS4zOS0yLjI0LS42NC0uMTEtLjA0LS4yMS0uMDgtLjMyLS4xMi0uNjctLjI0LTEuMzEtLjUyLTEuOTMtLjgyLS4xMS0uMDUtLjIyLS4xLS4zMi0uMTYtLjA3LS4wNC0uMTMtLjA4LS4yMS0uMTItLjQ5LS4yNS0uOTctLjUyLTEuNDQtLjgzLS4wMi0uMDEtLjA0LS4wMi0uMDYtLjAzLS4wMy0uMDItLjA2LS4wNS0uMS0uMDctLjMyLS4yMS0uNjMtLjQzLS45NC0uNjYtLjMtLjIyLS41OS0uNDUtLjg3LS42OC0uMDUtLjA0LS4xLS4wOC0uMTQtLjEyLS4zNi0uMzEtLjcxLS42Mi0xLjA0LS45My00Ljk2LTQuNjktOC41NS0xMS4zOS04LjU1LTExLjM5bDguNTktMzcuMjhoMGMuMzUtMS40NS43LTIuOTEsMS4wOC00LjM2LDIuMTQtOC43NiwzLjc0LTEzLjQ4LDMuNzQtMTMuNDgsMCwwLDEuODYtNi4yMywyLjgtOS4zNCw1LjA3LTE2Ljc1LDExLjI3LTMzLjEyLDIyLjc0LTQ2LjcyLDQuMDQtNC43OSw4Ljc0LTkuMzIsMTMuOTUtMTIuNzUsMTcuOTQtMTEuODMsMzcuNzUtMi43LDQwLjkzLDE4LjYuMDguNTQuMTYsMS4wOC4yMywxLjYyLDEuNTYsMTIuMDUuODQsMjQuMjctMS41OCwzNi4xOFoiLz4KPC9zdmc+" class="logo-img" alt="revivir"/><div class="logo-tag">Diseño con plástico reciclado</div></div>
  <div><div class="ot-id">${ot.id}</div><div class="ot-sub">${new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"})}</div><div class="ot-titulo">Orden de Trabajo</div></div></div>
  <div class="div-g"></div>
  <div class="info-blk"><div class="info-ttl">Datos del pedido</div>
  <div class="info-row"><span class="info-k">OT:</span><span class="info-v">${ot.id}</span></div>
  ${ot.cotizacion_id||ot.cotId?`<div class="info-row"><span class="info-k">Cotización:</span><span class="info-v">${ot.cotizacion_id||ot.cotId}</span></div>`:""}
  <div class="info-row"><span class="info-k">Empresa:</span><span class="info-v">${ot.empresa}</span></div>
  <div class="info-row"><span class="info-k">Descripción:</span><span class="info-v">${ot.descripcion||ot.prods}</span></div>
  ${ot.fecha_entrada||ot.fent?`<div class="info-row"><span class="info-k">Entrada:</span><span class="info-v">${ot.fecha_entrada||ot.fent}</span></div>`:""}
  ${ot.fecha_entrega||ot.fdel?`<div class="info-row"><span class="info-k">Entrega:</span><span class="info-v">${ot.fecha_entrega||ot.fdel}</span></div>`:""}
  <div class="info-row"><span class="info-k">Monto neto:</span><span class="info-v">$${(ot.monto_neto||ot.monto||0).toLocaleString("es-CL")}</span></div>
  <div class="info-row"><span class="info-k">Total c/IVA:</span><span class="info-v" style="color:#5BAF3A;font-size:12pt">$${(ot.monto_con_iva||Math.round((ot.monto_neto||ot.monto||0)*1.19)).toLocaleString("es-CL")}</span></div>
  </div>
  ${ot.notas?`<div style="background:#FFFBF0;border:1px solid #F0E0A0;border-radius:5px;padding:3mm 5mm;margin-bottom:5mm;font-size:9.5pt;color:#555"><strong>Notas:</strong> ${ot.notas}</div>`:""}
  ${(()=>{const PECFG_PRINT={"cotizacion":{label:"Cotización",color:"#D97706"},"produccion":{label:"Producción",color:"#2B6CB0"},"terminacion":{label:"Terminación",color:"#8B5CF6"},"listo":{label:"Listo",color:"#0D9488"},"entregado":{label:"Entregado",color:"#5BAF3A"}};const subs=ot.subtareas||ot.subs||{};return Object.keys(PECFG_PRINT).map(est=>{const items=subs[est]||[];if(!items.length)return "";const cfg=PECFG_PRINT[est];const done=items.filter(s=>s.done||s.completado).length;return `<div class="sub-sec"><div class="sub-ttl" style="background:${cfg.color}22;color:${cfg.color}">${cfg.label} — ${done}/${items.length}</div>${items.map(s=>`<div class="sub-item"><div class="check ${(s.done||s.completado)?"done":""}"></div><span style="${(s.done||s.completado)?"text-decoration:line-through;color:#999;":""}">${s.l||s.label}</span></div>`).join("")}</div>`;}).join("");})()} 
  <div class="imp"><span style="font-size:18pt">♻</span><div><div style="font-size:10pt;font-weight:800;color:#5BAF3A">Impacto ambiental</div><div style="font-size:8.5pt;color:#555">${(ot.kg_plastico||ot.kg||0).toFixed(2)} kg de plástico reciclado</div></div></div>
  <div class="foot"><strong>revivir.</strong> · info@tiendarevivir.cl · tiendarevivir.cl · +56 9 3207 6408</div>
  </body></html>`;
  const w = window.open("","_blank");
  if(!w){alert("Permite ventanas emergentes");return;}
  w.document.write(html);w.document.close();
  setTimeout(()=>w.print(),1200);
}

function ModalFicha({ped,clis,uid,onClose,onSave,onArch,onGenOT,onReg}) {
  const [p,setP]=useState({...ped,subs:Object.fromEntries(Object.entries(ped.subs).map(([k,v])=>[k,[...v]]))});
  const set=(k,v)=>setP(prev=>({...prev,[k]:v}));
  const toggle=(est,idx)=>{
    const cur=KANBAN.indexOf(p.estado),ei=KANBAN.indexOf(est);
    if(ei>cur)return;
    setP(prev=>({...prev,subs:{...prev.subs,[est]:prev.subs[est].map((s,i)=>i===idx?{...s,done:!s.done}:s)}}));
  };
  const cli=clis.find(c=>c.id===p.cliId);
  const prg=progPed(p);
  return (
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="md mdl">
        <div className="dh">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontFamily:"JetBrains Mono",fontSize:11,color:"var(--muted)"}}>{p.id}</span>
              {p.ot&&<span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--green)",background:"var(--gl)",padding:"1px 7px",borderRadius:4,border:"1px solid var(--gs)"}}>{p.otn}</span>}
              {p.cotId&&<span style={{display:"inline-flex",alignItems:"center",gap:3,background:"var(--bl)",border:"1px solid rgba(43,108,176,.2)",borderRadius:6,padding:"2px 7px",fontSize:10,color:"var(--blue)",fontFamily:"JetBrains Mono"}}>↗ {p.cotId}</span>}
              <UAv uid={p.uid}/>
            </div>
            <div className="de">{p.empresa}</div>
            <div className="dm">{p.prods}</div>
          </div>
          <div className="das">
            <select className="es" value={p.estado} onChange={e=>set("estado",e.target.value)}>
              {KANBAN.map(es=><option key={es} value={es}>{PECFG[es].label}</option>)}
            </select>
            <button className={`btn ${p.ot?"bb":"dis"}`} style={{fontSize:11,width:"100%",justifyContent:"center"}} onClick={()=>p.ot&&alert(`OT: ${p.otn}`)}>
            {p.ot&&<button className="btn bb" style={{fontSize:11,width:"100%",justifyContent:"center",marginTop:4}} onClick={()=>generarPDFOT({...p,subtareas:p.subs||p.subtareas})}>📥 Descargar OT (PDF)</button>}
              📄 {p.ot?`Ver OT ${p.otn}`:"Sin OT generada"}
            </button>
            {p.estado==="cotizacion"&&!p.ot&&(
              <button className="btn bg" style={{fontSize:11,width:"100%",justifyContent:"center"}} onClick={()=>{const n=`OT-2026-${String(Date.now()).slice(-4)}`;onGenOT(p.id,n);set("ot",true);set("otn",n);}}>
                ⚡ Generar OT
              </button>
            )}
            {p.estado==="entregado"&&(
              <button className="btn br2" style={{fontSize:11,width:"100%",justifyContent:"center"}} onClick={()=>{onReg(p.id);onClose();}}>
                📁 Pasar a Registros
              </button>
            )}
          </div>
        </div>
        {cli&&(
          <div style={{display:"flex",alignItems:"center",gap:10,background:"var(--s2)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 13px",marginBottom:14}}>
            <div className="cav" style={{width:32,height:32,fontSize:13}}>{cli.n[0]}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800}}>{cli.n}</div><div style={{fontSize:10,color:"var(--muted)",fontFamily:"JetBrains Mono"}}>{cli.ct} · {cli.cargo}</div></div>
            <span className="bdg m">{cli.linea}</span>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:11,fontWeight:700}}>Progreso general</span>
            <span style={{fontFamily:"JetBrains Mono",fontSize:11,color:"var(--green)",fontWeight:700}}>{prg}%</span>
          </div>
          <div className="pb" style={{height:6}}><div className="pf" style={{width:`${prg}%`,background:"var(--green)"}}/></div>
        </div>
        <div className="dg">
          <div className="df"><div className="dfl">Fecha entrada</div><input type="date" value={p.fent} onChange={e=>set("fent",e.target.value)}/></div>
          <div className="df"><div className="dfl">Fecha entrega</div><input type="date" value={p.fdel} onChange={e=>set("fdel",e.target.value)} style={{color:p.fdel&&new Date(p.fdel)<new Date()?"var(--red)":"var(--text)"}}/></div>
          <div className="df"><div className="dfl">Monto neto</div><div className="dfv" style={{color:"var(--green)"}}>{f$(p.monto)}</div></div>
          <div className="df"><div className="dfl">Impacto</div><span className="ip">♻ {p.kg} kg</span></div>
        </div>
        <div className="fg"><label className="fl">Notas internas</label><textarea className="fi" rows={2} value={p.notas} onChange={e=>set("notas",e.target.value)} style={{resize:"vertical"}}/></div>
        <div style={{fontSize:13,fontWeight:800,margin:"14px 0 8px",display:"flex",alignItems:"center",gap:8}}>
          Subtareas <span style={{fontSize:10,color:"var(--muted)",fontWeight:400,fontFamily:"JetBrains Mono"}}>solo desbloqueables en estado activo o anteriores</span>
        </div>
        {!p.ot&&<div style={{background:"var(--al)",border:"1px solid rgba(217,119,6,.25)",borderRadius:8,padding:"10px 13px",marginBottom:10,fontSize:12,color:"var(--amber)"}}>⚠ Genera la OT primero para desbloquear los procesos de producción</div>}
        {/* OTs hermanas de la misma cotización */}
        {p.cotId&&p.cotItems&&p.cotItems.length>1&&(
          <div style={{background:"var(--bl)",border:"1px solid rgba(43,108,176,.2)",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--blue)",fontFamily:"JetBrains Mono",marginBottom:8}}>OTs de la misma cotización {p.cotId}</div>
            {p.cotItems.map((nombre,i)=>{
              const otId=`${p.cotId}-${i+1}`;
              const esSelf=otId===p.id;
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(43,108,176,.15)"}}>
                  <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--blue)",minWidth:80}}>{otId}</span>
                  <span style={{fontSize:12,fontWeight:esSelf?800:400,flex:1,color:esSelf?"var(--text)":"var(--text2)"}}>{nombre}{esSelf&&<span style={{fontSize:9,color:"var(--green)",marginLeft:6,fontFamily:"JetBrains Mono"}}>(esta ficha)</span>}</span>
                </div>
              );
            })}
          </div>
        )}
        {KANBAN.map(est=>{
          const cfg=PECFG[est];const subs=p.subs[est]||[];
          const done=subs.filter(s=>s.done).length;
          const cur=KANBAN.indexOf(p.estado),ei=KANBAN.indexOf(est);
          const isA=ei===cur,isP=ei<cur,isF=ei>cur,lk=!p.ot&&est!=="cotizacion";
          if(!subs.length)return null;
          return (
            <div key={est} className="eb" style={{borderLeft:`3px solid ${isA?cfg.color:isP?"var(--gs)":"var(--border)"}`,opacity:isF||lk?.45:1}}>
              <div className="ebh">
                <div className="ebn"><span style={{width:7,height:7,borderRadius:"50%",background:isA?cfg.color:isP?"var(--green)":"var(--muted)",display:"inline-block"}}/>{cfg.label}{(isF||lk)&&<span style={{fontSize:9,color:"var(--muted)",fontFamily:"JetBrains Mono",fontWeight:400}}>· bloqueado</span>}</div>
                <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:done===subs.length&&!isF?"var(--green)":"var(--muted)"}}>{done}/{subs.length}</span>
              </div>
              {subs.map((s,idx)=>(
                <div key={idx} className="si">
                  <div className={`ck ${s.done?"done":""} ${isF||lk?"lk":"ul"}`} onClick={()=>!isF&&!lk&&toggle(est,idx)}/>
                  <span className={`sil ${s.done?"dt":""}`}>{s.l}</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="brow">
          <button className="bs2" onClick={onClose}>Cerrar</button>
          <button className="bp2" onClick={()=>{onSave({...p,uid,updatedAt:ts()});onClose();}}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

function ModalPed({clis,onClose,onSave,uid}) {
  const [f,setF]=useState({cliId:clis[0]?.id||"",prods:"",fent:new Date().toISOString().split("T")[0],fdel:"",monto:"",kg:"",notas:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const cli=clis.find(c=>c.id===f.cliId);
  return (
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="md">
        <div style={{fontSize:17,fontWeight:900,marginBottom:18}}>Nuevo Pedido de Producción</div>
        <div className="fg"><label className="fl">Cliente</label><select className="fi" value={f.cliId} onChange={e=>s("cliId",e.target.value)}>{clis.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}</select></div>
        {cli&&<div style={{fontSize:11,color:"var(--muted)",marginBottom:10,fontFamily:"JetBrains Mono"}}>{cli.ct} · {cli.email}</div>}
        <div className="fg"><label className="fl">Descripción del pedido</label><textarea className="fi" rows={2} value={f.prods} onChange={e=>s("prods",e.target.value)} placeholder="Ej: Galvano ×50 + Medallón ×50"/></div>
        <div className="fr"><div className="fg"><label className="fl">Fecha entrada</label><input className="fi" type="date" value={f.fent} onChange={e=>s("fent",e.target.value)}/></div>
        <div className="fg"><label className="fl">Fecha entrega</label><input className="fi" type="date" value={f.fdel} onChange={e=>s("fdel",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">Monto neto ($)</label><input className="fi" type="number" value={f.monto} onChange={e=>s("monto",e.target.value)} placeholder="0"/></div>
        <div className="fg"><label className="fl">Kg plástico estimado</label><input className="fi" type="number" step="0.1" value={f.kg} onChange={e=>s("kg",e.target.value)} placeholder="0.0"/></div></div>
        <div className="fg"><label className="fl">Notas</label><textarea className="fi" rows={2} value={f.notas} onChange={e=>s("notas",e.target.value)} style={{resize:"vertical"}}/></div>
        <div className="brow"><button className="bs2" onClick={onClose}>Cancelar</button>
        <button className="bp2" onClick={()=>{
          if(!f.cliId||!f.prods)return;
          const subs=Object.fromEntries(KANBAN.map(e=>[e,mkSubs(e,[])]));
          onSave({id:`OT-${String(Date.now()).slice(-4)}`,cotId:null,cliId:f.cliId,empresa:clis.find(c=>c.id===f.cliId)?.n||"",prods:f.prods,estado:"cotizacion",arch:false,fent:f.fent,fdel:f.fdel,ot:false,otn:null,notas:f.notas,subs,monto:parseFloat(f.monto)||0,kg:parseFloat(f.kg)||0,uid,updatedAt:ts()});
          onClose();
        }}>Crear pedido</button></div>
      </div>
    </div>
  );
}


export function PagProduccion({peds,setPeds,clis,setRegs,uid}) {
  const [ficha,setFicha]=useState(null);
  const [nuevo,setNuevo]=useState(false);
  const [arch,setArch]=useState(false);
  const act=peds.filter(p=>!p.arch&&p.estado!=="registro");
  const arcs=peds.filter(p=>p.arch);
  const save=u=>setPeds(p=>p.map(x=>x.id===u.id?u:x));
  const archivar=id=>setPeds(p=>p.map(x=>x.id===id?{...x,arch:true}:x));
  const genOT=(id,n)=>setPeds(p=>p.map(x=>x.id===id?{...x,ot:true,otn:n,uid,updatedAt:ts()}:x));
  const addPed=p=>setPeds(prev=>[p,...prev]);
  const moverReg=id=>{
    const ped=peds.find(p=>p.id===id);if(!ped)return;
    const reg={id:`REG-${String(Date.now()).slice(-4)}`,pedId:ped.id,cotId:ped.cotId,cliId:ped.cliId,empresa:ped.empresa,prods:ped.prods,monto:ped.monto,kg:ped.kg,fecha:new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"short"}),notas:ped.notas,uid,createdAt:ts()};
    setRegs(prev=>[reg,...prev]);
    setPeds(p=>p.map(x=>x.id===id?{...x,estado:"registro"}:x));
  };
  const setEst=(id,est)=>setPeds(p=>p.map(x=>x.id===id?{...x,estado:est,uid,updatedAt:ts()}:x));
  const {dragId,overCol,onDragStart,onDragEnd,onDragOverCol,onDropCol,onDragLeaveCol}=useDnD(setEst);
  return (
    <>
      {ficha&&<ModalFicha ped={ficha} clis={clis} uid={uid} onClose={()=>setFicha(null)} onSave={save} onArch={archivar} onGenOT={genOT} onReg={moverReg}/>}
      {nuevo&&<ModalPed clis={clis} uid={uid} onClose={()=>setNuevo(false)} onSave={addPed}/>}
      <div className="ph">
        <div><div className="pt">Producción</div><div className="ps">{act.length} activo{act.length!==1?"s":""} · ♻ {act.reduce((a,p)=>a+p.kg,0).toFixed(1)} kg · arrastra para mover</div></div>
        <div style={{display:"flex",gap:8}}><button className="btn" onClick={()=>setArch(!arch)}>{arch?"Ver kanban":"📁 Archivo"}</button><button className="btn bg" onClick={()=>setNuevo(true)}>+ Nuevo pedido</button></div>
      </div>
      {arch?(
        <div className="card">
          <div className="ch"><div className="ct">Archivados ({arcs.length})</div></div>
          {arcs.length===0?<div style={{fontSize:12,color:"var(--muted)"}}>Sin pedidos archivados.</div>:arcs.map((p,i)=>(
            <div key={i} className="arc">
              <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"var(--muted)",width:60}}>{p.id}</span>
              <span style={{fontWeight:700,fontSize:13,flex:1}}>{p.empresa}</span>
              <span className="bdg g">Archivado</span>
              <button className="btn" style={{fontSize:11,padding:"4px 9px"}} onClick={()=>setFicha(p)}>Ver</button>
            </div>
          ))}
        </div>
      ):(
        act.length===0?(
          <div className="card" style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>
            <div style={{fontSize:28,marginBottom:8}}>⚙</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sin pedidos en producción</div>
            <div style={{fontSize:12}}>Agrega tu primer pedido para comenzar el seguimiento.</div>
          </div>
        ):(
          <div className="kb">
            {KANBAN.map(est=>{
              const cfg=PECFG[est];const items=act.filter(p=>p.estado===est);
              return (
                <div key={est} className={`kc ${overCol===est?"dov":""}`} style={{borderTop:`3px solid ${cfg.color}`}}
                  onDragOver={e=>onDragOverCol(e,est)} onDrop={e=>onDropCol(e,est)} onDragLeave={onDragLeaveCol}>
                  <div className="kch"><div className="kct"><span className="kcd" style={{background:cfg.color}}/>{cfg.label}</div><span className="kcn">{items.length}</span></div>
                  {items.map(p=>{
                    const prg=progPed(p);const ven=p.fdel&&new Date(p.fdel)<new Date();
                    return (
                      <div key={p.id} className={`fk ${dragId===p.id?"dragging":""}`}
                        draggable onDragStart={e=>onDragStart(e,p.id)} onDragEnd={onDragEnd} onClick={()=>setFicha(p)}>
                        <div className="fid">
                          <span style={{display:"flex",alignItems:"center",gap:4}}>
                            <span>{p.id}</span>
                            {p.cotId&&<span style={{color:"var(--blue)",fontSize:8,background:"var(--bl)",padding:"1px 4px",borderRadius:3}}>{p.cotId}</span>}
                            {p.cotItems&&p.cotItems.length>1&&<span style={{color:"var(--purple)",fontSize:8,fontFamily:"JetBrains Mono"}}>+{p.cotItems.length-1}OT</span>}
                          </span>
                          <span style={{display:"flex",alignItems:"center",gap:3}}>
                            {p.ot?<span style={{color:"var(--green)",fontSize:9}}>✓OT</span>:p.estado==="cotizacion"?<span style={{color:"var(--amber)",fontSize:9}}>SinOT</span>:null}
                            <UAv uid={p.uid}/>
                          </span>
                        </div>
                        <div className="fie">{p.empresa}</div>
                        <div className="fip">{p.prods.length>55?p.prods.slice(0,55)+"…":p.prods}</div>
                        <div className="fif">
                          <div className="fifr"><span>Entrada:</span><span>{p.fent||"—"}</span></div>
                          <div className="fifr"><span>Entrega:</span><span style={{color:ven?"var(--red)":"var(--text2)",fontWeight:ven?700:400}}>{p.fdel||"—"}{ven?" ⚠":""}</span></div>
                        </div>
                        <div className="pb"><div className="pf" style={{width:`${prg}%`,background:prg===100?"var(--green)":"var(--blue)"}}/></div>
                        <div style={{display:"flex",justifyContent:"space-between"}}><div className="pt2">{prg}%</div><div style={{fontFamily:"JetBrains Mono",fontSize:9,color:"var(--muted)"}}>{f$(p.monto)}</div></div>
                      </div>
                    );
                  })}
                  {items.length===0&&<div style={{fontSize:11,color:"var(--muted)",textAlign:"center",padding:"24px 8px",opacity:.4,border:"2px dashed var(--border)",borderRadius:7}}>Soltar aquí</div>}
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
}

