/* ui.js — render board/teclado/modal, ARIA live, HUD, loja, stats (evolução do proto-c) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var prefs = Store.load("prefs", Store.DEF.prefs);
var coins = Store.load("coins", Store.DEF.coins);
var streak = Store.load("streak", Store.DEF.streak);

var THEMES = [
  {id:"cyberpunk", name:"Cyberpunk", price:0, icon:"⚡", swatch:["#090a14", "#00f0ff", "#ff007f"]},
  {id:"dark",      name:"Midnight",  price:0, icon:"🌙", swatch:["#0a0f1d", "#38bdf8", "#10b981"]},
  {id:"light",     name:"Claro",     price:0, icon:"☀️", swatch:["#f8fafc", "#2563eb", "#059669"]},
  {id:"hc",        name:"Alto Contr.", price:0, icon:"👁️", swatch:["#000000", "#ffd60a", "#00ff66"]},
  {id:"oceano",    name:"Oceano",    price:200, icon:"🌊", swatch:["#031525", "#06b6d4", "#14b8a6"]},
  {id:"uva",       name:"Nebulosa",  price:350, icon:"🔮", swatch:["#110521", "#c084fc", "#f43f5e"]}
];

function applyPrefs(){
  document.documentElement.setAttribute("data-theme", prefs.theme||"dark");
  document.documentElement.classList.toggle("hc", prefs.theme==="hc");
  document.body.classList.toggle("nomotion", prefs.motion==="reduced");
  var hc=$("#hcBtn"), mo=$("#moBtn");
  if(hc) hc.setAttribute("aria-pressed", prefs.theme==="hc" ? "true":"false");
  if(mo) mo.setAttribute("aria-pressed", prefs.motion==="reduced" ? "true":"false");
  updateHUD();
  renderThemeStore();
  restoreSetup();
}
function savePrefs(){ Store.save("prefs", prefs); }

function updateHUD(){
  var c = Store.load("coins", Store.DEF.coins);
  var s = Store.load("streak", Store.DEF.streak);
  var ce = $("#coinCount"), se = $("#streakCount");
  if(ce) ce.textContent = c.balance||0;
  if(se) se.textContent = s.count||0;
}

/* ---------- acessibilidade: live + toast ---------- */
function say(m){
  var el=$("#live"); if(!el) return;
  el.textContent=""; // força reanúncio em SR mesmo se texto repetir
  requestAnimationFrame(function(){ el.textContent=m; });
}
function toast(m){
  var t=$("#toast"); if(!t) return;
  t.textContent=m; t.style.display="block"; say(m);
  clearTimeout(t._h); t._h=setTimeout(function(){ t.style.display="none"; },2600);
}
/* shake reutilizável, desligável em .nomotion */
function shakeRow(r){
  var row = document.querySelectorAll(".row")[r];
  if(!row) return;
  row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake");
}

/* ---------- sons WebAudio (P2, sem arquivos) ---------- */
var AC=null;
function beep(freq, dur, type, vol){
  // som independente de motion (prefs separadas; motion só desliga animação)
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    var o=AC.createOscillator(), g=AC.createGain();
    o.type=type||"sine"; o.frequency.value=freq||440;
    g.gain.value=vol||0.06;
    o.connect(g); g.connect(AC.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime+(dur||0.12));
    o.stop(AC.currentTime+(dur||0.12));
  }catch(e){}
}
function sndKey(){ beep(520,0.06,"square",0.03); }
function sndErr(){ beep(160,0.18,"sawtooth",0.05); }
function sndWin(){ beep(523,0.12,"sine",0.07); setTimeout(function(){beep(659,0.12,"sine",0.07);},120); setTimeout(function(){beep(784,0.2,"sine",0.07);},240); }

/* ---------- setup ---------- */
function wire(id, cb){
  var root=$(id); if(!root) return;
  root.querySelectorAll("button").forEach(function(b){
    b.onclick=function(){
      root.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed","false");});
      b.setAttribute("aria-pressed","true"); cb(b.dataset.v);
    };
  });
}
function restoreSetup(){
  setPressed("#modos", prefs.mode||"diario");
  setPressed("#cats", prefs.category||"animais");
  setPressed("#difs", String(prefs.difficulty||6));
}
function setPressed(sel, val){
  var root=$(sel); if(!root) return;
  root.querySelectorAll("button").forEach(function(b){
    b.setAttribute("aria-pressed", b.dataset.v==val ? "true":"false");
  });
}

