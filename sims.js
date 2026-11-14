/* Figuras interactivas de Química General. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};


/* 1 Bohr: niveles, transición y línea espectral */
SIMS.bohr=el=>build(el,{sliders:[{k:'ni',l:'nivel inicial nᵢ',v:5,min:2,max:7,step:1},{k:'nf',l:'nivel final n_f',v:2,min:1,max:6,step:1}],
  draw(a){a.clear();const s=a.st;const ni=Math.max(s.ni,s.nf+1),nf=s.nf;const cx=200,cy=a.H/2;
    for(let n=1;n<=7;n++){const r=18*n*n/7+14;a.circ(cx,cy,r,C.grid,false);a.txt('n='+n,cx+r*0.71+2,cy-r*0.71-2,C.muted,10);}
    a.circ(cx,cy,6,C.a,true);
    const ri=18*ni*ni/7+14,rf=18*nf*nf/7+14;a.circ(cx+ri,cy,5,C.b,true);a.arrow(cx+ri,cy,cx+rf+6,cy,C.d,2.5);
    // espectro: niveles de energía a la derecha
    const x0=430,yb=a.H-30,sc=(a.H-70);const E=n=>-13.6/(n*n);
    for(let n=1;n<=7;n++){const y=yb+E(n)/13.6*sc;a.line(x0,y,x0+170,y,n===ni||n===nf?C.a:C.grid,n===ni||n===nf?2.5:1);a.txt(`n=${n}  ${E(n).toFixed(2)} eV`,x0+175,y+4,C.muted,10);}
    const y1=yb+E(ni)/13.6*sc,y2=yb+E(nf)/13.6*sc;a.arrow(x0+85,y1,x0+85,y2,C.d,2.5);
    const dE=E(ni)-E(nf);const lam=1239.8/dE;const serie={1:'Lyman (UV)',2:'Balmer (visible)',3:'Paschen (IR)',4:'Brackett (IR)',5:'Pfund (IR)',6:'Humphreys'}[nf]||'';
    const nu=109677.6*(1/(nf*nf)-1/(ni*ni));
    // color aproximado
    let col=C.muted;if(lam>=380&&lam<=750){const h=Math.round(270-(lam-380)/(750-380)*270);col=`hsl(${h},80%,45%)`;}
    a.g.fillStyle=col;a.g.fillRect(x0,18,170,14);a.txt(lam<380?'ultravioleta':lam>750?'infrarrojo':'visible',x0+175,30,C.muted,11);
    a.html(`Transición n = ${ni} → ${nf}: ΔE = ${dE.toFixed(3)} eV · número de onda ν̃ = R<sub>H</sub>(1/${nf}² − 1/${ni}²) = ${nu.toFixed(0)} cm⁻¹ · <b>λ = ${lam.toFixed(1)} nm</b> · serie de ${serie}<br><span class="hint">E<sub>n</sub> = −13,6/n² eV y r<sub>n</sub> ∝ n²: las órbitas se separan con n y los niveles se aprietan. Emisión al bajar de nivel; ionizar desde n = 1 cuesta 13,6 eV = 1312 kJ/mol.</span>`);}});

/* 2 propiedades periódicas: radio y energía de ionización frente a Z */
SIMS.periodica=el=>build(el,{selects:[{k:'p',l:'propiedad',v:'ei',opts:[['ei','energía de ionización (eV)'],['r','radio atómico (pm)'],['en','electronegatividad (Pauling)']]}],sliders:[{k:'z',l:'Z seleccionado',v:11,min:1,max:36,step:1}],
  draw(a){a.clear();const s=a.st;const sym='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
    const EI=[13.6,24.6,5.39,9.32,8.30,11.26,14.53,13.62,17.42,21.56,5.14,7.65,5.99,8.15,10.49,10.36,12.97,15.76,4.34,6.11,6.56,6.83,6.75,6.77,7.43,7.90,7.88,7.64,7.73,9.39,6.00,7.90,9.79,9.75,11.81,14.00];
    const R=[53,31,167,112,87,67,56,48,42,38,190,145,118,111,98,88,79,71,243,194,184,176,171,166,161,156,152,149,145,142,136,125,114,103,94,88];
    const EN=[2.20,0,0.98,1.57,2.04,2.55,3.04,3.44,3.98,0,0.93,1.31,1.61,1.90,2.19,2.58,3.16,0,0.82,1.00,1.36,1.54,1.63,1.66,1.55,1.83,1.88,1.91,1.90,1.65,1.81,2.01,2.18,2.55,2.96,3.00];
    const D=s.p==='ei'?EI:s.p==='r'?R:EN;const mx=Math.max(...D);const ox=50,oy=a.H-40,w=a.W-80,h=a.H-80;
    a.line(ox,oy,ox+w,oy,C.muted,1.5);a.line(ox,oy,ox,oy-h,C.muted,1.5);
    [2,10,18,36].forEach(z=>{a.line(ox+(z-0.5)/36*w,oy,ox+(z-0.5)/36*w,oy-h,C.grid,1,[4,4]);});
    a.g.strokeStyle=C.a;a.g.lineWidth=2;a.g.beginPath();D.forEach((v,i)=>{const x=ox+(i+0.5)/36*w,y=oy-v/mx*h;i?a.g.lineTo(x,y):a.g.moveTo(x,y);});a.g.stroke();
    D.forEach((v,i)=>{const x=ox+(i+0.5)/36*w,y=oy-v/mx*h;a.circ(x,y,i+1===s.z?6:3,i+1===s.z?C.b:C.a,true);if([2,10,18,36,3,11,19,9,17,35].includes(i+1))a.txt(sym[i],x-6,y-8,C.muted,10);});
    const i=s.z-1;const cfg=['1s¹','1s²','[He]2s¹','[He]2s²','[He]2s²2p¹','[He]2s²2p²','[He]2s²2p³','[He]2s²2p⁴','[He]2s²2p⁵','[He]2s²2p⁶','[Ne]3s¹','[Ne]3s²','[Ne]3s²3p¹','[Ne]3s²3p²','[Ne]3s²3p³','[Ne]3s²3p⁴','[Ne]3s²3p⁵','[Ne]3s²3p⁶','[Ar]4s¹','[Ar]4s²','[Ar]3d¹4s²','[Ar]3d²4s²','[Ar]3d³4s²','[Ar]3d⁵4s¹','[Ar]3d⁵4s²','[Ar]3d⁶4s²','[Ar]3d⁷4s²','[Ar]3d⁸4s²','[Ar]3d¹⁰4s¹','[Ar]3d¹⁰4s²','[Ar]3d¹⁰4s²4p¹','[Ar]3d¹⁰4s²4p²','[Ar]3d¹⁰4s²4p³','[Ar]3d¹⁰4s²4p⁴','[Ar]3d¹⁰4s²4p⁵','[Ar]3d¹⁰4s²4p⁶'][i];
    a.html(`<b>${sym[i]}</b> (Z = ${s.z}): ${cfg} · E<sub>I</sub> = ${EI[i]} eV · radio = ${R[i]} pm · χ = ${EN[i]||'—'}<br><span class="hint">Las líneas discontinuas separan periodos: dentro de cada uno la energía de ionización sube y el radio baja (crece Z<sub>ef</sub>); al empezar un periodo nuevo el radio salta y la E<sub>I</sub> cae (nuevo n). Los gases nobles son los máximos.</span>`);}});

