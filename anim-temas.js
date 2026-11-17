/* Química General: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function cap(c){return c;}

/* T1 átomo de Bohr */
var TR=[[3,2,656],[4,2,486],[2,1,122],[4,3,1875]];
M.reg('qg-t1',M.base({title:'Átomo de hidrógeno: saltos y fotones',H:560,dur:20,caps:[[5,'En el modelo de Bohr el electrón solo puede estar en niveles con energía <i>Eₙ = −13,6/n²</i> eV.'],[13,'Al bajar de un nivel a otro emite un fotón con la energía exacta de la diferencia: <i>hν = E<sub>i</sub> − E<sub>f</sub></i>.'],[99,'Por eso el espectro es de <b>líneas</b>: 3→2 da la línea roja de 656 nm (serie de Balmer); 2→1 cae en el ultravioleta (Lyman) y 4→3 en el infrarrojo (Paschen).']]},
 function(D,t){var cx=210,cy=290,k=Math.floor(t/5)%4,fr=(t%5)/5,tr=TR[k],ni=tr[0],nf2=tr[1],rr=function(n){return 14+11*n*n;};
  for(var n=1;n<=4;n++)D.ring(cx,cy,rr(n),C.grid,1.4);D.dot(cx,cy,9,C.g);D.text('+',cx,cy+5,{s:14,a:'center',c:C.bg});
  var r=fr<0.45?rr(ni):(fr<0.6?lerp(rr(ni),rr(nf2),ease(seg(fr,0.45,0.6))):rr(nf2)),a=t*2.2;D.dot(cx+r*Math.cos(a),cy-r*Math.sin(a),7,C.f);
  if(fr>0.55){var d=(fr-0.55)*520,ang=a+0.3,x0=cx+rr(nf2)*Math.cos(a),y0=cy-rr(nf2)*Math.sin(a),pts=[];for(var s=0;s<=Math.min(d,180);s+=2){var w=6*Math.sin(s*0.35);pts.push([x0+(d-s)*0.0+s,y0-w]);}
    D.path(pts.map(function(p){return [p[0]+Math.max(0,d-180),p[1]];}),tr[2]<400?C.m:(tr[2]<500?C.f:(tr[2]<800?C.bad:C.mut)),2.4);}
  /* diagrama de niveles */
  var lx=440,E=function(n){return 450-(13.6-13.6/(n*n))*24;};for(var m=1;m<=4;m++){D.line(lx,E(m),lx+150,E(m),C.ax,1.6);D.text('n = '+m,lx+156,E(m)+5,{s:13,c:C.mut});}
  D.text('E = −13,6 eV',lx+75,E(1)+22,{s:13,a:'center',c:C.mut});D.arrow(lx+75,E(ni),lx+75,E(nf2),C.m,3);
  var dE=13.6*(1/(nf2*nf2)-1/(ni*ni));D.text(ni+' → '+nf2+':  ΔE = '+nf(dE,2)+' eV   λ = '+tr[2]+' nm',W/2,530,{it:true,s:22,a:'center',c:C.m});}));

/* T2 energía de ionización */
var EI=[1312,2372,520,899,801,1086,1402,1314,1681,2081,496,738,578,787,1012,1000,1251,1521,419,590],SY=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca'];
M.reg('qg-t2',M.barras({title:'Periodicidad: energía de ionización',H:560,dur:18,n:20,p:[0,20],u:function(t,d){return ease(seg(t,1,d*0.7));},ax:{xr:[-0.8,19.8],yr:[0,2600],xt:[],yt:[500,1000,1500,2000,2500],yd:0,xl:'Z',yl:'kJ/mol'},h:300,bw:0.75,
 val:function(i,p){return i<p?EI[i]:0;},lab:function(i){return SY[i];},col:function(i){return [1,9,17].indexOf(i)>=0?'g':([2,10,18].indexOf(i)>=0?'f':'m');},
 read:function(p){var i=Math.min(19,Math.floor(p));return [SY[i]+' (Z = '+(i+1)+'):  EI₁ = '+EI[i]+' kJ/mol','máximos en los gases nobles · mínimos en los alcalinos'];},
 caps:[[6,'La primera energía de ionización es lo que cuesta arrancar el electrón más externo. Crece a lo largo de un periodo porque aumenta la carga nuclear efectiva.'],[12,'Al empezar un periodo nuevo (Li, Na, K) cae de golpe: el electrón está en una capa más alejada y apantallada.'],[99,'Los pequeños saltos atrás (B, O, Al, S) se deben a la subcapa p que empieza o a la repulsión del primer electrón apareado.']]}));