/* ---------- loja de temas ---------- */
function renderThemeStore(){
  var box=$("#themeStore"); if(!box) return;
  var c = Store.load("coins", Store.DEF.coins);
  box.innerHTML="";
  THEMES.forEach(function(t){
    var b=document.createElement("button");
    var unlocked = (t.price===0) || ((c.unlocked||[]).indexOf(t.id)>=0);
    var isCurrent = prefs.theme===t.id;
    b.dataset.v=t.id;
    b.className = "theme-card-btn" + (isCurrent ? " is-active" : "") + (!unlocked ? " is-locked" : "");
    b.setAttribute("aria-pressed", isCurrent ? "true":"false");

    var swatchHtml = "<span class='swatch-strip' aria-hidden='true'>" +
      t.swatch.map(function(clr){ return "<span class='swatch-dot' style='background:"+clr+"'></span>"; }).join("") +
      "</span>";

    var tagText = unlocked ? (isCurrent ? "✓ Ativo" : (t.price===0 ? "Grátis" : "Liberado")) : (t.price + " 🪙");
    var tagClass = isCurrent ? "tag-active" : (unlocked ? "tag-free" : "tag-cost");

    b.innerHTML =
      "<div class='theme-btn-info'>" +
        "<span class='theme-name'><span aria-hidden='true'>" + t.icon + "</span> " + t.name + "</span>" +
        swatchHtml +
      "</div>" +
      "<span class='theme-tag " + tagClass + "'>" + (!unlocked ? "🔒 " : "") + tagText + "</span>";

    b.onclick=function(){
      var cur = Store.load("coins", Store.DEF.coins);
      var canUse = (t.price===0) || ((cur.unlocked||[]).indexOf(t.id)>=0);
      if(canUse){
        prefs.theme=t.id;
        if(t.id!=="hc") prefs.lastTheme=t.id;
        savePrefs(); applyPrefs(); say("Tema "+t.name+" ativado.");
      }else{
        if((cur.balance||0) >= t.price){
          cur.balance-=t.price;
          if(cur.unlocked.indexOf(t.id)===-1) cur.unlocked.push(t.id);
          Store.save("coins", cur);
          prefs.theme=t.id; prefs.lastTheme=t.id; savePrefs(); applyPrefs();
          toast("Tema "+t.name+" desbloqueado!");
        }else{
          toast("Faltam moedas. Você tem "+cur.balance+", precisa de "+t.price+".");
          sndErr();
        }
      }
    };
    box.appendChild(b);
  });
}

