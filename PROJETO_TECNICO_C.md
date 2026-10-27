# Projeto Técnico — Jogo Termo 5 Letras | Design C (Premium Acessível)

**Base:** `PRD.md v1.0` + `prototipos/proto-c-acessivel.html` (escolhido pelo cliente)
**Stack:** HTML + CSS + JS puro, sem libs, sem backend. Persistência `localStorage`. Funciona com `file://`.
**Meta:** transformar o mockup C em jogo final completo (P0+P1), mantendo identidade dark navy + acessibilidade exemplar.

---

## 1. Decisão de design (por que o C)

| Critério | A Clássico | B Lúdico | **C Acessível (escolhido)** |
|---|---|---|---|
| Apelo escolar | médio | alto | alto (clareza = nota) |
| Acessibilidade | básica | básica | **WCAG 2.2 AA, daltônico-safe** |
| Código p/ avaliação | limpo | médio (muitas sombras) | limpo + semântico |
| Diferencial | nenhum | visual infantil | **inclusão + alto contraste** |

C vence porque demonstra domínio de ARIA, contraste, teclado e responsivo — exatamente o que professor de Web III avalia — sem perder gamificação (pontos/moedas/streak mantidos, só com visual sóbrio).

---

## 2. Arquitetura de arquivos (final)

```
JOGO firebase/
├── PRD.md
├── PROJETO_TECNICO_C.md      ← este documento
├── index.html                ← jogo final (evolução do proto-c)
├── css/
│   └── style.css             ← design system C extraído do <style> inline
├── js/
│   ├── words.js              ← banco 4×100 + VALID
│   ├── storage.js            ← wrapper localStorage prefixo termo:
│   ├── game.js               ← estado, seed diário, validação, pintura
│   └── ui.js                 ← render board/teclado/modal, ARIA live
└── prototipos/               ← mockups A/B/C + hub (referência)
```

**Por que separar:** RNF05 do PRD exige 4 arquivos para avaliação; separar CSS/JS facilita correção e demonstra modularização. `index.html` final importa os 4 via `<link>`/`<script>` (ordem: words → storage → game → ui). Zero build.

---

## 3. Design system C (tokens congelados)

```css
:root{
  --bg:#0B1220; --surface:#1E293B; --ink:#F8FAFC;
  --gold:#FBBF24;               /* CTA, foco, ativo */
  --correct:#22C55E;            /* verde + ✓ branco */
  --present:#F59E0B;            /* laranja + texto #000 + listras */
  --absent:#475569;             /* cinza + × branco */
  --focus:#FBBF24;
  --radius:12px; --font:Inter,-apple-system,'Segoe UI',Roboto,sans-serif;
}
.hc{ /* alto contraste forçado */
  --bg:#000; --surface:#000; --ink:#fff; --gold:#FFD60A;
  --correct:#00A000; --present:#B88600; --absent:#333;
}
```

- **Tipografia:** base 18px, `line-height:1.5`, tiles 30–32px/800, teclado 17px/800, labels uppercase `letter-spacing:.08em`.
- **Componentes:**
  - `.card` — `background:surface, border:2px ink, radius:12px, padding:14px`.
  - `.cell` 60×60 (52px ≤400px), vazia `border:2px ink`, ativa `border:3px gold`, correta/presente/ausente com **cor + símbolo + (presente) listras** `repeating-linear-gradient(45deg,transparent 0 6px,rgba(0,0,0,.18) 6px 8px)`.
  - `.key` min 56×40px, `touch-action:manipulation`, wide (CONFIRMAR/APAGAR) 1.7× com **texto, não só ícone**.
  - `.cta` 56px altura, gold + texto preto, radius 12px.
  - `:focus-visible { outline:3px solid var(--focus); outline-offset:2px }` — nunca remover.
- **Legenda permanente** acima do board: `✓ lugar certo | ◐ outra posição | × não tem` (exigência daltônicos, painel A11y).
- **Toggles header:** `[Alto contraste]` + `[Sem animação]` com `aria-pressed`, persistidos em prefs.

---

## 4. Estrutura HTML final (semântica + ARIA)