/* T3 curva de energía del enlace H–H */
var De=436,re=74,aa=0.019;function morse(r){var e=1-Math.exp(-aa*(r-re));return De*(e*e-1);}
M.reg('qg-t3',M.traza({title:'Formación del enlace: energía frente a distancia',H:560,dur:16,x0:250,x1:52,ax:{xr:[40,260],yr:[-500,400],xt:[74,150,200,250],yt:[-400,-200,200],xd:0,yd:0,xl:'r (pm)',yl:'E (kJ/mol)'},h:300,f:morse,
 extra:function(D,A,r){var cx=A.X(150),y=118,d=(r-40)*0.55;D.dot(cx-d,y,13,C.f);D.dot(cx+d,y,13,C.f);D.text('H',cx-d,y+5,{s:12,a:'center',c:C.bg});D.text('H',cx+d,y+5,{s:12,a:'center',c:C.bg});
   D.line(A.X(74),A.Y(-436),A.X(74),A.Y(0),C.hl,1.2,[4,4]);D.text('−436',A.X(74)+6,A.Y(-436)+16,{s:14,c:C.hl});},
 read:function(r){var E=morse(r);return ['r = '+nf(r,0)+' pm     E = '+nf(E,0)+' kJ/mol',r>90?'los átomos se atraen: la energía baja':(r>60?'zona del mínimo: longitud de enlace 74 pm':'demasiado cerca: repulsión entre núcleos')];},
 caps:[[6,'Dos átomos de hidrógeno se acercan. Al solaparse sus orbitales, la energía del sistema baja: se forma el enlace.'],[11,'El mínimo de la curva da la <b>longitud de enlace</b> (74 pm) y su profundidad, la <b>energía de enlace</b> (436 kJ/mol).'],[99,'Si se acercan más, la repulsión entre los núcleos dispara la energía. Por eso la distancia de enlace es un compromiso.']]}));

/* T4 formulación inorgánica */
var VA=[['Al','3+','O','2−','Al₂O₃','óxido de aluminio'],['Ca','2+','Cl','1−','CaCl₂','cloruro de calcio'],['Al','3+','SO₄','2−','Al₂(SO₄)₃','sulfato de aluminio'],['Fe','3+','O','2−','Fe₂O₃','óxido de hierro(III)']];
M.reg('qg-t4',M.base({title:'Formular cruzando valencias',H:560,dur:20,caps:[[5,'Se escribe primero el catión y después el anión, cada uno con su carga.'],[10,'El valor de cada carga pasa a ser el subíndice del otro ión: las cargas «se cruzan». Si los subíndices tienen divisor común, se simplifican.'],[99,'La comprobación: la suma de cargas tiene que dar cero. Los iones poliatómicos se escriben entre paréntesis si llevan subíndice.']]},
 function(D,t){var k=Math.min(3,Math.floor(t/5)),v=VA[k],u=(t%5)/5,a=ease(seg(u,0.15,0.6)),cx=W/2,y=230;
  D.text(v[0],cx-90,y,{s:48,a:'center',c:C.f,bold:true});D.text(v[1],cx-50,y-34,{s:22,c:C.f});D.text(v[2],cx+90,y,{s:48,a:'center',c:C.hl,bold:true});D.text(v[3],cx+130,y-34,{s:22,c:C.hl});
  var n1=parseInt(v[1]),n2=parseInt(v[3]);if(a>0){var p1=[lerp(cx-40,cx+150,a),lerp(y-40,y+30,a)],p2=[lerp(cx+140,cx-30,a),lerp(y-40,y+30,a)];D.text(''+n1,p1[0],p1[1],{s:24,c:C.m,bold:true});D.text(''+n2,p2[0],p2[1],{s:24,c:C.m,bold:true});
   D.ctx.save();D.ctx.setLineDash([5,4]);D.line(cx-40,y-40,cx+140,y+20,C.mut,1.4);D.line(cx+140,y-40,cx-30,y+20,C.mut,1.4);D.ctx.restore();}
  var b=ease(seg(u,0.65,0.85));if(b>0){D.text(v[4],cx,y+120,{s:44,a:'center',c:C.m,bold:true,al:b});D.text(v[5],cx,y+160,{s:18,a:'center',c:C.w,al:b});}
  var g=v[4]==='CaCl₂'?'1·(+2) + 2·(−1) = 0':'2·(+3) + 3·(−2) = 0';U.readout(D,[b>0.5?g+'  ✓':' '],470);}));