/* 3 enlace: curva de energía potencial (Born-Landé / Morse) */
SIMS.enlace=el=>build(el,{sliders:[{k:'n',l:'exponente de repulsión n',v:9,min:5,max:12,step:1},{k:'r',l:'distancia r (pm)',v:280,min:150,max:700,step:5}],
  draw(a){a.clear();const s=a.st;const A=1.7476,z=1,ke=1389.35; // kJ·pm/mol para e²/4πε0
    const r0=282;const B=A*ke*Math.pow(r0,s.n-1)/s.n;const V=r=>-A*ke/r+B/Math.pow(r,s.n);const Vatt=r=>-A*ke/r,Vrep=r=>B/Math.pow(r,s.n);
    const ox=60,oy=a.H/2-20,sx=(a.W-90)/700,sy=60/1000*8; // 1000 kJ ≈ 480px? use scale
    const Y=v=>oy-v*0.1;
    a.line(ox,oy,a.W-20,oy,C.muted,1.5);a.line(ox+150*sx,20,ox+150*sx,a.H-20,C.grid,1);a.txt('r (pm)',a.W-60,oy-6,C.muted,11);a.txt('V (kJ/mol)',ox+4,28,C.muted,11);
    for(const [f,col,wd] of [[Vatt,C.c,1.5],[Vrep,C.b,1.5],[V,C.a,3]]){a.g.strokeStyle=col;a.g.lineWidth=wd;a.g.beginPath();let pen=false;for(let r=150;r<=850;r+=2){const y=Y(f(r));if(y<10||y>a.H-10){pen=false;continue;}const x=ox+(r-150)*sx;pen?a.g.lineTo(x,y):a.g.moveTo(x,y);pen=true;}a.g.stroke();}
    const x=ox+(s.r-150)*sx;a.circ(x,Y(V(s.r)),6,C.d,true);a.line(x,Y(V(s.r)),x,oy,C.d,1,[3,3]);
    a.txt('atracción −A e²/4πε₀r',ox+300*sx,Y(Vatt(450))+14,C.c,11);a.txt('repulsión B/rⁿ',ox+40*sx,Y(Vrep(195))-6,C.b,11);
    const Vmin=V(r0);
    a.html(`Par Na⁺Cl⁻ en la red (Madelung A = 1,748, r₀ = 282 pm, n = ${s.n}): en r = ${s.r} pm, V = ${F(V(s.r))} kJ/mol · mínimo en r₀: <b>U = ${F(Vmin)} kJ/mol</b> (fórmula de Born-Landé \(-\\frac{N_A A z_1 z_2 e^2}{4\\pi\\varepsilon_0 r_0}(1-\\frac1n)\); experimental −788)<br><span class="hint">La longitud de enlace es la distancia del mínimo: atracción coulombiana de largo alcance + repulsión de las capas electrónicas de corto alcance. Sube n y verás que la repulsión se hace más «dura» y el pozo más profundo.</span>`);}});

