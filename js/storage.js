/* storage.js — wrapper localStorage prefixo termo: (PRD §6 / Projeto §5.2) */
var Store = (function(){
  var P = "termo:";
  function load(k, fb){
    try{
      var raw = localStorage.getItem(P+k);
      if(raw==null) return JSON.parse(JSON.stringify(fb));
      var data = JSON.parse(raw);
      if(k==="coins" && data && Array.isArray(data.unlocked)){
        if(data.unlocked.indexOf("cyberpunk")===-1) data.unlocked.push("cyberpunk");
      }
      return data;
    }catch(e){ return JSON.parse(JSON.stringify(fb)); }
  }
  function save(k, v){
    try{ localStorage.setItem(P+k, JSON.stringify(v)); }catch(e){ /* quota */}
  }
  var DEF = {
    prefs:   { theme:"dark", motion:"full", category:"animais", difficulty:6, mode:"diario", lastTheme:"dark" },
    stats:   { games:0, wins:0, totalTries:0, byCategory:{}, lastWin:"" },
    streak:  { count:0, lastDailyDate:"", lastWin:"", played:{}, byCategory:{} },
    coins:   { balance:0, unlocked:["cyberpunk","dark","light","hc"] },
    history: [],
    custom:  []  // [{key,display,category}]
  };
  function todayStr(d){
    d = d||new Date();
    var m = ""+(d.getMonth()+1), day=""+d.getDate();
    if(m.length<2)m="0"+m; if(day.length<2)day="0"+day;
    return d.getFullYear()+"-"+m+"-"+day;
  }
  function yesterdayStr(){
    var d=new Date(); d.setDate(d.getDate()-1); return todayStr(d);
  }
  function addHistory(e){
    var h = load("history", []);
    h.unshift(e);
    if(h.length>30) h.length=30;
    save("history", h);
  }
  // streak: só Diário conta. 1 válida por dia POR CATEGORIA (PRD §3.5).
  // Rejogar mesma categoria no mesmo dia não soma nem quebra.
  // Perder depois de já ter vencido hoje não zera (protege replay).
  // played: {"YYYY-MM-DD|cat":"win"|"loss"} ; byCategory:{cat:{count,lastDate}}
  function touchStreak(dateStr, win, cat){
    var s = load("streak", DEF.streak);
    s.played = s.played||{}; s.byCategory = s.byCategory||{};
    cat = cat||"geral";
    var k = dateStr+"|"+cat;
    if(s.played[k]){ return s; } // já jogou essa categoria hoje: ignora
    s.played[k] = win ? "win" : "loss";
    // limpa jogadas com +7 dias p/ não inflar
    try{
      var keys = Object.keys(s.played);
      if(keys.length>40){
        keys.sort();
        while(Object.keys(s.played).length>30) delete s.played[keys.shift()];
      }
    }catch(e){}
    if(win){
      // categoria
      var bc = s.byCategory[cat]||{count:0,lastDate:""};
      if(bc.lastDate!==dateStr){
        var yd = yesterdayStr();
        bc.count = (bc.lastDate===yd || bc.lastDate==="") ? (bc.count||0)+1 : 1;
        bc.lastDate = dateStr;
      }
      s.byCategory[cat]=bc;
      // global: 1x por dia (não duplica se 2ª categoria vencer no mesmo dia)
      if(s.lastWin===dateStr){ /* já venceu hoje, mantém */ }
      else if(s.lastDailyDate===yesterdayStr() || s.lastDailyDate==="" || s.count===0){
        // se pulou dias e count>0, reinicia em 1; se sequência, +1
        if(s.lastDailyDate!=="" && s.lastDailyDate!==yesterdayStr() && s.lastDailyDate!==dateStr) s.count=1;
        else s.count=(s.count||0)+1;
      } else if(s.lastDailyDate!==dateStr){
        s.count=(s.count||0)+1;
      }
      s.lastDailyDate = dateStr;
      s.lastWin = dateStr;
    }else{
      // loss: zera categoria
      var bl = s.byCategory[cat]||{count:0,lastDate:""};
      bl.count=0; bl.lastDate=dateStr; s.byCategory[cat]=bl;
      // global: se já venceu hoje em outra categoria, NÃO zera (rejogar não quebra)
      if(s.lastWin===dateStr){ /* protege */ }
      else { s.count=0; }
      s.lastDailyDate = dateStr;
    }
    save("streak", s);
    return s;
  }
  function bumpStats(cat, win, used){
    var st = load("stats", DEF.stats);
    st.games=(st.games||0)+1;
    if(win){ st.wins=(st.wins||0)+1; st.totalTries=(st.totalTries||0)+used; st.lastWin=todayStr(); }
    st.byCategory = st.byCategory||{};
    st.byCategory[cat]=st.byCategory[cat]||{games:0,wins:0};
    st.byCategory[cat].games++;
    if(win) st.byCategory[cat].wins++;
    save("stats", st);
    return st;
  }
  function addCoins(n){
    var c = load("coins", DEF.coins);
    c.balance=(c.balance||0)+n;
    save("coins", c);
    return c;
  }
  function resetAll(){
    Object.keys(DEF).forEach(function(k){
      try{ localStorage.removeItem(P+k); }catch(e){}
    });
  }
  function getCustom(){ return load("custom", []); }
  function addCustom(key, display, category){
    var c = getCustom();
    // evita duplicar key (retorna {ok:false} p/ UI avisar)
    for(var i=0;i<c.length;i++) if(c[i].key===key) return {ok:false, list:c};
    c.push({key:key, display:display, category:category});
    save("custom", c);
    return {ok:true, list:c};
  }
  return {
    load:load, save:save, DEF:DEF,
    todayStr:todayStr, yesterdayStr:yesterdayStr,
    addHistory:addHistory, touchStreak:touchStreak,
    bumpStats:bumpStats, addCoins:addCoins,
    resetAll:resetAll, getCustom:getCustom, addCustom:addCustom
  };
})();