/* T5 formulación del carbono */
var CH=[[0,0],[1,-0.6],[2,0],[3,-0.6],[4,0]],SUBS=[[1,-0.6,1,-1.5,'OH'],[2,0,2,0.9,'CH₃']];
M.reg('qg-t5',M.base({title:'Nombrar un compuesto orgánico',H:580,dur:20,caps:[[5,'Se dibuja el esqueleto: cada vértice es un carbono. Primero se busca la cadena más larga que contiene el grupo funcional (–OH): 5 carbonos, pent-.'],[11,'Se numera desde el extremo que da el localizador más bajo al grupo principal: así el –OH queda en C2 (desde el otro lado sería C4).'],[99,'El metilo queda en C3. Nombre: sustituyentes + raíz + sufijo → <b>3-metilpentan-2-ol</b>.']]},
 function(D,t){var x0=170,y0=260,S=75,P=function(q){return [x0+q[0]*S,y0+q[1]*S];},a=ease(seg(t,4,6)),dir=t<9?(t<7?0:-1):1,b=ease(seg(t,13,15));
  D.path(CH.map(P),a>0?C.m:C.ax,a>0?5:3);SUBS.forEach(function(s){var p=P([s[0],s[1]]),q=P([s[2],s[3]]);D.line(p[0],p[1],q[0],q[1],C.ax,3);D.text(s[4],q[0],q[1]+(s[3]<0?-6:22),{s:20,a:'center',c:s[4]==='OH'?C.bad:C.hl,bold:true});});
  CH.forEach(function(c,i){var p=P(c);D.dot(p[0],p[1],5,C.ax);if(dir!==0){var n=dir>0?i+1:5-i;D.text(''+n,p[0]+(c[1]<0?-14:14),p[1]+(c[1]<0?-8:24),{s:16,a:'center',c:dir>0?C.y:C.mut,bold:dir>0});}});
  if(t>=7&&t<9)D.text('desde la derecha: –OH en C4  ✗',W/2,420,{s:17,a:'center',c:C.bad});if(t>=9&&t<13)D.text('desde la izquierda: –OH en C2  ✓',W/2,420,{s:17,a:'center',c:C.ok});
  if(b>0)D.text('3-metilpentan-2-ol',W/2,470,{s:30,a:'center',c:C.m,bold:true,al:b});}));