/* 4 formulación inorgánica y orgánica: fichas + test de 4 opciones */
SIMS.formulacion=el=>{el.classList.add('sim-box');paleta(el);
  const Q=[['NaCl','cloruro de sodio'],['Fe₂O₃','óxido de hierro(III)'],['FeO','óxido de hierro(II)'],['Cu₂O','óxido de cobre(I)'],['CuO','óxido de cobre(II)'],['HClO','ácido hipocloroso'],['HClO₂','ácido cloroso'],['HClO₃','ácido clórico'],['HClO₄','ácido perclórico'],['H₂SO₃','ácido sulfuroso'],['H₂SO₄','ácido sulfúrico'],['KMnO₄','permanganato de potasio'],['Ca(OH)₂','hidróxido de calcio'],['NH₄NO₃','nitrato de amonio'],['Al₂(SO₄)₃','sulfato de aluminio'],['PbO₂','óxido de plomo(IV)'],['H₂S','sulfuro de hidrógeno (ácido sulfhídrico)'],['NaHCO₃','hidrogenocarbonato de sodio'],['Na₂CO₃','carbonato de sodio'],['Cl₂O₇','óxido de cloro(VII)'],['Cl₂O₅','óxido de cloro(V)'],['HBrO','ácido hipobromoso'],['K₂Cr₂O₇','dicromato de potasio'],['K₂CrO₄','cromato de potasio'],['Mg₃N₂','nitruro de magnesio'],['SnCl₄','cloruro de estaño(IV)'],['SnCl₂','cloruro de estaño(II)'],['HNO₂','ácido nitroso'],['HNO₃','ácido nítrico'],['Ba(ClO₄)₂','perclorato de bario'],['H₃PO₄','ácido fosfórico'],['HPO₃','ácido metafosfórico'],['CaH₂','hidruro de calcio'],['NH₃','amoniaco (trihidruro de nitrógeno)'],['CuSO₄','sulfato de cobre(II)'],['ZnS','sulfuro de zinc'],['Ni(OH)₃','hidróxido de níquel(III)'],['AgNO₃','nitrato de plata'],['H₂O₂','peróxido de hidrógeno'],['Na₂O₂','peróxido de sodio'],['Na₂O','óxido de sodio'],['FeS','sulfuro de hierro(II)'],['LiOH','hidróxido de litio'],['CO₂','dióxido de carbono'],['CO','monóxido de carbono'],['SO₃','trióxido de azufre'],['SO₂','dióxido de azufre'],['HI','yoduro de hidrógeno (ácido yodhídrico)'],['Ca₃(PO₄)₂','fosfato de calcio'],['KClO','hipoclorito de potasio'],['KClO₃','clorato de potasio'],['Hg₂Cl₂','cloruro de mercurio(I)'],['HgCl₂','cloruro de mercurio(II)'],['NaNO₂','nitrito de sodio'],['Na₂SO₃','sulfito de sodio'],['MnO₂','óxido de manganeso(IV)'],['Mn₂O₇','óxido de manganeso(VII)'],['Cr(OH)₃','hidróxido de cromo(III)'],['PH₃','fosfano (fosfina)'],['SiH₄','silano'],['PbS','sulfuro de plomo(II)'],['Au₂O₃','óxido de oro(III)'],['CaSO₄','sulfato de calcio'],['Ca(HCO₃)₂','hidrogenocarbonato de calcio'],['KH₂PO₄','dihidrogenofosfato de potasio'],['NH₄Cl','cloruro de amonio'],['Co₂O₃','óxido de cobalto(III)'],['N₂O₅','óxido de nitrógeno(V)'],['N₂O₃','óxido de nitrógeno(III)'],['H₂CO₃','ácido carbónico'],['HF','fluoruro de hidrógeno (ácido fluorhídrico)']];
  const ORG=[['CH₃–CH₂–CH₂–CH₃','butano'],['CH₃–CH(CH₃)–CH₃','2-metilpropano'],['CH₂=CH–CH₃','propeno'],['CH≡C–CH₃','propino'],['CH₃–CH₂OH','etanol'],['CH₃–O–CH₃','metoximetano (dimetil éter)'],['CH₃–CHO','etanal'],['CH₃–CO–CH₃','propanona'],['CH₃–COOH','ácido etanoico'],['HCOO–CH₃','metanoato de metilo'],['CH₃–CH₂–NH₂','etilamina'],['CH₃–CO–NH₂','etanamida'],['CH₃–CN','etanonitrilo'],['CH₃–NO₂','nitrometano'],['C₆H₅–CH₃','metilbenceno (tolueno)'],['C₆H₅–OH','fenol'],['CH₃–CH=CH–CH₃','2-buteno'],['CH₂=CH–CH₂–CH₃','1-buteno'],['CH₃–CHOH–CH₃','2-propanol'],['CH₃–CH₂–CH₂OH','1-propanol'],['CH₃–CH₂–CH₂–CHO','butanal'],['CH₃–CO–CH₂–CH₃','butanona'],['CH₃–CH₂–COOH','ácido propanoico'],['CH₃–COO–CH₂–CH₃','etanoato de etilo'],['CH₃–CH₂–COO–CH₃','propanoato de metilo'],['CH₃–NH–CH₃','dimetilamina'],['CH₃–CH₂–NH–CH₃','N-metiletilamina'],['HOOC–COOH','ácido etanodioico'],['CH₂=CH–CH=CH₂','1,3-butadieno'],['CH₃–CH(CH₃)–CH₂–CH₂OH','3-metil-1-butanol'],['CH₃–CO–CH₂–CH₂OH','4-hidroxi-2-butanona'],['NH₂–CH₂–COOH','ácido aminoetanoico'],['CH₃–CH(CH₃)–CHO','2-metilpropanal'],['CH₃–CH₂–CH₂–CH₂–COOH','ácido pentanoico'],['CH₃–CH₂–C≡N','propanonitrilo'],['CH₃–CH₂–CO–NH–CH₃','N-metilpropanamida'],['CH₃–CH(NH₂)–CH₃','2-propanamina'],['CH₃–CH₂–O–CH₂–CH₃','etoxietano (dietil éter)'],['CH₃–CHCl–CH₃','2-cloropropano'],['CH₃–CH(CH₃)–CH₂–CH₃','2-metilbutano'],['CH₃–C(CH₃)₂–CH₃','2,2-dimetilpropano'],['CH₃–CH₂–CH(CH₃)–CH₂–CH₃','3-metilpentano'],['CH₂=C(CH₃)–CH₃','2-metilpropeno'],['CH₃–CH₂–CH₂–NH₂','1-propanamina'],['C₆H₅–NH₂','fenilamina (anilina)'],['C₆H₅–COOH','ácido benzoico'],['C₆H₅–CHO','benzaldehído'],['CH₃–CH(OH)–COOH','ácido 2-hidroxipropanoico'],['CH₃–CO–CH₂–CHO','3-oxobutanal'],['CH₃–CH₂–CH(CH₃)–NO₂','2-nitrobutano']];
  const set=el.dataset.set==='org'?ORG:Q;
  // generador de distractores «trampa»
  const SW=[['(II)','(III)'],['(I)','(II)'],['(IV)','(II)'],['(V)','(III)'],['(VII)','(V)'],['ito','ato'],['oso','ico'],['hipo','per'],['hidrogeno','dihidrogeno'],['peróxido','óxido'],['di','tri'],['mono','di'],['sulfato','sulfito'],['nitrato','nitrito'],['clorato','clorito'],['₂','₃'],['₃','₂'],['₄','₃'],['(OH)₂','(OH)₃'],['Cl₂','Cl₃'],['an','en'],['eno','ino'],['al','ol'],['ona','al'],['oico','al'],['amina','amida'],['1-','2-'],['2-','3-'],['metil','etil'],['prop','but'],['but','pent'],['et','prop'],['CH₂–','CH₂–CH₂–'],['CH₃–CO–','CH₃–CH₂–'],['=','≡'],['–CHO','–CH₂OH'],['–COOH','–CHO'],['–NH₂','–OH']];
  const ACC=[['sulfurico','sulfúrico'],['clorico','clórico'],['nitrico','nítrico'],['fosforico','fosfórico'],['bromico','brómico'],['yodico','yódico'],['carbonico','carbónico'],['cromico','crómico'],['sulfurosoico','sulfúrico'],['perclorico','perclórico'],['hipocloroso','hipocloroso']];
  function fix(t){ACC.forEach(([x,y])=>{t=t.replace(x,y);});return t;}
  function mut(txt){const out=new Set();SW.forEach(([x,y])=>{if(txt.includes(x))out.add(fix(txt.replace(x,y)));if(txt.includes(y))out.add(fix(txt.replace(y,x)));});out.delete(txt);return [...out];}
  let i=Math.floor(Math.random()*set.length),mode='t0',ok=0,tot=0;
  el.innerHTML='<div class="ctrl sim-ctrls"><label><span>modo</span><select><option value="t0">test: de fórmula a nombre</option><option value="t1">test: de nombre a fórmula</option><option value="f0">fichas: de fórmula a nombre</option><option value="f1">fichas: de nombre a fórmula</option></select></label></div><div class="readout sim-out"><div class="qz"></div></div>';
  const sel=el.querySelector('select'),out=el.querySelector('.qz');sel.onchange=()=>{mode=sel.value;show();};
  const shuffle=a=>{for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]];}return a;};
  function next(){i=(i+1+Math.floor(Math.random()*(set.length-1)))%set.length;show();}
  function show(rev){const rv=mode.endsWith('1');const [f,n]=set[i];const q=rv?n:f,ans=rv?f:n;
    if(mode.startsWith('f')){out.innerHTML=`<p style="font-size:1.25em;margin:4px 0"><b>${q}</b></p>${rev?`<p>Respuesta: <b>${ans}</b></p><p><button class="qb" data-r="1">La tenía bien</button> <button class="qb" data-r="0">Fallé</button></p>`:`<p><button class="qb" data-s="1">Ver respuesta</button></p>`}<p class="hint">Aciertos ${ok}/${tot}.</p>`;
      out.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.s)show(true);else{tot++;if(b.dataset.r==='1')ok++;next();}});return;}
    // test: 1 correcta + 3 distractores (mutaciones primero, luego otros del banco)
    const pool=shuffle(mut(ans)).slice(0,2);const others=shuffle(set.filter((_,k)=>k!==i).map(p=>rv?p[0]:p[1]).filter(x=>!pool.includes(x)));
    while(pool.length<3&&others.length)pool.push(others.shift());
    const opts=shuffle([ans,...pool.slice(0,3)]);
    out.innerHTML=`<p style="font-size:1.25em;margin:4px 0">${rv?'Fórmula de':'Nombre de'} <b>${q}</b></p><div class="qopts">${opts.map(o=>`<button class="qb qo">${o}</button>`).join('')}</div><p class="qres"></p><p class="hint">Aciertos ${ok}/${tot}. Pulsa una opción; luego «Siguiente».</p>`;
    out.querySelectorAll('.qo').forEach(b=>b.onclick=()=>{if(out.dataset.done)return;out.dataset.done='1';tot++;const good=b.textContent===ans;if(good)ok++;out.querySelector('.hint').textContent=`Aciertos ${ok}/${tot}.`;
      out.querySelectorAll('.qo').forEach(x=>{if(x.textContent===ans)x.classList.add('ok');else if(x===b)x.classList.add('bad');x.disabled=true;});
      out.querySelector('.qres').innerHTML=(good?'<b>Correcto.</b> ':'<b>No.</b> ')+`${q} = <b>${ans}</b>. <button class="qb qn">Siguiente →</button>`;out.querySelector('.qn').onclick=()=>{delete out.dataset.done;next();};});}
  show();};