/* ---------- jogo ---------- */
function counter(){
  var s=Game.state;
  $("#counter").textContent="Tentativa "+Math.min(s.row+1,s.tries)+" de "+s.tries+" · "+labelCat(s.cat)+" · "+(s.mode==="diario"?"Diário":"Livre");
}
function labelCat(c){
  return {animais:"Animais",comidas:"Comidas",escola:"Escola",objetos:"Objetos"}[c]||c;
}
function buildBoard(){
  var s=Game.state, b=$("#board"); b.innerHTML="";
  for(var r=0;r<s.tries;r++){
    var d=document.createElement("div");
    d.className="row"; d.setAttribute("aria-label","Tentativa "+(r+1)+" de "+s.tries);
    for(var c=0;c<5;c++){
      var cell=document.createElement("div");
      cell.className="cell"+(r===0?" active":"");
      cell.id="c"+r+c; cell.tabIndex=-1;
      d.appendChild(cell);
    }
    b.appendChild(d);
  }
}
function buildKB(){
  var rows=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  var k=$("#kb"); k.innerHTML="";
  rows.forEach(function(r,i){
    var d=document.createElement("div"); d.className="krow";
    if(i===2) d.appendChild(mk("CONFIRMAR","wide","Confirmar palavra"));
    for(var j=0;j<r.length;j++) d.appendChild(mk(r[j],"","Tecla "+r[j]));
    if(i===2) d.appendChild(mk("APAGAR","wide","Apagar letra"));
    k.appendChild(d);
  });
}
function mk(label, cls, al){
  var b=document.createElement("button");
  b.className=("key "+cls).trim(); b.textContent=label;
  b.setAttribute("aria-label",al||label); b.dataset.k=label;
  b.onclick=function(){ press(label); };
  return b;
}
function press(k){
  var s=Game.state;
  if(s.over || $("#game").hidden) return;
  if(k==="CONFIRMAR") return submit();
  if(k==="APAGAR"){ if(s.col>0){ s.col--; s.grid[s.row][s.col]=""; draw(); sndKey(); } return; }
  if(/^[A-Z]$/.test(k)){
    if(s.col<5){ s.grid[s.row][s.col]=k; s.col++; draw(); sndKey(); }
  }
}
document.addEventListener("keydown", function(e){
  if($("#game").hidden) return;
  if(Game.state.over) return;
  // ignora atalhos com ctrl/alt
  if(e.ctrlKey||e.altKey||e.metaKey) return;
  var k=e.key.toUpperCase();
  // Evita Enter duplo: se foco está num botão, deixa o click nativo tratar
  if(k==="ENTER" && e.target && e.target.tagName==="BUTTON") return;
  if(k===" " && e.target && e.target.tagName==="BUTTON") return;
  if(k==="ENTER"){ e.preventDefault(); press("CONFIRMAR"); }
  else if(k==="BACKSPACE"){ e.preventDefault(); press("APAGAR"); }
  else if(/^[A-Z]$/.test(k)){ press(Game.norm(k)); }
});
function draw(){
  var s=Game.state;
  for(var c=0;c<5;c++){
    var el=document.getElementById("c"+s.row+c);
    if(el){
      var prev = el.textContent;
      var cur = s.grid[s.row][c]||"";
      el.textContent=cur;
      if(cur && !prev && prefs.motion!=="reduced"){
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
      }
    }
  }
  $$(".row").forEach(function(r,ri){
    Array.prototype.forEach.call(r.querySelectorAll(".cell"), function(x){
      x.classList.toggle("active", ri===s.row);
    });
  });
}
function submit(){
  var s=Game.state;
  var w=s.grid[s.row].join("");
  var v=Game.validate(w);
  if(!v.ok){ toast(v.msg); shakeRow(s.row); sndErr(); return; }
  // Calcula score SINCRONO (fonte da verdade p/ live/share/histórico).
  // paint() usa só p/ efeito visual; nunca ler DOM p/ lógica.
  var res=Game.score(s.secret.key, w);
  paint(w, res);
  var desc=w.split("").map(function(ch,i){
    var st=res[i];
    return ch+" "+(st==="correct"?"correta":st==="present"?"presente em outra posição":"ausente");
  }).join(", ");
  say("Tentativa "+(s.row+1)+": "+desc+".");
  s.historyGuesses.push({guess:w, res:res.slice()});
  if(w===s.secret.key) return finish(true);
  s.row++; s.col=0;
  if(s.row>=s.tries) return finish(false);
  counter();
}
function resOfRow(r){
  var out=[];
  for(var i=0;i<5;i++){ var el=document.getElementById("c"+r+i); out.push(el?el.dataset.st:"absent"); }
  return out;
}
var SYM={correct:"✓",present:"◐",absent:"×"};
var EMOJI={correct:"🟩",present:"🟨",absent:"⬛"};
function paint(w, resParam){
  var s=Game.state;
  var res=resParam || Game.score(s.secret.key, w);
  var g=w.split("");
  var curRow=s.row;
  for(var i=0;i<5;i++){
    (function(i){
      var el=document.getElementById("c"+curRow+i);
      if(!el) return;
      // dataset imediato p/ consistência (lógica nunca depende de animação)
      el.dataset.st=res[i];
      setTimeout(function(){
        el.classList.add(res[i]);
        el.innerHTML="<span>"+g[i]+"</span><span class='sym' aria-hidden='true'>"+SYM[res[i]]+"</span>";
        if(prefs.motion!=="reduced"){ el.classList.add("flip"); }
      }, prefs.motion==="reduced"?0:i*120);
    })(i);
  }
  // teclado (após animação p/ manter sincronia visual, mas atualiza já p/ leitor)
  setTimeout(function(){
    for(var k=0;k<5;k++){
      var keyBtn=null;
      $$(".key").forEach(function(b){ if(b.textContent===g[k]) keyBtn=b; });
      if(keyBtn){
        var cur=keyBtn.dataset.st||"";
        var pri={absent:0,present:1,correct:2};
        if((pri[res[k]]||0) > (pri[cur]===undefined? -1:pri[cur]||0) || !cur){
          keyBtn.classList.remove("correct","present","absent");
          keyBtn.classList.add(res[k]); keyBtn.dataset.st=res[k];
          keyBtn.setAttribute("aria-label","Tecla "+g[k]+", "+(res[k]==="correct"?"correta":res[k]==="present"?"presente":"ausente"));
        }
      }
    }
  }, prefs.motion==="reduced"?0:5*120);
}
function emojiGrid(){
  var s=Game.state;
  return s.historyGuesses.map(function(h){
    return h.res.map(function(r){ return EMOJI[r]; }).join("");
  }).join("\n");
}
function finish(win){
  var s=Game.state;
  s.over=true; s.win=win;
  // espera flip terminar antes do modal (acessibilidade + polish)
  setTimeout(function(){
    counter();
    var used = win ? s.row+1 : s.tries;
    var dateStr = Store.todayStr();
    var st = Store.load("streak", Store.DEF.streak);
    if(s.mode==="diario") st = Store.touchStreak(dateStr, win, s.cat);
    var pts = Game.points(win, used, s.dif, st.count||0);
    var cns = Game.coins(win, s.tries, used);
    if(win || s.mode==="diario"){ /* derrota diária também zera streak já feito acima */ }
    Store.bumpStats(s.cat, win, used);
    if(cns>0) Store.addCoins(cns);
    Store.addHistory({date:dateStr, category:s.cat, tries:used, win:win, difficulty:s.dif, mode:s.mode});
    updateHUD(); renderStats(); renderHistory();
    if(win) sndWin(); else sndErr();
    showEnd(win, used, pts, cns, st.count||0);
  }, prefs.motion==="reduced"?50:650);
}
function showEnd(win, used, pts, cns, streakCount){
  var s=Game.state;
  var e=$("#end");
  var def = (typeof DEFINITIONS!=="undefined" && DEFINITIONS[s.secret.key]) ? "<p class='def'>💡 "+DEFINITIONS[s.secret.key]+"</p>" : "";
  var grid = emojiGrid();
  var nextIn = s.mode==="diario" ? "<p class='muted'>Próxima palavra diária em <strong id='cd'>--:--:--</strong></p>" : "";
  e.hidden=false; e.style.display="block";
  e.innerHTML=
    "<div class='card' role='document'>"+
    "<h2 id='endTitle'>"+(win?"🎉 Você acertou!":"😞 Não foi dessa vez")+"</h2>"+
    "<p class='answer'>A palavra era <strong>"+s.secret.display+"</strong></p>"+def+
    "<p>"+(win?("Em "+used+" de "+s.tries+" tentativa(s)."):"Sem tentativas restantes.")+"</p>"+
    "<div class='statrow'><div><span>Pontos</span><strong>"+pts+"</strong></div>"+
    "<div><span>Moedas</span><strong>+"+cns+" 🪙</strong></div>"+
    "<div><span>Streak</span><strong>"+streakCount+" 🔥</strong></div></div>"+
    (grid?("<pre class='emoji' aria-label='Resultado em emojis'>"+grid+"</pre>"):"")+
    nextIn+
    "<div class='btnrow'><button class='cta' id='shareBtn'>📤 Compartilhar</button>"+
    "<button class='ghost' id='againBtn'>Jogar de novo</button>"+
    "<button class='ghost' id='swapBtn'>Trocar categoria</button></div>"+
    "</div>";
  say(win?("Vitória! A palavra era "+s.secret.display+". "+pts+" pontos.") : ("Derrota. A palavra era "+s.secret.display+"."));
  $("#againBtn").onclick=function(){
    e.hidden=true; e.style.display="none";
    startGame(s.cat, s.mode, s.dif);
  };
  $("#swapBtn").onclick=function(){
    e.hidden=true; e.style.display="none";
    $("#game").hidden=true; $("#setup").hidden=false;
    $("#play").focus();
  };
  $("#shareBtn").onclick=function(){ shareResult(win, used, pts, grid); };
  tickCountdown();
  // foco p/ acessibilidade
  var f=e.querySelector("button"); if(f) f.focus();
}
function shareResult(win, used, pts, grid){
  var s=Game.state;
  var txt="TERMO C · "+labelCat(s.cat)+" · "+(s.mode==="diario"?"Diário":"Livre")+" · "+
    (win?("acertei em "+used+"/"+s.tries+" ("+pts+" pts)"):("não acertei ("+s.secret.display+")"))+
    "\n"+grid+"\nJogue o Termo acessível!";
  function fallback(){
    try{
      var ta=document.createElement("textarea");
      ta.value=txt; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      toast("Resultado copiado! Cole onde quiser.");
    }catch(err){ toast("Copie manualmente: "+txt); }
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){ toast("Resultado copiado! Cole onde quiser."); }, fallback);
  }else fallback();
}
var __cdIv=null;
function tickCountdown(){
  var el=document.getElementById("cd"); if(!el) return;
  if(__cdIv){ clearInterval(__cdIv); __cdIv=null; }
  function pad(n){ return (n<10?"0":"")+n; }
  function upd(){
    var cd=document.getElementById("cd");
    if(!cd){ if(__cdIv){clearInterval(__cdIv);__cdIv=null;} return; }
    var now=new Date(), mid=new Date(now); mid.setDate(mid.getDate()+1); mid.setHours(0,0,0,0);
    var ms=mid-now, s=Math.floor(ms/1000);
    var h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
    cd.textContent=pad(h)+":"+pad(m)+":"+pad(ss);
  }
  upd(); __cdIv=setInterval(upd,1000);
}