/* T6 gas ideal */
var gp=null;
M.reg('qg-t6',M.base({title:'Gas ideal: temperatura y presión',H:560,dur:20,caps:[[6,'Las moléculas de un gas se mueven al azar y chocan con las paredes. Esos choques son la <b>presión</b>.'],[13,'Al subir la temperatura las moléculas van más rápido (<i>v ∝ √T</i>): chocan más a menudo y con más fuerza.'],[99,'A volumen constante, <i>p = nRT/V</i>: la presión es proporcional a la temperatura absoluta (ley de Gay-Lussac).']]},
 function(D,t){var T=lerp(200,600,U.pp(t,20)),bx=60,by=100,bw=300,bh=300;if(!gp||t<0.05){gp=[];for(var i=0;i<40;i++){var a=Math.random()*6.28;gp.push({x:bx+20+Math.random()*(bw-40),y:by+20+Math.random()*(bh-40),vx:Math.cos(a),vy:Math.sin(a)});}}
  var sp=2.2*Math.sqrt(T/300);D.rect(bx,by,bw,bh,C.w,RG(C.f,.06),2.6);
  gp.forEach(function(q){q.x+=q.vx*sp;q.y+=q.vy*sp;if(q.x<bx+6||q.x>bx+bw-6)q.vx*=-1;if(q.y<by+6||q.y>by+bh-6)q.vy*=-1;q.x=clamp(q.x,bx+6,bx+bw-6);q.y=clamp(q.y,by+6,by+bh-6);D.dot(q.x,q.y,5,T>400?C.g:C.f);});
  var n=1,R=0.082,V=10,p=n*R*T/V;D.rect(420,by+bh-p/5*bh,40,p/5*bh,C.m,RG(C.m,.3),2);D.text('p',440,by+bh+22,{it:true,s:18,a:'center',c:C.m});
  D.rect(500,by+bh-T/700*bh,40,T/700*bh,C.g,RG(C.g,.3),2);D.text('T',520,by+bh+22,{it:true,s:18,a:'center',c:C.g});
  D.text('T = '+nf(T,0)+' K      p = nRT/V = '+nf(p,2)+' atm',W/2,470,{it:true,s:22,a:'center',c:C.m});D.text('n = 1 mol,  V = 10 L,  R = 0,082 atm·L/(mol·K)',W/2,506,{it:true,s:18,a:'center'});}));

/* T7 reactivo limitante */
M.reg('qg-t7',M.barras({title:'Estequiometría: el reactivo limitante',H:560,dur:16,n:3,p:[0,2],u:function(t,d){return ease(seg(t,1,d*0.75));},ax:{xr:[-0.6,2.6],yr:[0,5.5],xt:[],yt:[1,2,3,4,5],yd:0,xl:'',yl:'mol'},h:300,bw:0.5,
 val:function(i,p){return [5-2*p,2-p,2*p][i];},lab:function(i){return ['H₂','O₂','H₂O'][i];},col:function(i){return ['f','g','m'][i];},
 read:function(p){return ['2 H₂ + O₂ → 2 H₂O       avance ξ = '+nf(p,2)+' mol','quedan '+nf(5-2*p,2)+' mol H₂ y '+nf(2-p,2)+' mol O₂;  se forman '+nf(2*p,2)+' mol H₂O'];},
 caps:[[6,'Partimos de 5 mol de H₂ y 2 mol de O₂. Por cada mol de O₂ que reacciona se gastan 2 de H₂ y se forman 2 de agua.'],[12,'La reacción avanza hasta que se agota uno de los reactivos: aquí el O₂ (2 mol solo pueden gastar 4 de H₂).'],[99,'El O₂ es el <b>reactivo limitante</b>: fija cuánto producto se forma (4 mol de H₂O). Sobra 1 mol de H₂ (reactivo en exceso).']]}));

/* T8 diagrama de energía */
function ener(x){var S=1/(1+Math.exp(-2.2*(x-5.6)));return -80*S+110*Math.exp(-Math.pow((x-5)/1.0,2));}
M.reg('qg-t8',M.traza({title:'Termoquímica: entalpía y energía de activación',H:560,dur:16,ax:{xr:[0,10],yr:[-120,140],xt:[],yt:[-80,0,100],yd:0,xl:'avance',yl:'H (kJ/mol)'},h:310,f:ener,
 extra:function(D,A,x){var top=0,xm=0;for(var s=0;s<=10;s+=0.01){var v=ener(s);if(v>top){top=v;xm=s;}}D.line(A.X(0),A.Y(0),A.X(10),A.Y(0),C.mut,1,[4,4]);D.line(A.X(0),A.Y(-80),A.X(10),A.Y(-80),C.mut,1,[4,4]);
   D.arrow(A.X(1.2),A.Y(0),A.X(1.2),A.Y(top),C.hl,2);D.text('Eₐ = '+nf(top,0),A.X(1.2)+8,A.Y(top/2),{s:15,c:C.hl});D.arrow(A.X(9),A.Y(0),A.X(9),A.Y(-80),C.g,2);D.text('ΔH = −80',A.X(9)-8,A.Y(-40),{s:15,c:C.g,a:'right'});},
 read:function(x){return [x<3?'reactivos':(x<6.5?'complejo activado (estado de transición)':'productos'),'reacción exotérmica: libera 80 kJ por mol'];},
 caps:[[5,'Los reactivos deben superar una barrera, la <b>energía de activación</b>, para convertirse en productos.'],[11,'La diferencia entre productos y reactivos es la <b>entalpía de reacción</b> <i>ΔH</i>. Aquí es negativa: reacción exotérmica.'],[99,'Un catalizador baja la barrera (reacción más rápida) pero no cambia <i>ΔH</i>: la energía de reactivos y productos sigue siendo la misma.']]}));

