// Estilos globales de la app — usado por MotorApp.tsx
export const GLOBAL_STYLES = `
  /* Los estilos completos están en globals.css y son extendidos aquí para componentes inline */
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
  .g{background:var(--gl);color:var(--green);}.p{background:var(--pl);color:var(--purple);}.r{background:var(--rl);color:var(--red);}.a{background:var(--al);color:var(--amber);}.b{background:var(--bl);color:var(--blue);}.t{background:var(--tl);color:var(--teal);}.m{background:var(--s2);color:var(--muted);}
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
  .pipe{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;overflow-x:auto;}
  .pc{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:12px;min-height:80px;transition:background .15s;}
  .pc.dov{background:rgba(91,175,58,.08);border-color:var(--green);}
  .pch{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-bottom:10px;display:flex;justify-content:space-between;}
  .pk{background:var(--s1);border:1px solid var(--border);border-radius:8px;padding:11px;margin-bottom:8px;cursor:grab;transition:all .15s;}
  .pk:active{cursor:grabbing;}.pk:hover{border-color:var(--text2);}.pk.dragging{opacity:.35;}
  .cav{width:40px;height:40px;border-radius:10px;background:var(--gl);border:1px solid var(--gs);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:var(--green);flex-shrink:0;}
  .cnc{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:14px;margin:10px 0;}
  .cncr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;}
  .cncb{background:var(--s1);border:1px solid var(--border);border-radius:7px;padding:10px;}
  .xb{background:none;border:none;color:var(--muted);font-size:16px;transition:color .15s;cursor:pointer;}
  .xb:hover{color:var(--red);}
  .ci{display:grid;grid-template-columns:1fr 80px 110px 26px;gap:8px;align-items:center;background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:7px;}
  .mb{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:13px;margin-top:10px;}
  .mr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;}
  .mrf{font-size:14px;font-weight:800;color:var(--green);border-top:1px solid var(--border);padding-top:8px;margin-top:8px;}
  .arc{display:flex;align-items:center;gap:12px;padding:9px 13px;background:var(--s2);border:1px solid var(--border);border-radius:8px;margin-bottom:6px;}
  .lgp{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden;}
  .lgp::before{content:'';position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(91,175,58,.07) 0%,transparent 65%);top:-200px;right:-150px;pointer-events:none;}
  .lgp::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(43,108,176,.05) 0%,transparent 65%);bottom:-100px;left:-100px;pointer-events:none;}
  .lgc{background:var(--s1);border:1px solid var(--border);border-radius:24px;padding:48px 44px;width:100%;max-width:440px;position:relative;z-index:1;box-shadow:0 24px 80px rgba(0,0,0,.5);}
  .lgu{width:100%;display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:14px;border:1px solid var(--border);background:var(--s2);color:var(--text);margin-bottom:12px;transition:all .2s;text-align:left;cursor:pointer;}
  .lgu:hover{border-color:var(--green);background:rgba(91,175,58,.06);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2);}
  .lgu:last-child{margin-bottom:0;}
  .catg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .carc{background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:16px;}
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
  .tip{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;}
  @media(max-width:1200px){.sr{grid-template-columns:1fr 1fr;}.kb{grid-template-columns:repeat(3,minmax(180px,1fr));}.catg{grid-template-columns:1fr 1fr;}}
  @media(max-width:900px){.pipe{grid-template-columns:1fr 1fr;}}
  @media(max-width:768px){.app{grid-template-columns:1fr;}.sb{display:none;}.mh{display:flex;}.main{padding:18px 14px 100px;}.sr{grid-template-columns:1fr 1fr;}.kb{grid-template-columns:repeat(2,minmax(160px,1fr));}.fr{grid-template-columns:1fr;}.catg{grid-template-columns:1fr;}.fab{bottom:18px;right:14px;left:14px;justify-content:center;border-radius:12px;}}
  @media(max-width:480px){.main{padding:12px 10px 100px;}.sr{grid-template-columns:1fr;}.kb{grid-template-columns:minmax(160px,1fr);}}
`
