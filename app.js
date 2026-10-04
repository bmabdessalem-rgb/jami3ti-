'use strict';
// AI_URL: اربط المساعد بخادم متاعك (POST {q,lang} -> {a}). فارغ = ردود تجريبية.
const AI_URL='';
const T={
ar:{home:'الرئيسية',stages:'ستاجات',diar:'ديار',archive:'الأرشيف',ai:'المساعد',plan:'تنظيمي',pick:'اختر لغتك',cont:'متابعة',signup:'إنشاء حساب',name:'الاسم الكامل',email:'إيميل الجامعة',fac:'الكلية',lvl:'المستوى',pass:'كلمة السر',create:'إنشاء الحساب',hi:'مرحبا',all:'الكل',save:'احفظ',saved:'محفوظ',apply:'قدّم',applied:'تم التقديم',search:'ابحث...',explain:'اشرح بـAI',ask:'اكتب سؤالك...',send:'ابعث',today:'جدول اليوم',tasks:'المهام',addt:'أضف مهمة...',budget:'ميزانية الشهر',lang:'اللغة',reset:'مسح البيانات',demo:'نسخة تجريبية: ردود المساعد محاكاة.',r0:'نعاونك في الستاجات والديار والدفوارات والتنظيم. اسألني.',r1:'شوف تبويب ستاجات، وخصّص الـCV لكل عرض.',r2:'في تبويب ديار اعمل فلتر تحت 400 باش تلقى الأرخص.',r3:'جرّب تمرين من DS 2023 وبعد قارن مع التصحيح في الأرشيف.'},
fr:{home:'Accueil',stages:'Stages',diar:'Logements',archive:'Archives',ai:'Assistant',plan:'Planning',pick:'Choisissez votre langue',cont:'Continuer',signup:'Créer un compte',name:'Nom complet',email:'Email universitaire',fac:'Faculté',lvl:'Niveau',pass:'Mot de passe',create:'Créer le compte',hi:'Bonjour',all:'Tous',save:'Enregistrer',saved:'Enregistré',apply:'Postuler',applied:'Postulé',search:'Rechercher...',explain:'Expliquer (IA)',ask:'Votre question...',send:'Envoyer',today:"Aujourd'hui",tasks:'Tâches',addt:'Ajouter une tâche...',budget:'Budget du mois',lang:'Langue',reset:'Effacer les données',demo:'Version démo : réponses simulées.',r0:'Je vous aide pour stages, logements, archives et organisation.',r1:"Voyez l'onglet Stages et adaptez votre CV à chaque offre.",r2:'Dans Logements, filtrez à moins de 400 TND.',r3:'Essayez un exercice du DS 2023, puis comparez avec la correction.'},
en:{home:'Home',stages:'Internships',diar:'Housing',archive:'Archive',ai:'Assistant',plan:'Planner',pick:'Choose your language',cont:'Continue',signup:'Create account',name:'Full name',email:'University email',fac:'Faculty',lvl:'Level',pass:'Password',create:'Create account',hi:'Hello',all:'All',save:'Save',saved:'Saved',apply:'Apply',applied:'Applied',search:'Search...',explain:'Explain (AI)',ask:'Ask a question...',send:'Send',today:'Today',tasks:'Tasks',addt:'Add a task...',budget:'Monthly budget',lang:'Language',reset:'Erase data',demo:'Demo version: replies are simulated.',r0:'I can help with internships, housing, the archive and planning.',r1:'Check the Internships tab and tailor your CV to each offer.',r2:'In Housing, filter under 400 TND.',r3:'Try an exercise from DS 2023, then compare with the correction.'}};
const D={
stages:[{i:'s1',t:'Stage développement web',m:'[Entreprise] · Tunis · 3 mois',k:'summer'},{i:'s2',t:'Stage réseaux et sécurité',m:'[Entreprise] · Remote · 2 mois',k:'remote'},{i:'s3',t:'PFE · Intelligence artificielle',m:'[Entreprise] · Sfax · 6 mois',k:'pfe'}],
diar:[{i:'d1',t:'Studio meublé',m:'8 min à pied · WiFi',p:350,k:'furn'},{i:'d2',t:'Chambre en colocation',m:'12 min en bus',p:220,k:'shared'},{i:'d3',t:'S+1 près de la faculté',m:'5 min à pied',p:480,k:''}],
arch:[{i:1,s:'Algorithmique',y:2024,k:'DS',c:1},{i:2,s:"Systèmes d'exploitation",y:2023,k:'Examen',c:1},{i:3,s:'Réseaux',y:2024,k:'TP',c:0},{i:4,s:'Logique',y:2023,k:'DS',c:1},{i:5,s:'Analyse',y:2022,k:'Examen',c:1}],
sch:[['08:30','Algorithmique · A3'],['10:30','Réseaux · B12'],['14:00',"TP Systèmes d'exploitation · Lab 2"]]};
const CH={stages:[['all'],['pfe','PFE'],['summer','Été'],['remote','Remote']],diar:[['all'],['cheap','≤ 400 TND'],['furn','Meublé'],['shared','Colocation']],arch:[['all'],['DS','DS'],['Examen','Examen'],['TP','TP']]};
const LG=[['ar','العربية'],['fr','Français'],['en','English']],K='jm1',$=s=>document.querySelector(s);
let S={lang:'ar',user:null,saved:[],applied:[],tasks:[{t:'TP Réseaux',x:0},{t:'Révision Logique',x:0},{t:'CV',x:1}],chat:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
let V=S.user?'home':'lang',F='all',Q='';
const t=k=>(T[S.lang]||T.ar)[k]||k;
const put=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const tog=(a,v)=>{const i=a.indexOf(v);i<0?a.push(v):a.splice(i,1)};
const chips=v=>`<div class="ch">${CH[v].map(([k,l])=>`<button class="g${F==k?' s':''}" data-a="f" data-v="${k}">${k=='all'?t('all'):l}</button>`).join('')}</div>`;
const langs=c=>LG.map(([a,n])=>`<button class="${c}${S.lang==a?' s':''}" data-a="L" data-v="${a}">${n}</button>`).join('');
const arc=()=>D.arch.filter(x=>(F=='all'||x.k==F)&&x.s.toLowerCase().includes(Q.toLowerCase())).map(x=>`<div class="k r q"><div><b>${x.s} · ${x.k} ${x.y}</b>${x.c?'<div class="t">Correction ✓</div>':''}</div><button class="g" data-a="ex" data-v="${x.i}">${t('explain')}</button></div>`).join('');
const sched=n=>D.sch.slice(0,n).map(s=>`<div class="r q"><span>${s[1]}</span><span class="t">${s[0]}</span></div>`).join('');
const W={
lang:()=>`<div class="b"><h1>${t('pick')}</h1>${langs('l')}<button class="a" style="margin-top:auto" data-a="go" data-v="signup">${t('cont')}</button></div>`,
signup:()=>`<form class="b" id="su"><h1>${t('signup')}</h1><label>${t('name')}<input name="n" required autocomplete="name"></label><label>${t('email')}<input name="e" type="email" required></label><label>${t('fac')}<input name="f"></label><label>${t('lvl')}<select name="v"><option>L1<option>L2<option>L3<option>Master</select></label><label>${t('pass')}<input type="password" minlength="6" required autocomplete="new-password"></label><button class="a">${t('create')}</button></form>`,
home:()=>`<div class="b"><div><div class="t">${t('hi')}</div><h1>${esc(S.user.n)}</h1></div><div class="gr">${['stages','diar','archive','ai'].map(k=>`<button class="k tl" data-a="go" data-v="${k}">${t(k)}</button>`).join('')}</div><div class="k"><b>${t('today')}</b>${sched(2)}</div><button class="k r" data-a="go" data-v="plan"><b>${t('tasks')}</b><span class="g">${S.tasks.filter(x=>!x.x).length}</span></button><div class="t">${t('lang')}</div><div class="ch">${langs('g')}</div><button class="o" data-a="rs">${t('reset')}</button></div>`,
stages:()=>`<div class="b"><h1>${t('stages')}</h1>${chips('stages')}${D.stages.filter(x=>F=='all'||x.k==F).map(x=>`<div class="k"><b>${x.t}</b><div class="t">${x.m}</div><div class="r q"><button class="a" style="flex:1" data-a="ap" data-v="${x.i}">${S.applied.includes(x.i)?t('applied'):t('apply')}</button><button class="o" data-a="sv" data-v="${x.i}">${S.saved.includes(x.i)?t('saved'):t('save')}</button></div></div>`).join('')}</div>`,
diar:()=>`<div class="b"><h1>${t('diar')}</h1>${chips('diar')}${D.diar.filter(x=>F=='all'||(F=='cheap'?x.p<400:x.k==F)).map(x=>`<div class="k"><div class="r"><b>${x.t}</b><b style="color:#1F3BB3">${x.p} TND</b></div><div class="t">${x.m}</div><button class="o q" data-a="sv" data-v="${x.i}">${S.saved.includes(x.i)?t('saved'):t('save')}</button></div>`).join('')}</div>`,
archive:()=>`<div class="b"><h1>${t('archive')}</h1><input id="q" placeholder="${t('search')}" value="${esc(Q)}">${chips('arch')}<div id="L">${arc()}</div></div>`,
ai:()=>`<div class="b"><h1>${t('ai')}</h1><div class="t">${t('demo')}</div><div id="C">${S.chat.map(m=>`<div class="m ${m.r}">${esc(m.x)}</div>`).join('')}</div><form id="cf" class="r" style="margin-top:auto"><input name="q" placeholder="${t('ask')}" autocomplete="off"><button class="a">${t('send')}</button></form></div>`,
plan:()=>`<div class="b"><h1>${t('plan')}</h1><div class="k"><b>${t('today')}</b>${sched(3)}</div><div class="k"><b>${t('tasks')}</b>${S.tasks.map((x,i)=>`<div class="c"><input type="checkbox" id="k${i}" data-a="tk" data-v="${i}"${x.x?' checked':''}><label for="k${i}">${esc(x.t)}</label><button class="g" data-a="dl" data-v="${i}">×</button></div>`).join('')}<form id="tf" class="r q"><input name="t" placeholder="${t('addt')}" required><button class="a">+</button></form></div><div class="k"><div class="r"><b>${t('budget')}</b><span class="t">480 / 600 TND</span></div><div class="bar"><i></i></div></div></div>`};
const nav=()=>`<nav class="n">${['home','stages','diar','archive','ai','plan'].map(k=>`<button class="${V==k?'on':''}" data-a="go" data-v="${k}">${t(k)}</button>`).join('')}</nav>`;
function draw(top){const y=scrollY,h=document.documentElement;h.lang=S.lang;h.dir=S.lang=='ar'?'rtl':'ltr';$('#app').innerHTML=W[V]()+(S.user&&V!='lang'&&V!='signup'?nav():'');scrollTo(0,top?0:y)}
async function send(q){
S.chat.push({r:'u',x:q});V='ai';draw();let a;
if(AI_URL)try{a=(await(await fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q,lang:S.lang})})).json()).a}catch(e){}
a=a||t(/stage|ستاج|intern/i.test(q)?'r1':/dar|دار|ديار|كراء|loyer|logement|rent|housing/i.test(q)?'r2':/\bds\b|exam|devoir|دفوار|تمرين|\btp\b|اشرح|expliq|explain/i.test(q)?'r3':'r0');
S.chat.push({r:'z',x:a});put();draw();scrollTo(0,document.body.scrollHeight)}
const A={go:v=>{V=v;F='all';Q=''},L:v=>{S.lang=v},f:v=>{F=v},sv:v=>tog(S.saved,v),ap:v=>tog(S.applied,v),tk:i=>{S.tasks[i].x^=1},dl:i=>{S.tasks.splice(i,1)},
ex:i=>{const x=D.arch.find(y=>y.i==i);send(`${t('explain')}: ${x.s} ${x.k} ${x.y}`)},
rs:()=>{if(confirm(t('reset')+'?')){localStorage.removeItem(K);location.reload()}}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;A[b.dataset.a](b.dataset.v);put();draw(b.dataset.a=='go')});
document.addEventListener('input',e=>{if(e.target.id=='q'){Q=e.target.value;$('#L').innerHTML=arc()}});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=new FormData(f),id=f.id;
if(id=='su'){S.user={n:d.get('n').trim(),e:d.get('e'),f:d.get('f'),v:d.get('v')};V='home'}
else if(id=='tf'){const x=d.get('t').trim();if(x)S.tasks.push({t:x,x:0})}
else if(id=='cf'){const q=d.get('q').trim();if(q)send(q);return}
put();draw(id=='su')});
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
draw(true);