/* T9 equilibrio químico */
function cA(x){return 0.25+0.75*Math.exp(-0.4*x);}
M.reg('qg-t9',M.traza({title:'Equilibrio químico: A ⇌ B',H:560,dur:16,ax:{xr:[0,12],yr:[0,1.1],xt:[2,4,6,8,10,12],yt:[0.25,0.5,0.75,1],yd:2,xl:'t',yl:'[ ] (M)'},h:300,f:cA,
 extra:function(D,A,x){var p=[];for(var s=0;s<=x;s+=0.05)p.push([A.X(s),A.Y(1-cA(s))]);D.path(p,C.g,3);D.dot(A.X(x),A.Y(1-cA(x)),6.5,C.g);D.text('[A]',A.X(0.3),A.Y(1.0),{s:16,c:C.m});D.text('[B]',A.X(0.3),A.Y(0.08),{s:16,c:C.g});
   D.line(A.X(0),A.Y(0.75),A.X(12),A.Y(0.75),C.mut,1,[4,4]);D.line(A.X(0),A.Y(0.25),A.X(12),A.Y(0.25),C.mut,1,[4,4]);},
 read:function(x){var a=cA(x),Q=(1-a)/a;return ['Q = [B]/[A] = '+nf(Q,2)+'      K = 3',Q<2.97?'Q < K: la reacción avanza hacia B':'Q = K: equilibrio (las dos velocidades se igualan)'];},
 caps:[[6,'Empezamos con A puro. La reacción directa (k₁ = 0,3) gana a la inversa (k₂ = 0,1) y [B] crece.'],[12,'El cociente de reacción <i>Q = [B]/[A]</i> sube hasta igualar la constante <i>K = k₁/k₂ = 3</i>.'],[99,'En el equilibrio las concentraciones dejan de cambiar, pero la reacción no se para: va igual de rápido en los dos sentidos (equilibrio dinámico).']]}));

/* T10 diagrama de fases del agua (esquema) */
M.reg('qg-t10b',M.base({title:'Diagrama de fases del agua (esquema)',H:560,dur:18,caps:[[6,'Calentamos hielo a 1 atm. Cada región del diagrama es una fase estable; las curvas son equilibrios entre dos fases.'],[12,'Al cruzar la curva sólido-líquido funde (0 °C) y al cruzar la líquido-vapor hierve (100 °C).'],[99,'En el <b>punto triple</b> coexisten las tres fases; por encima del <b>punto crítico</b> líquido y vapor dejan de distinguirse.']]},
 function(D,t){var A=U.axes(D,{xr:[0,10],yr:[0,10],xt:[],yt:[],xl:'T',yl:'p'},{x:90,y:90,w:460,h:320});
  var tp=[2.4,2.2],cp=[8.6,8.2];D.path([[A.X(2.0),A.Y(10)],[A.X(tp[0]),A.Y(tp[1])]],C.f,2.6);
  var vap=[];for(var s=0;s<=1;s+=0.02)vap.push([A.X(lerp(tp[0],cp[0],s)),A.Y(tp[1]+(cp[1]-tp[1])*s*s)]);D.path(vap,C.f,2.6);var sub=[];for(var s2=0;s2<=1;s2+=0.02)sub.push([A.X(lerp(0.2,tp[0],s2)),A.Y(0.2+(tp[1]-0.2)*s2*s2)]);D.path(sub,C.f,2.6);
  D.dot(A.X(tp[0]),A.Y(tp[1]),6,C.hl);D.text('punto triple',A.X(tp[0])+8,A.Y(tp[1])+18,{s:14,c:C.hl});D.dot(A.X(cp[0]),A.Y(cp[1]),6,C.hl);D.text('punto crítico',A.X(cp[0])-8,A.Y(cp[1])-10,{s:14,c:C.hl,a:'right'});
  D.text('SÓLIDO',A.X(1),A.Y(6),{s:18,c:C.mut});D.text('LÍQUIDO',A.X(4.5),A.Y(7.5),{s:18,c:C.mut});D.text('VAPOR',A.X(6.5),A.Y(2),{s:18,c:C.mut});
  var y1=5,xb1=2.24,xb2=tp[0]+(cp[0]-tp[0])*Math.sqrt((y1-tp[1])/(cp[1]-tp[1]));D.line(A.X(0),A.Y(y1),A.X(10),A.Y(y1),C.mut,1,[4,4]);D.text('1 atm',A.X(9.9),A.Y(y1)-6,{s:13,a:'right',c:C.mut});
  var x=lerp(0.4,9.6,ease(seg(t,1,16))),fase=x<xb1?'sólido (hielo)':(x<xb2?'líquido':'vapor');D.dot(A.X(x),A.Y(y1),8,C.m);
  D.text('fase: '+fase,W/2,470,{s:22,a:'center',c:C.m,bold:true});D.text(Math.abs(x-xb1)<0.25?'fusión: sólido ⇌ líquido':(Math.abs(x-xb2)<0.25?'ebullición: líquido ⇌ vapor':'calentamiento a presión constante'),W/2,506,{s:18,a:'center'});}));