/* ---------- stats / history ---------- */
function renderStats(){
  var box=$("#statsBox"); if(!box) return;
  var st=Store.load("stats", Store.DEF.stats);
  var pct = st.games? Math.round(100*(st.wins||0)/st.games):0;
  var avg = st.wins? (st.totalTries/st.wins).toFixed(1):"—";
  box.innerHTML="<div class='statrow'>"+
    "<div><span>Jogos</span><strong>"+(st.games||0)+"</strong></div>"+
    "<div><span>Vitórias</span><strong>"+(st.wins||0)+"</strong></div>"+
    "<div><span>% vitória</span><strong>"+pct+"%</strong></div>"+
    "<div><span>Média tent.</span><strong>"+avg+"</strong></div></div>"+
    "<p class='muted'>Por categoria: "+Object.keys(st.byCategory||{}).map(function(k){
      var v=st.byCategory[k]; return labelCat(k)+" "+v.wins+"/"+v.games;
    }).join(" · ")+"</p>";
}
function renderHistory(){
  var box=$("#histBox"); if(!box) return;
  var h=Store.load("history", []);
  if(!h.length){ box.innerHTML="<p class='muted'>Nenhuma partida ainda.</p>"; return; }
  box.innerHTML="<ul>"+h.slice(0,10).map(function(x){
    return "<li>"+(x.win?"✅":"❌")+" "+x.date+" · "+labelCat(x.category)+" · "+x.mode+" · "+x.tries+" tent. · Nível "+x.difficulty+"</li>";
  }).join("")+"</ul>";
}

