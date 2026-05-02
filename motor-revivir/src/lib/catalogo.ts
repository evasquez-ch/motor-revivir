import type { ProductoCatalogo } from '@/types'

export const IVA = 0.19

export const CAT: ProductoCatalogo[] = [
  // REGALOS CORPORATIVOS
  {id:1,  n:"Galvano Personalizado + placa",           lnea:"Regalos Corp.", dim:"Variable",     vc:13187, r:{r0:27990,r1:25361,r2:23977,r3:21979}, kg:0.80,  pp:58},
  {id:2,  n:"Galvano Básico Redondo + placa",          lnea:"Regalos Corp.", dim:"Variable",     vc:12874, r:{r0:24057,r1:22641,r2:21225,r3:19809}, kg:0.75,  pp:48},
  {id:3,  n:"Galvano Básico sin placa",                lnea:"Regalos Corp.", dim:"Variable",     vc:9092,  r:{r0:16990,r1:15990,r2:14990,r3:13990}, kg:0.65,  pp:48},
  {id:4,  n:"Medalla",                                 lnea:"Regalos Corp.", dim:"55x60 mm",     vc:1892,  r:{r0:3441, r1:3154, r2:2911, r3:2704},  kg:0.055, pp:408},
  {id:5,  n:"Placa de Reconocimiento",                 lnea:"Regalos Corp.", dim:"200x120 mm",   vc:5471,  r:{r0:9946, r1:9118, r2:8416, r3:7815},  kg:0.22,  pp:70},
  {id:6,  n:"Llavero Alza Smartphone",                 lnea:"Regalos Corp.", dim:"50x60 mm",     vc:1599,  r:{r0:3401, r1:2756, r2:2578, r3:2422},  kg:0.055, pp:498},
  {id:7,  n:"Llavero Circular",                        lnea:"Regalos Corp.", dim:"50x50 mm",     vc:1494,  r:{r0:2716, r1:2490, r2:2298, r3:2134},  kg:0.04,  pp:504},
  {id:8,  n:"Llavero Rectangular",                     lnea:"Regalos Corp.", dim:"60x35 mm",     vc:1348,  r:{r0:2451, r1:2247, r2:2074, r3:1926},  kg:0.035, pp:310},
  {id:9,  n:"Organizador Escritorio",                  lnea:"Regalos Corp.", dim:"280x50 mm",    vc:4998,  r:{r0:9088, r1:8330, r2:7690, r3:7140},  kg:0.45,  pp:114},
  {id:10, n:"Separador Libro",                         lnea:"Regalos Corp.", dim:"103x51 mm",    vc:1812,  r:{r0:3295, r1:3021, r2:2788, r3:2589},  kg:0.03,  pp:346},
  {id:11, n:"Eleva Laptop (2 piezas)",                 lnea:"Regalos Corp.", dim:"298x94 mm",    vc:6247,  r:{r0:10412,r1:9611, r2:9465, r3:8925},  kg:0.38,  pp:72},
  {id:12, n:"Posa Smartphone (2 piezas)",              lnea:"Regalos Corp.", dim:"65x70/125mm",  vc:4028,  r:{r0:6945, r1:6604, r2:6197, r3:5755},  kg:0.18,  pp:120},
  {id:13, n:"Posavasos",                               lnea:"Regalos Corp.", dim:"90x90 mm",     vc:1955,  r:{r0:3259, r1:3008, r2:2870, r3:2754},  kg:0.10,  pp:198},
  {id:14, n:"Joyero mediano",                          lnea:"Regalos Corp.", dim:"136x80 mm",    vc:2981,  r:{r0:4969, r1:4732, r2:4517, r3:4029},  kg:0.15,  pp:160},
  {id:15, n:"Joyero pequeño",                          lnea:"Regalos Corp.", dim:"115x65 mm",    vc:2326,  r:{r0:3877, r1:3692, r2:3525, r3:3144},  kg:0.10,  pp:210},
  // KITS
  {id:16, n:"Kit 1: Eleva+Llavero+Posavasos+Bolsa",   lnea:"Kits", dim:"Combo", vc:11084, r:{r0:19111,r1:18171,r2:17319,r3:16544}, kg:0.535, pp:null},
  {id:17, n:"Kit 2: Org+Llavero+Posavasos+Bolsa",     lnea:"Kits", dim:"Combo", vc:9835,  r:{r0:16957,r1:16123,r2:15368,r3:14679}, kg:0.48,  pp:null},
  {id:18, n:"Kit 3: Org+Eleva+Llavero+Bolsa",         lnea:"Kits", dim:"Combo", vc:14127, r:{r0:24357,r1:23159,r2:22074,r3:21085}, kg:0.87,  pp:null},
  {id:19, n:"Kit Full: Org+Eleva+Llavero+Sep+Bolsa",  lnea:"Kits", dim:"Combo", vc:15940, r:{r0:27482,r1:26130,r2:24906,r3:23790}, kg:0.90,  pp:null},
  // HORECA
  {id:20, n:"Copero / Viñera 2 Copas",                lnea:"HoReCa", dim:"95x284 mm",  vc:4906,  r:{r0:8177, r1:7548, r2:7215, r3:6910},  kg:0.55,  pp:66},
  {id:21, n:"Destapador Mediano",                      lnea:"HoReCa", dim:"54x100 mm",  vc:2188,  r:{r0:3978, r1:3646, r2:3366, r3:3125},  kg:0.08,  pp:288},
  {id:22, n:"Destapador Pequeño Redondo",              lnea:"HoReCa", dim:"54x54 mm",   vc:1683,  r:{r0:3060, r1:2805, r2:2589, r3:2404},  kg:0.05,  pp:504},
  {id:23, n:"Posavasos HoReCa",                        lnea:"HoReCa", dim:"90x90 mm",   vc:1955,  r:{r0:3259, r1:3008, r2:2876, r3:2754},  kg:0.10,  pp:198},
  {id:24, n:"Tabla Cóctel",                            lnea:"HoReCa", dim:"200x300 mm", vc:10233, r:{r0:17056,r1:16243,r2:15505,r3:14619}, kg:0.90,  pp:30},
  {id:25, n:"Tabla Café + Pastel",                     lnea:"HoReCa", dim:"136x80 mm",  vc:3750,  r:{r0:6250, r1:5769, r2:5515, r3:5000},  kg:0.18,  pp:100},
  {id:26, n:"Posa Velas",                              lnea:"HoReCa", dim:"110x60 mm",  vc:2417,  r:{r0:4028, r1:3836, r2:3662, r3:3266},  kg:0.10,  pp:248},
  // SEÑALÉTICA
  {id:27, n:"Señalética Baño",                         lnea:"Señalética", dim:"175x175 mm", vc:4517, r:{r0:9033,r1:9033,r2:9033,r3:9033}, kg:0.22, pp:36},
  {id:28, n:"Señalética Discapacitado",                lnea:"Señalética", dim:"175x175 mm", vc:4517, r:{r0:9033,r1:9033,r2:9033,r3:9033}, kg:0.22, pp:36},
  {id:29, n:"Señalética Reservado",                    lnea:"Señalética", dim:"150x45 mm",  vc:3929, r:{r0:6549,r1:6549,r2:6549,r3:6549}, kg:0.08, pp:228},
  {id:30, n:"Colgante Puerta Hotel",                   lnea:"Señalética", dim:"85x220 mm",  vc:5417, r:{r0:8333,r1:8333,r2:8333,r3:8333}, kg:0.25, pp:88},
]