/* T11 pila Daniell */
M.reg('qg-t11',M.base({title:'La pila Daniell',H:560,dur:16,caps:[[6,'En el ánodo el cinc se oxida: <i>Zn → Zn²⁺ + 2e⁻</i>. Los electrones salen por el cable.'],[11,'En el cátodo el cobre se reduce: <i>Cu²⁺ + 2e⁻ → Cu</i>. El puente salino cierra el circuito con iones.'],[99,'Fuerza electromotriz estándar: <i>E° = E°(Cu²⁺/Cu) − E°(Zn²⁺/Zn) = 0,34 − (−0,76) = 1,10 V</i>.']]},
 function(D,t){var y0=260,h=150;D.rect(70,y0,190,h,C.w,RG(C.f,.12),2);D.rect(380,y0,190,h,C.w,RG(C.f,.22),2);D.rect(140,y0-60,30,160,C.mut,RG(C.mut,.5),2);D.rect(470,y0-60,30,160,C.hl,RG(C.hl,.5),2);
  D.text('Zn',155,y0-70,{s:18,a:'center',c:C.mut});D.text('Cu',485,y0-70,{s:18,a:'center',c:C.hl});D.text('ánodo (−)',155,y0+h+24,{s:15,a:'center'});D.text('cátodo (+)',485,y0+h+24,{s:15,a:'center'});
  D.path([[220,y0+20],[220,y0-30],[420,y0-30],[420,y0+20]],C.f,10,null,0.4);D.text('puente salino',320,y0-40,{s:14,a:'center',c:C.mut});
  D.line(155,y0-60,155,120,C.w,2);D.line(155,120,485,120,C.w,2);D.line(485,120,485,y0-60,C.w,2);D.ring(320,120,26,C.w,2);D.text('1,10 V',320,126,{s:14,a:'center',c:C.m});
  for(var k=0;k<6;k++){var u=((t*0.25+k/6)%1),L=490,d=u*L,x,y;if(d<80){x=155;y=y0-60-d;}else if(d<410){x=155+(d-80);y=120;}else{x=485;y=120+(d-410);}
   if(Math.abs(x-320)>30||y!==120)D.dot(x,y,5,C.m);}
  D.text('e⁻ →',260,108,{s:15,c:C.m});for(var j=0;j<5;j++){var v=((t*0.3+j/5)%1);D.dot(lerp(250,390,v),y0-30,4,C.g,0.8);}}));