SIMS.organica=el=>{el.dataset.set='org';SIMS.formulacion(el);};

/* 5 gases: isoterma ideal frente a van der Waals */
SIMS.gases=el=>build(el,{sliders:[{k:'T',l:'temperatura',v:300,min:150,max:600,step:5,u:'K'},{k:'V',l:'volumen (1 mol)',v:2,min:0.1,max:10,step:0.05,u:'L'}],selects:[{k:'g',l:'gas',v:'cl2',opts:[['cl2','Cl₂ (a 6,49, b 0,0562)'],['co2','CO₂ (a 3,59, b 0,0427)'],['he','He (a 0,034, b 0,0237)'],['h2o','H₂O (a 5,46, b 0,0305)']]}],
  draw(a){a.clear();const s=a.st;const P={cl2:[6.49,0.0562],co2:[3.59,0.0427],he:[0.034,0.0237],h2o:[5.46,0.0305]}[s.g];const R=0.082;
    const Pi=V=>R*s.T/V,Pv=V=>R*s.T/(V-P[1])-P[0]/(V*V);
    const ox=55,oy=a.H-35,w=a.W-80,h=a.H-60,Vmax=10,Pmax=60;const X=V=>ox+V/Vmax*w,Y=p=>oy-Math.min(p,Pmax)/Pmax*h;
    a.line(ox,oy,ox+w,oy,C.muted,1.5);a.line(ox,oy,ox,oy-h,C.muted,1.5);a.txt('V (L)',ox+w-30,oy+16,C.muted,11);a.txt('P (atm)',ox+4,oy-h+10,C.muted,11);
    for(let p=10;p<=60;p+=10){a.line(ox,Y(p),ox+w,Y(p),C.grid,1);a.txt(p,ox-24,Y(p)+4,C.muted,10);}
    for(const [f,col] of [[Pi,C.muted],[Pv,C.a]]){a.g.strokeStyle=col;a.g.lineWidth=2.5;a.g.beginPath();let pen=false;for(let V=0.08;V<=Vmax;V+=0.02){const p=f(V);if(!(p>0&&p<Pmax)){pen=false;continue;}pen?a.g.lineTo(X(V),Y(p)):a.g.moveTo(X(V),Y(p));pen=true;}a.g.stroke();}
    const pi=Pi(s.V),pv=Pv(s.V);a.circ(X(s.V),Y(pv),6,C.a,true);a.circ(X(s.V),Y(pi),5,C.muted,true);
    const Z=pv*s.V/(R*s.T);const urms=Math.sqrt(3*8.314*s.T/({cl2:0.0709,co2:0.044,he:0.004,h2o:0.018}[s.g]));
    a.html(`T = ${s.T} K, V = ${F(s.V)} L: P<sub>ideal</sub> = ${F(pi)} atm · <b>P<sub>vdW</sub> = ${F(pv)} atm</b> · Z = PV/RT = ${Z.toFixed(3)} · u<sub>rms</sub> = ${urms.toFixed(0)} m/s<br><span class="hint">Gris: isoterma ideal; rojo: van der Waals. A volúmenes grandes coinciden; al comprimir, primero mandan las atracciones (Z &lt; 1, P menor) y a volúmenes muy pequeños el volumen excluido b (Z &gt; 1). Sube T y el gas se vuelve más ideal.</span>`);}});