```html
<a class="skip" href="#kb">Pular para o teclado</a>
<div id="live" role="status" aria-live="polite" aria-atomic="true"></div>
<header> h1 + toggles </header>
<main>
  <section id="setup"> ol.steps + 3 .card (modo/categoria/nível) + button.cta#play + button#how </section>
  <section id="game" hidden>
    <p id="counter">Tentativa 1 de 6</p>
    <div class="legend" aria-hidden="true">…badges…</div>
    <div id="toast" role="alert"></div>
    <div id="board" role="group" aria-label="Tentativas"> .row[role=row][aria-label="Tentativa X de N"] > .cell </div>
    <div id="kb" aria-label="Teclado do jogo"> botões reais </div>
  </section>
  <section id="end" role="dialog" aria-modal="true" aria-labelledby="endTitle" hidden> card + stats + share + rejogar </section>
</main>
```

Regras ARIA (painel A11y):
- Tiles `tabindex=-1`, nunca no Tab; leitura via `#live`.
- Teclado virtual = `<button>` reais, `aria-label="Tecla Q, presente"` atualizado após cada pintura.
- Erros em `role=alert`; progresso em `role=status`.
- Vitória/derrota move foco para `#end button`.
- Respeitar `prefers-reduced-motion` + `prefers-contrast:more` + `forced-colors:active` via media queries.

---

## 5. Modelo de dados

### 5.1 `words.js`
```js
export const WORDS = {
  animais: [{key:"ZEBRA",display:"ZEBRA"}, {key:"SAUDE",display:"SAÚDE"} …], // 100/categoria
  comidas: […], escola: […], objetos: […]
};
export const VALID = new Set([...secretas, "TERMO","AUREO","IDEIA",…]); // chutes aceitos
```
- `key` = A–Z sem acento, 5 chars, para lógica. `display` = forma com acento para revelação.
- Normalização: `s.normalize("NFD").replace(/[\u0300-\u036f]/g,"")`.
- Curadoria: só familiares, sem nomes próprios/arcaísmos; sem duplicar key entre categorias.

### 5.2 `storage.js` (prefixo `termo:`)
```js
prefs   { theme:"c"|"hc", motion:"full"|"reduced", category, difficulty:8|6|4 }
stats   { games, wins, totalTries, byCategory:{animais:{games,wins}} }
streak  { count, lastDailyDate:"YYYY-MM-DD" }
coins   { balance, unlocked:["c"] }
history [{ date, category, tries, win, difficulty }] // máx 30
custom  [{key,display,category}] // painel professor (P2)
```
API: `load(k,fb) / save(k,v) / addHistory(e) / touchStreak(date,win) / resetAll()`. Try/catch quota. Botão "Apagar dados" para demo.

---

## 6. Algoritmos centrais (`game.js`)

### 6.1 Seed diário (determinístico, sem servidor)
```js
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function dailyWord(cat){const d=new Date();const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();return WORDS[cat][Math.floor(mulberry32(seed)()*WORDS[cat].length)]}
```
Mesma categoria+data = mesma palavra em qualquer navegador. Livre usa `Math.random`.

### 6.2 Validação
1. `w.length===5` senão toast "Faltam letras…".
2. `VALID.has(w)` senão toast "Essa palavra não vale…" + shake, sem consumir tentativa.

### 6.3 Pintura com repetidas (2 passadas — obrigatório)
```js
function score(secret,guess){ // arrays 5
  const res=Array(5).fill("absent"), left={};
  secret.forEach(ch=>left[ch]=(left[ch]||0)+1);
  for(let i=0;i<5;i++) if(guess[i]===secret[i]){res[i]="correct";left[guess[i]]--}
  for(let i=0;i<5;i++) if(res[i]!=="correct"&&left[guess[i]]>0){res[i]="present";left[guess[i]]--}
  return res;
}
```
Prioridade teclado: `correct(2) > present(1) > absent(0)` — nunca rebaixa.

### 6.4 Pontos/moedas/streak
- `pontos = win ? max(0,1000-150*(used-1)) + (dif===6?200:dif===4?400:0) + streak*10 : 0`
- `moedas = win ? 50+10*(tries-used) : 0`
- Streak: só Diário conta; vence→+1 e salva data; perde/pula→zera (comparando `lastDailyDate`).