/* T12 cinética de primer orden */
var kk=0.35,th=Math.log(2)/kk;
M.reg('qg-t12',M.traza({title:'Cinética de primer orden y vida media',H:540,dur:16,ax:{xr:[0,12],yr:[0,1.1],xt:[2,4,6,8,10,12],yt:[0.25,0.5,1],yd:2,xl:'t (min)',yl:'[A]/[A]₀'},h:300,f:function(x){return Math.exp(-kk*x);},
 extra:function(D,A,x){for(var n=1;n<=5;n++){var tt=n*th;if(tt>x)break;D.line(A.X(tt),A.Y(0),A.X(tt),A.Y(Math.pow(0.5,n)),C.hl,1.2,[4,4]);D.text('t½·'+n,A.X(tt),A.Y(Math.pow(0.5,n))-8,{s:13,a:'center',c:C.hl});}},
 read:function(x){return ['[A] = [A]₀·e^{−kt} = '+nf(Math.exp(-kk*x),3)+'·[A]₀','k = 0,35 min⁻¹     t½ = ln2/k = '+nf(th,2)+' min'];},
 caps:[[6,'En una reacción de primer orden la velocidad es proporcional a la concentración: <i>v = k[A]</i>. La concentración cae exponencialmente.'],[12,'Cada <b>vida media</b> <i>t½ = ln 2/k</i> la concentración se reduce a la mitad, sea cual sea el valor de partida.'],[99,'Por eso ln[A] frente a t es una recta de pendiente −k: es la forma de comprobar el orden con datos experimentales.']]}));

/* T13 valoración ácido fuerte - base fuerte */
function pH(V){var c=(2.5-0.1*V)/(25+V),H=c/2+Math.sqrt(c*c/4+1e-14);return -Math.log10(H);}
M.reg('qg-t13',M.traza({title:'Valoración HCl con NaOH',H:560,dur:16,ax:{xr:[0,50],yr:[0,14],xt:[10,20,25,30,40,50],yt:[2,4,7,10,12,14],xd:0,yd:0,xl:'V NaOH (mL)',yl:'pH'},h:310,f:pH,
 extra:function(D,A,V){D.line(A.X(25),A.Y(0),A.X(25),A.Y(14),C.hl,1.2,[4,4]);D.text('punto de equivalencia',A.X(25)+6,A.Y(13),{s:14,c:C.hl});},
 read:function(V){return ['V = '+nf(V,1)+' mL      pH = '+nf(pH(V),2),V<24.5?'queda HCl sin neutralizar':(V<25.5?'equivalencia: pH = 7':'exceso de NaOH')];},
 caps:[[6,'25 mL de HCl 0,1 M valorados con NaOH 0,1 M. Al principio el pH sube muy poco: cada gota de base se neutraliza.'],[11,'Cerca de 25 mL el pH salta varias unidades con una sola gota: es el <b>punto de equivalencia</b> (pH = 7 entre ácido y base fuertes).'],[99,'Un buen indicador es el que cambia de color dentro del salto, por ejemplo la fenolftaleína (8,2–10).']]}));

/* T14 Nernst: la pila se descarga */
function Ecell(x){return 1.10-0.0296*Math.log10((1+x)/(1-x));}
M.reg('qg-t14',M.traza({title:'Ecuación de Nernst: la pila se descarga',H:540,dur:16,x0:0,x1:0.999,ax:{xr:[0,1],yr:[0.95,1.15],xt:[0.25,0.5,0.75,1],yt:[1,1.05,1.1],yd:2,xl:'fracción de Cu²⁺ gastada',yl:'E (V)'},h:300,f:Ecell,
 read:function(x){return ['[Cu²⁺] = '+nf(1-x,3)+' M    [Zn²⁺] = '+nf(1+x,3)+' M','E = 1,10 − (0,0592/2)·log([Zn²⁺]/[Cu²⁺]) = '+nf(Ecell(x),3)+' V'];},
 caps:[[6,'Pila Daniell con disoluciones 1 M. Mientras funciona se gasta Cu²⁺ y se forma Zn²⁺.'],[12,'La ecuación de Nernst da el potencial real: <i>E = E° − (0,0592/n)·log Q</i>. Al crecer Q, el potencial baja… pero muy despacio.'],[99,'Solo cuando el Cu²⁺ casi se agota el potencial se desploma. En el equilibrio (<i>Q = K</i>) la pila está «gastada»: <i>E = 0</i>.']]}));