/* 6 estequiometría: reactivo limitante */
SIMS.limitante=el=>build(el,{sliders:[{k:'a',l:'moles de NH₄Cl',v:0.62,min:0,max:2,step:0.01},{k:'b',l:'moles de Ca(OH)₂',v:0.45,min:0,max:2,step:0.01}],
  draw(a){a.clear();const s=a.st;const ca=2,cb=1;const ext=Math.min(s.a/ca,s.b/cb);const lim=s.a/ca<s.b/cb?'NH₄Cl':(s.a/ca>s.b/cb?'Ca(OH)₂':'ninguno (estequiométrico)');
    const items=[['NH₄Cl',s.a,s.a-ca*ext,C.a],['Ca(OH)₂',s.b,s.b-cb*ext,C.b],['NH₃',0,2*ext,C.c],['CaCl₂',0,ext,C.d],['H₂O',0,2*ext,C.f]];
    const bw=90,gap=30,ox=60,oy=a.H-50,sc=(a.H-110)/2.2;
    items.forEach(([n,ini,fin,col],i)=>{const x=ox+i*(bw+gap);a.g.fillStyle='rgba(120,120,120,0.18)';a.g.fillRect(x,oy-ini*sc,bw*0.45,ini*sc);a.g.fillStyle=col;a.g.fillRect(x+bw*0.5,oy-fin*sc,bw*0.45,fin*sc);a.txt(n,x+bw/2-18,oy+18,C.text,12);a.txt(F(fin),x+bw*0.5,oy-fin*sc-5,col,11);});
    a.txt('gris: inicial · color: final',ox,24,C.muted,12);a.line(ox-10,oy,a.W-20,oy,C.muted,1.5);
    a.html(`2NH₄Cl + Ca(OH)₂ → 2NH₃ + CaCl₂ + 2H₂O · cocientes n/coef: NH₄Cl ${F(s.a/2)}, Ca(OH)₂ ${F(s.b)} ⇒ <b>limitante: ${lim}</b> · avance ξ = ${F(ext)} mol · NH₃ producido = ${F(2*ext)} mol = ${F(2*ext*17)} g · exceso: ${s.a/ca<s.b/cb?`Ca(OH)₂ ${F(s.b-ext)} mol`:`NH₄Cl ${F(s.a-2*ext)} mol`}<br><span class="hint">El limitante es el de menor n/coeficiente, no el de menos gramos. Con 33 g de cada uno (0,62 y 0,45 mol) limita el NH₄Cl (problema 7.8).</span>`);}});