/* ---------- professor (P2 RF19) ---------- */
function wireProfessor(){
  var btn=$("#addWordBtn"); if(!btn) return;
  btn.onclick=function(){
    var raw=$("#newWord").value||"", cat=$("#newCat").value||"animais";
    var key=Game.norm(raw);
    var display=(raw||"").toUpperCase().trim();
    if(!/^[A-Z]{5}$/.test(key)){ toast("Digite uma palavra de 5 letras (sem número). Digite sem acento; exibimos com acento."); sndErr(); return; }
    // evita duplicar secretas existentes em qualquer categoria + customs + VALID
    var dup=false;
    Object.keys(WORDS).forEach(function(c){ WORDS[c].forEach(function(e){ if((e.key||e.k)===key) dup=true; }); });
    try{
      Store.getCustom().forEach(function(c){ if(c.key===key) dup=true; });
      if(window.VALID && VALID.has(key)) dup=true;
    }catch(e){}
    if(dup){ toast("Essa palavra já existe no banco."); sndErr(); return; }
    if(!display) display=key;
    var r=Store.addCustom(key, display, cat);
    if(!r.ok){ toast("Essa palavra já foi adicionada antes."); return; }
    if(window.VALID) VALID.add(key);
    $("#newWord").value="";
    toast("Palavra "+display+" adicionada em "+labelCat(cat)+"! (vale no modo Livre)");
    say("Palavra adicionada.");
  };
}

