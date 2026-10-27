/* game.js — estado, seed diário, validação, pintura, pontos (PRD §3 / Projeto §6) */
var Game = (function(){
  function norm(s){
    return (s||"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Z]/g,"");
  }
  function mulberry32(a){
    return function(){
      a|=0; a=a+0x6D2B79F5|0;
      var t=Math.imul(a^a>>>15,1|a);
      t=t+Math.imul(t^t>>>7,61|t)^t;
      return ((t^t>>>14)>>>0)/4294967296;
    };
  }
  function seedFromDate(d){
    d=d||new Date();
    return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
  }
  function normEntry(e){
    if(!e) return null;
    var key = e.key || e.k, display = e.display || e.d || key;
    if(typeof key!=="string") return null;
    return {key:key, display:display};
  }
  function listFor(cat, includeCustom){
    var raw = (typeof WORDS!=="undefined" && WORDS[cat]) ? WORDS[cat] : [];
    var base = raw.map(normEntry).filter(Boolean);
    // Palavras do professor: SÓ no modo Livre (diário usa base fixa p/ ser determinístico).
    // includeCustom default true p/ compat; dailyWord passa false.
    if(includeCustom===false) return base;
    try{
      var custom = Store.getCustom();
      custom.forEach(function(c){
        if(c.category===cat && /^[A-Z]{5}$/.test(c.key)){
          base.push({key:c.key, display:c.display||c.key});
          if(typeof window!=="undefined" && window.VALID) VALID.add(c.key);
        }
      });
    }catch(e){}
    return base;
  }
  function dailyWord(cat, dateObj){
    var list = listFor(cat, false);
    if(!list.length) return null;
    var rnd = mulberry32(seedFromDate(dateObj||new Date()));
    return list[Math.floor(rnd()*list.length)];
  }
  function randomWord(cat){
    var list = listFor(cat);
    if(!list.length) return null;
    return list[Math.floor(Math.random()*list.length)];
  }
  // Pintura 2 passadas (obrigatória p/ repetidas)
  function score(secret, guess){
    // secret, guess: strings 5 (keys sem acento)
    var s = secret.split(""), g = guess.split("");
    var res = ["absent","absent","absent","absent","absent"];
    var left = {};
    s.forEach(function(ch){ left[ch]=(left[ch]||0)+1; });
    for(var i=0;i<5;i++) if(g[i]===s[i]){ res[i]="correct"; left[g[i]]--; }
    for(var j=0;j<5;j++) if(res[j]!=="correct" && (left[g[j]]||0)>0){ res[j]="present"; left[g[j]]--; }
    return res;
  }
  function validate(w){
    if(!w || w.length<5) return {ok:false, msg:"Faltam letras. Complete 5 letras e pressione Confirmar."};
    if(w.length!==5) return {ok:false, msg:"Palpite deve ter 5 letras."};
    if(!VALID.has(w)) return {ok:false, msg:"Essa palavra não vale. Tente outra palavra."};
    return {ok:true};
  }
  function points(win, used, difficulty, streak){
    if(!win) return 0;
    var base = Math.max(0, 1000 - 150*(used-1));
    var bonus = (difficulty===6?200:(difficulty===4?400:0));
    return base + bonus + (streak||0)*10;
  }
  function coins(win, tries, used){
    if(!win) return 0;
    return 50 + 10*(tries-used);
  }
  var state = {
    cat:"animais", mode:"diario", dif:6, tries:6,
    secret:null, row:0, col:0, grid:[], over:false, win:false,
    historyGuesses:[] // strings
  };
  function newGame(cat, mode, dif){
    state.cat=cat; state.mode=mode; state.dif=dif; state.tries=dif;
    state.secret = (mode==="diario") ? dailyWord(cat) : randomWord(cat);
    state.row=0; state.col=0; state.over=false; state.win=false;
    state.historyGuesses=[];
    state.grid=[];
    for(var i=0;i<state.tries;i++) state.grid.push(["","","","",""]);
    return state;
  }
  return {
    norm:norm, mulberry32:mulberry32, seedFromDate:seedFromDate,
    listFor:listFor, dailyWord:dailyWord, randomWord:randomWord,
    score:score, validate:validate, points:points, coins:coins,
    state:state, newGame:newGame
  };
})();