/* 7 termoquímica: proceso en el diagrama P-V */
SIMS.pv=el=>build(el,{selects:[{k:'t',l:'proceso (1 mol monoatómico desde 2 atm, 273 K)',v:'iso',opts:[['iso','isotermo reversible'],['bar','isóbaro'],['cor','isócoro'],['adi','adiabático reversible'],['irr','expansión irreversible contra P final']]}],sliders:[{k:'f',l:'factor de volumen V₂/V₁ (o T₂/T₁ en isócoro)',v:2,min:0.5,max:3,step:0.05}],
  draw(a){a.clear();const s=a.st;const R=0.082,Rj=8.314,n=1,T1=273,P1=2,V1=n*R*T1/P1,Cv=1.5*Rj,Cp=2.5*Rj,g=5/3;
    let V2,P2,T2,W,Q,dU,dH,dS,pts=[];const f=s.f;
    if(s.t==='iso'){V2=V1*f;T2=T1;P2=P1/f;dU=0;dH=0;W=-n*Rj*T1*Math.log(f);Q=-W;dS=n*Rj*Math.log(f);for(let k=0;k<=40;k++){const V=V1+(V2-V1)*k/40;pts.push([V,n*R*T1/V]);}}
    else if(s.t==='bar'){V2=V1*f;P2=P1;T2=T1*f;dU=n*Cv*(T2-T1);dH=n*Cp*(T2-T1);W=-P1*(V2-V1)*101.325;Q=dH;dS=n*Cp*Math.log(f);pts=[[V1,P1],[V2,P2]];}
    else if(s.t==='cor'){V2=V1;T2=T1*f;P2=P1*f;dU=n*Cv*(T2-T1);dH=n*Cp*(T2-T1);W=0;Q=dU;dS=n*Cv*Math.log(f);pts=[[V1,P1],[V2,P2]];}
    else if(s.t==='adi'){V2=V1*f;T2=T1*Math.pow(1/f,g-1);P2=n*R*T2/V2;dU=n*Cv*(T2-T1);dH=n*Cp*(T2-T1);Q=0;W=dU;dS=0;for(let k=0;k<=40;k++){const V=V1+(V2-V1)*k/40;pts.push([V,P1*Math.pow(V1/V,g)]);}}
    else{V2=V1*f;T2=T1;P2=P1/f;dU=0;dH=0;W=-P2*(V2-V1)*101.325;Q=-W;dS=n*Rj*Math.log(f);pts=[[V1,P1],[V1,P2],[V2,P2]];}
    const ox=60,oy=a.H-40,w=a.W-90,h=a.H-70,Vm=40,Pm=7;const X=V=>ox+V/Vm*w,Y=P=>oy-P/Pm*h;
    a.line(ox,oy,ox+w,oy,C.muted,1.5);a.line(ox,oy,ox,oy-h,C.muted,1.5);a.txt('V (L)',ox+w-30,oy+16,C.muted,11);a.txt('P (atm)',ox+4,oy-h+10,C.muted,11);
    for(let p=1;p<=6;p++){a.line(ox,Y(p),ox+w,Y(p),C.grid,1);a.txt(p,ox-16,Y(p)+4,C.muted,10);}for(let v=10;v<=40;v+=10){a.txt(v,X(v)-6,oy+14,C.muted,10);}
    // área = trabajo
    if(pts.length>1&&s.t!=='cor'){a.g.fillStyle='rgba(31,122,77,0.18)';a.g.beginPath();a.g.moveTo(X(pts[0][0]),oy);pts.forEach(p=>a.g.lineTo(X(p[0]),Y(p[1])));a.g.lineTo(X(pts[pts.length-1][0]),oy);a.g.closePath();a.g.fill();}
    a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();pts.forEach((p,i)=>i?a.g.lineTo(X(p[0]),Y(p[1])):a.g.moveTo(X(p[0]),Y(p[1])));a.g.stroke();
    a.circ(X(V1),Y(P1),6,C.b,true);a.txt('1',X(V1)+8,Y(P1)-6,C.b,13);a.circ(X(V2),Y(P2),6,C.c,true);a.txt('2',X(V2)+8,Y(P2)-6,C.c,13);
    a.html(`Estado 2: P = ${F(P2)} atm, V = ${F(V2)} L, T = ${F(T2)} K · <b>W = ${F(W)} J</b> (área, signo de los apuntes: + compresión) · q = ${F(Q)} J · ΔU = ${F(dU)} J · ΔH = ${F(dH)} J · ΔS = ${F(dS)} J/K<br><span class="hint">ΔU = q + W siempre; ΔU = nC<sub>v</sub>ΔT y ΔH = nC<sub>p</sub>ΔT en cualquier proceso de un gas ideal. Compara el trabajo isotermo reversible con el irreversible: el reversible es el máximo.</span>`);}});