export const pxQ = (prod: ProductoCatalogo, qty: number): number => {
  if (qty < 30)   return prod.r.r0
  if (qty < 100)  return prod.r.r1
  if (qty < 1000) return prod.r.r2
  return prod.r.r3
}

export const SUBS_TEMPLATE: Record<string, string[]> = {
  cotizacion: [
    "Diseño del producto definido",
    "Cotización enviada al cliente",
    "Cotización aceptada",
    "OT generada",
    "Pago / anticipo recibido",
    "Materiales verificados en stock",
    "Compra de materiales realizada",
    "Materiales retirados y disponibles",
  ],
  produccion: [
    "Material enviado a taller CNC",
    "Corte CNC completado",
    "Material cortado retirado",
    "Control de calidad OK",
  ],
  terminacion: [
    "Pulido realizado",
    "DTF UV aplicado",
    "Placas instaladas",
    "Ensamble final completado",
    "Revisión final OK",
  ],
  listo: [
    "Empaque realizado",
    "Etiquetas puestas",
    "Entrega coordinada con cliente",
  ],
  entregado: [
    "Producto entregado",
    "Factura emitida",
    "Pago final confirmado",
    "Seguimiento postventa",
  ],
}

export const KANBAN_ESTADOS = ['cotizacion','produccion','terminacion','listo','entregado'] as const

export const PECFG: Record<string, { label: string; color: string }> = {
  cotizacion:  { label: 'Cotización',  color: '#D97706' },
  produccion:  { label: 'Producción',  color: '#2B6CB0' },
  terminacion: { label: 'Terminación', color: '#8B5CF6' },
  listo:       { label: 'Listo',       color: '#0D9488' },
  entregado:   { label: 'Entregado',   color: '#5BAF3A' },
}

export const PIPES = ['lead','contactado','cotizacion','negociacion','cerrado'] as const
export const PLBL: Record<string, string> = {
  lead: 'Lead', contactado: 'Contactado', cotizacion: 'Cotiz. enviada',
  negociacion: 'Negociación', cerrado: 'Cerrado',
}

export const EMPRESA_INFO = {
  nombre:     'Ventas Jenny Catalina Sáez Hernández E.I.R.L',
  direccion:  'Coronel 2355, oficina 11, Providencia, Santiago',
  telefono:   '+56 9 3207 6408',
  email:      'info@tiendarevivir.cl',
  web:        'tiendarevivir.cl',
  banco:      'Mercado Pago',
  cuenta:     '1012406684',
  tipo_cuenta:'Cuenta Vista',
}