/* ---------- start ---------- */
function startGame(cat, mode, dif){
  if(__cdIv){ clearInterval(__cdIv); __cdIv=null; }
  Game.newGame(cat, mode, dif);
  prefs.category=cat; prefs.mode=mode; prefs.difficulty=dif; savePrefs();
  $("#setup").hidden=true; $("#end").hidden=true; $("#end").style.display="none";
  $("#game").hidden=false;
  buildBoard(); buildKB(); counter();
  say("Jogo iniciado. Categoria "+labelCat(cat)+". "+dif+" tentativas. Digite 5 letras sem acento.");
  // Move foco p/ região do jogo (só-teclado + SR). counter é focável via tabindex.
  var c=$("#counter");
  if(c){ c.setAttribute("tabindex","-1"); c.focus({preventScroll:true}); }
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", function(){
  var cat=prefs.category||"animais", mode=prefs.mode||"diario", dif=prefs.difficulty||6;
  wire("#cats", function(v){ cat=v; prefs.category=v; savePrefs(); });
  wire("#modos", function(v){ mode=v; prefs.mode=v; savePrefs(); });
  wire("#difs", function(v){ dif=+v; prefs.difficulty=dif; savePrefs(); });
  setPressed("#cats",cat); setPressed("#modos",mode); setPressed("#difs",String(dif));

  var hc=$("#hcBtn"), mo=$("#moBtn");
  if(hc) hc.onclick=function(e){
    if(prefs.theme==="hc"){
      prefs.theme=prefs.lastTheme||"dark";
    }else{
      prefs.lastTheme=prefs.theme||"dark";
      prefs.theme="hc";
    }
    savePrefs(); applyPrefs();
    say(prefs.theme==="hc"?"Alto contraste ligado.":"Alto contraste desligado.");
  };
  if(mo) mo.onclick=function(e){
    prefs.motion = (prefs.motion==="reduced"?"full":"reduced");
    savePrefs(); applyPrefs();
    say(prefs.motion==="reduced"?"Animações desligadas.":"Animações ligadas.");
  };
  var how=$("#how");
  if(how) how.onclick=function(){
    say("Verde com símbolo check significa letra certa no lugar certo. Laranja com meio círculo significa letra certa em outra posição. Cinza com X significa que a letra não existe na palavra. Digite sem acento.");
    toast("✓ lugar certo · ◐ outra posição · × não tem (digite sem acento)");
  };
  var play=$("#play");
  if(play) play.onclick=function(){
    // lê estado atual dos aria-pressed (fonte da verdade = DOM)
    var c=(document.querySelector("#cats [aria-pressed='true']")||{}).dataset?.v||cat;
    var m=(document.querySelector("#modos [aria-pressed='true']")||{}).dataset?.v||mode;
    var d=+((document.querySelector("#difs [aria-pressed='true']")||{}).dataset?.v||dif);
    startGame(c,m,d);
  };
  var quit=$("#quitBtn");
  if(quit) quit.onclick=function(){
    var s=Game.state;
    // Evita evadir streak: desistir no Diário com jogo em andamento conta como derrota
    if(!s.over && s.mode==="diario" && (s.row>0 || s.col>0)){
      if(confirm("Desistir conta como derrota no modo Diário. Continuar?")){
        if(__cdIv){ clearInterval(__cdIv); __cdIv=null; }
        s.over=true;
        var dateStr=Store.todayStr();
        Store.touchStreak(dateStr, false, s.cat);
        Store.bumpStats(s.cat, false, s.tries);
        Store.addHistory({date:dateStr, category:s.cat, tries:s.row+1, win:false, difficulty:s.dif, mode:s.mode, quit:true});
        updateHUD(); renderStats(); renderHistory();
        toast("Desistência registrada como derrota. A palavra era "+(s.secret?s.secret.display:"—"));
      } else return;
    }
    $("#game").hidden=true; $("#end").hidden=true; $("#end").style.display="none";
    $("#setup").hidden=false; $("#play").focus();
  };
  var wipe=$("#wipeBtn");
  if(wipe) wipe.onclick=function(){
    if(confirm("Apagar todos os dados locais (pontos, moedas, histórico)?")){
      Store.resetAll();
      prefs=Store.load("prefs",Store.DEF.prefs);
      applyPrefs(); renderStats(); renderHistory(); updateHUD();
      toast("Dados apagados.");
    }
  };
  wireProfessor();
  applyPrefs(); renderStats(); renderHistory();
  // expõe p/ testes manuais
  window.__game=Game; window.__store=Store;
});
})();