/* 8 equilibrio: N2O4 ⇌ 2NO2 con P y T (Le Chatelier) */
SIMS.equilibrio=el=>build(el,{sliders:[{k:'T',l:'temperatura',v:300,min:250,max:400,step:1,u:'K'},{k:'P',l:'presión total',v:1,min:0.1,max:5,step:0.05,u:'atm'}],
  draw(a){a.clear();const s=a.st;const dH=57200,dS=175.8,R=8.314;const K=Math.exp(-(dH-s.T*dS)/(R*s.T));const al=Math.sqrt(K/(4*s.P+K));
    const ox=60,oy=a.H-40,w=a.W-90,h=a.H-70;const X=T=>ox+(T-250)/150*w,Y=v=>oy-v*h;
    a.line(ox,oy,ox+w,oy,C.muted,1.5);a.line(ox,oy,ox,oy-h,C.muted,1.5);a.txt('T (K)',ox+w-30,oy+16,C.muted,11);a.txt('grado de disociación α',ox+4,oy-h+10,C.muted,11);
    for(let v=0.2;v<1;v+=0.2){a.line(ox,Y(v),ox+w,Y(v),C.grid,1);a.txt(v.toFixed(1),ox-28,Y(v)+4,C.muted,10);}
    for(const [P,col] of [[0.1,C.c],[1,C.a],[5,C.b]]){a.g.strokeStyle=col;a.g.lineWidth=P===1?3:1.8;a.g.beginPath();for(let T=250;T<=400;T+=2){const k=Math.exp(-(dH-T*dS)/(R*T));const al2=Math.sqrt(k/(4*P+k));T===250?a.g.moveTo(X(T),Y(al2)):a.g.lineTo(X(T),Y(al2));}a.g.stroke();a.txt(P+' atm',X(395),Y(Math.sqrt(Math.exp(-(dH-395*dS)/(R*395))/(4*P+Math.exp(-(dH-395*dS)/(R*395)))))-6,col,11);}
    a.circ(X(s.T),Y(al),7,C.d,true);
    // barras composición
    const bx=a.W-150,by=40;a.g.fillStyle=C.a;a.g.fillRect(bx,by,100*(1-al)/(1+al),14);a.g.fillStyle=C.b;a.g.fillRect(bx+100*(1-al)/(1+al),by,100*2*al/(1+al),14);a.txt('N₂O₄',bx,by-4,C.a,10);a.txt('NO₂',bx+70,by-4,C.b,10);
    a.html(`N₂O₄ ⇌ 2NO₂ (ΔH° = +57,2 kJ, ΔS° = +175,8 J/K): a ${s.T} K, K<sub>p</sub> = ${K.toExponential(2)} atm · a ${F(s.P)} atm, <b>α = ${al.toFixed(3)}</b> · fracciones molares: N₂O₄ ${((1-al)/(1+al)).toFixed(3)}, NO₂ ${(2*al/(1+al)).toFixed(3)}<br><span class="hint">K<sub>p</sub> = 4α²P/(1−α²). Le Chatelier: subir T favorece la endotérmica (más NO₂); subir P desplaza hacia menos moles de gas (más N₂O₄). Van 't Hoff: ln K crece linealmente con −1/T.</span>`);}});