---

## 7. UI/estados (`ui.js`) — evolução do proto-c

Manter 100% do proto-c e adicionar (P1):
1. **HUD persistente:** moedas + streak no header (pill surface, sem quebrar contraste).
2. **Modal fim completo:** palavra display com acento, pontos/moedas/streak, grid emoji 🟩🟨⬛, `[Compartilhar]` (clipboard+fallback), `[Jogar de novo]`, `[Trocar categoria]`, countdown próximo diário.
3. **Stepper setup** já existe (1·Modo 2·Categoria 3·Nível) — só persistir escolha em prefs e restaurar com `aria-pressed`.
4. **Toast + shake** já existem — extrair shake para CSS reutilizável e desligável em `.nomotion`.
5. **Defs P2:** `DEFINITIONS = {ZEBRA:"…"}`, exibe no fim se existir.

Responsivo: `max-width:560px`, board centralizado, teclado 3 fileiras QWERTY, `CONFIRMAR/APAGAR` wide, sem scroll horizontal em 320px, zoom 200% funcional (RNF + 1.4.10).

---

## 8. Plano de implementação (SMART, 1–4h)

**Fase 1 — Port (4h):** F1 extrair `<style>` → `css/style.css` com tokens §3 (1h). F2 extrair `<script>` → `js/words|game|ui` mantendo comportamento (2h). F3 `index.html` semântico §4 linkando os 4 (1h). Critério: jogar igual ao proto-c via `file://`.

**Fase 2 — Dados (5h):** F4 expandir `words.js` 5→100/categoria curadas + VALID (3h). F5 `storage.js` + prefs/streak/coins/history + Apagar dados (2h).

**Fase 3 — P1 (6h):** F6 HUD + pontos/moedas + loja 2 temas (2h). F7 modal fim + share emoji + countdown (2h). F8 prefs restauradas + toggles persistidos + defs P2 (2h).

**Fase 4 — Qualidade (3h):** F9 Axe+Lighthouse A11y 100, contraste 4.5:1, teste só-teclado e NVDA (2h). F10 matriz 360px/768px/desktop + Chrome/Firefox (1h).

Total ~18h — cabe em 2 semanas escolares com folga para relatório.

---

## 9. Testes de aceitação (obrigatórios)

- [ ] Vitória consome streak/coins e sobrevive a reload.
- [ ] Derrota revela `display` com acento (ex: SAÚDE).
- [ ] Chute inválido/curto não consome tentativa + `role=alert` anuncia.
- [ ] Repetidas: secreta `OSSO`, chute com 3 S não pinta 3×.
- [ ] Diário: 2 navegadores, mesma categoria+data = mesma palavra; muda amanhã.
- [ ] Jogo zerável sem mouse (Tab+Enter) e sem cor (só símbolos ✓◐×).
- [ ] 320px sem scroll horizontal; teclas ≥44px; foco sempre visível.
- [ ] `prefers-reduced-motion` desliga flip/shake mantendo live region.

**Comandos:** `python3 -m http.server` na raiz → `http://localhost:8000`; Axe DevTools; Lighthouse; `rg "TODO|FIXME"`.

---

## 10. Riscos e mitigação

1. Lista obscura → frustração. Mitigar com curadoria + teste com 2 colegas.
2. Acento quebra validação → lógica sempre na `key`, display só na revelação.
3. Fuso no diário → documentado como hora local.
4. Inflar escopo (Dueto/sons) → congelado em P2, só após F10 verde.

**Migração futura p/ Firebase (fora do escopo):** trocar `storage.js` por Firestore+Auth; `game.js` intacto — documentado para professor ver visão de evolução.

---

## 11. Entregáveis

1. `index.html + css/style.css + js/{words,storage,game,ui}.js` rodando.
2. Este documento + `PRD.md` + `prototipos/` como anexos do trabalho.
3. Roteiro de apresentação (2 min): jogar 1 diária no Médio → mostrar streak/moedas → navegar só-teclado → Axe 0 erros.

**Próximo passo sugerido:** autorizar Fase 1 (port do proto-c para arquivos finais) — sem mudar visual.