/* T15 mecanismo SN2 */
M.reg('qg-t15',M.base({title:'Mecanismo SN2: inversión de Walden',H:540,dur:14,caps:[[5,'El nucleófilo (Nu⁻) ataca al carbono por el lado opuesto al grupo saliente (Br).'],[9,'En el estado de transición el carbono está unido a medias a los dos, con los tres sustituyentes en un plano.'],[99,'El Br sale y los sustituyentes se dan la vuelta como un paraguas: la configuración se <b>invierte</b>. Velocidad <i>v = k[RBr][Nu⁻]</i> (orden 2).']]},
 function(D,t){var u=ease(seg(t,1.5,10)),cx=320,cy=260,nu=lerp(70,cx-100,Math.min(1,u*1.4)),lg=cx+90+Math.max(0,u-0.5)*2*170,fl=lerp(1,-1,u);
  for(var k=0;k<3;k++){var a=k*2*Math.PI/3+0.5,dx=-55*fl,dy=70*Math.sin(a),dz=30*Math.cos(a);D.line(cx,cy,cx+dx+dz*0.3,cy+dy,C.w,3);D.dot(cx+dx+dz*0.3,cy+dy,14,[C.f,C.hl,C.ok][k]);}
  D.dot(cx,cy,18,C.mut);D.text('C',cx,cy+6,{s:16,a:'center',c:C.bg,bold:true});
  D.line(nu,cy,cx,cy,C.m,2,u>0.3&&u<0.8?[5,4]:(u>=0.8?null:[2,6]),u>0.15?1:0.2);D.dot(nu,cy,20,C.m);D.text('Nu⁻',nu,cy+6,{s:15,a:'center',c:C.bg});
  D.line(cx,cy,lg,cy,C.g,2,u>0.4?[5,4]:null,u<0.8?1:0.15);D.dot(lg,cy,20,C.g);D.text(u>0.75?'Br⁻':'Br',lg,cy+6,{s:15,a:'center',c:C.bg});
  D.text(u<0.35?'ataque por detrás':(u<0.7?'estado de transición [Nu···C···Br]⁻':'inversión de la configuración'),W/2,450,{s:22,a:'center',c:C.m,bold:true});}));
/* T10 ley de Raoult y ascenso ebulloscópico */
function pv(T,x){return (1-x)*Math.exp(4890*(1/373.15-1/(T+273.15)));}function teb(x){return 1/(1/373.15+Math.log(1-x)/4890)-273.15;}
M.reg('qg-t10',M.curva({title:'Disoluciones: ley de Raoult y punto de ebullición',H:560,dur:18,p:[0,0.12],ax:{xr:[90,106],yr:[0.6,1.25],xt:[90,95,100,105],yt:[0.8,1,1.2],xd:0,yd:1,xl:'T (°C)',yl:'p (atm)'},h:300,ghost:false,
 curvas:[{f:function(T){return pv(T,0);},c:'f',w:2,fija:true},{f:function(T,x){return pv(T,x);},c:'m'}],
 extra:function(D,A,x){D.line(A.X(90),A.Y(1),A.X(106),A.Y(1),C.bad,1.4,[5,4]);D.text('1 atm',A.X(105.8),A.Y(1)-6,{s:13,c:C.bad,a:'right'});var tb=teb(x);D.dot(A.X(100),A.Y(1),5,C.f);D.dot(A.X(tb),A.Y(1),6,C.m);D.text('agua pura',A.X(92),A.Y(pv(92,0))-10,{s:14,c:C.f});},
 read:function(x){return ['fracción molar de soluto x_{s} = '+nf(x,3)+'    p = p°·(1 − x_{s})','T_{eb} = '+nf(teb(x),2)+' °C    ΔT_{eb} = '+nf(teb(x)-100,2)+' °C'];},
 caps:[[6,'Ley de Raoult: un soluto no volátil rebaja la presión de vapor del disolvente en proporción a su fracción molar: <i>p = p°·x<sub>disolvente</sub></i>.'],[12,'Como la curva de presión de vapor baja, la disolución necesita más temperatura para llegar a 1 atm: hierve más tarde.'],[99,'Es el ascenso ebulloscópico, <i>ΔT<sub>eb</sub> = K<sub>eb</sub>·m</i>: una propiedad coligativa, que solo depende del número de partículas de soluto.']]}));
})();