/* 9 fases: Clausius-Clapeyron y diagrama */
SIMS.fases=el=>build(el,{sliders:[{k:'dH',l:'ΔH de vaporización',v:40.7,min:10,max:80,step:0.5,u:'kJ/mol'},{k:'Tb',l:'T de ebullición normal',v:373,min:200,max:500,step:1,u:'K'},{k:'T',l:'temperatura',v:330,min:200,max:550,step:1,u:'K'}],
  draw(a){a.clear();const s=a.st;const R=8.314;const Pv=T=>Math.exp(-s.dH*1000/R*(1/T-1/s.Tb));
    const ox=60,oy=a.H-40,w=a.W-90,h=a.H-70;const X=T=>ox+(T-200)/350*w,Y=p=>oy-Math.min(p,5)/5*h;
    a.line(ox,oy,ox+w,oy,C.muted,1.5);a.line(ox,oy,ox,oy-h,C.muted,1.5);a.txt('T (K)',ox+w-30,oy+16,C.muted,11);a.txt('P (atm)',ox+4,oy-h+10,C.muted,11);
    for(let p=1;p<=5;p++){a.line(ox,Y(p),ox+w,Y(p),C.grid,1);a.txt(p,ox-16,Y(p)+4,C.muted,10);}
    a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();let pen=false;for(let T=200;T<=550;T+=1){const p=Pv(T);if(p>5.2){pen=false;continue;}pen?a.g.lineTo(X(T),Y(p)):a.g.moveTo(X(T),Y(p));pen=true;}a.g.stroke();
    // fusión (vertical aprox) y sublimación
    const Tt=s.Tb*0.72;a.line(X(Tt),Y(Pv(Tt)),X(Tt)+6,oy-h,C.b,2);a.g.strokeStyle=C.c;a.g.lineWidth=2;a.g.beginPath();for(let T=200;T<=Tt;T+=2){const p=Pv(Tt)*Math.exp(-(s.dH*1000*1.15)/R*(1/T-1/Tt));T===200?a.g.moveTo(X(T),Y(p)):a.g.lineTo(X(T),Y(p));}a.g.stroke();
    a.circ(X(Tt),Y(Pv(Tt)),5,C.d,true);a.txt('punto triple',X(Tt)+8,Y(Pv(Tt))+14,C.d,11);a.txt('SÓLIDO',X(215),Y(3),C.muted,13);a.txt('LÍQUIDO',X(Tt+40),Y(4),C.muted,13);a.txt('GAS',X(480),Y(0.8),C.muted,13);
    const p=Pv(s.T);a.circ(X(s.T),Y(p),6,C.a,true);a.line(X(s.T),Y(p),X(s.T),oy,C.a,1,[3,3]);
    a.html(`Clausius-Clapeyron: ln(P₂/P₁) = −(ΔH<sub>v</sub>/R)(1/T₂ − 1/T₁) ⇒ a ${s.T} K la presión de vapor es <b>${p<0.01?p.toExponential(2):F(p)} atm</b> (${F(p*760)} mmHg)${s.T>=s.Tb?' · por encima de T<sub>b</sub> el líquido hierve a 1 atm':''}<br><span class="hint">Línea roja: equilibrio líquido-vapor (presión de vapor); naranja: fusión (pendiente positiva salvo el agua); verde: sublimación. En el punto triple coexisten tres fases (L = 0). Con ΔH<sub>v</sub> grande la curva sube más despacio.</span>`);}});

/* 10 Nernst: pila Daniell */
SIMS.nernst=el=>build(el,{sliders:[{k:'zn',l:'[Zn²⁺]',v:0.1,min:0.001,max:1,step:0.001,u:'M'},{k:'cu',l:'[Cu²⁺]',v:0.002,min:0.001,max:1,step:0.001,u:'M'},{k:'T',l:'temperatura',v:298,min:273,max:350,step:1,u:'K'}],
  draw(a){a.clear();const s=a.st;const E0=1.10,F0=96485,R=8.314;const E=E0-(R*s.T/(2*F0))*Math.log(s.zn/s.cu);
    // dibujo pila
    const y=a.H-60;a.g.fillStyle='rgba(44,138,82,0.25)';a.g.fillRect(80,y-120,150,120);a.g.fillStyle='rgba(58,99,196,0.25)';a.g.fillRect(400,y-120,150,120);
    a.g.fillStyle='#777';a.g.fillRect(145,y-170,16,150);a.g.fillStyle='#b87333';a.g.fillRect(465,y-170,16,150);
    a.txt('Zn',140,y-176,C.text,13);a.txt('Cu',462,y-176,C.text,13);a.txt('ZnSO₄ '+s.zn.toFixed(3)+' M',90,y+20,C.text,12);a.txt('CuSO₄ '+s.cu.toFixed(3)+' M',410,y+20,C.text,12);
    a.g.strokeStyle=C.muted;a.g.lineWidth=10;a.g.beginPath();a.g.moveTo(215,y-90);a.g.lineTo(215,y-135);a.g.lineTo(415,y-135);a.g.lineTo(415,y-90);a.g.stroke();a.txt('puente salino KNO₃',250,y-142,C.muted,11);
    a.line(153,y-170,153,30,C.text,2);a.line(153,30,473,30,C.text,2);a.line(473,30,473,y-170,C.text,2);a.g.fillStyle=C.bg;a.g.fillRect(280,18,70,26);a.g.strokeStyle=C.text;a.g.strokeRect(280,18,70,26);a.txt(E.toFixed(3)+' V',288,36,C.a,13);
    a.arrow(200,30,260,30,C.d,2.5);a.txt('e⁻',225,22,C.d,12);a.txt('ánodo (−): Zn → Zn²⁺ + 2e⁻',80,y+40,C.c,12);a.txt('cátodo (+): Cu²⁺ + 2e⁻ → Cu',380,y+40,C.f,12);
    const dG=-2*F0*E/1000;
    a.html(`E° = 0,34 − (−0,76) = 1,10 V · Nernst: E = E° − (RT/2F)·ln([Zn²⁺]/[Cu²⁺]) = <b>${E.toFixed(3)} V</b> · ΔG = −nFE = ${F(dG)} kJ/mol<br><span class="hint">Diluir el Cu²⁺ (reactivo del cátodo) baja el potencial; diluir el Zn²⁺ lo sube. A 25 °C el factor es 0,059/n por década de logaritmo decimal. En la práctica se mide con 0,1 M y 0,002 M de CuSO₄.</span>`);}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
