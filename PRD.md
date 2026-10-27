# PRD — Jogo Casual de Adivinhação de Palavras (Estilo Termo/Wordle)

**Versão:** 1.0 | **Data:** 13/10/2026
**Contexto:** Trabalho escolar — Web III | **Pasta:** `JOGO firebase` (Firebase descartado por decisão)
**Stack:** HTML + CSS + JS puro, sem backend, sem dependências. Persistência em `localStorage`.

---

## 1. Visão geral

### 1.1 Produto
Jogo casual web singleplayer de adivinhação de palavras em PT-BR, fixo de 5 letras, inspirado em Termo/Wordle. O jogador tem N tentativas para acertar a palavra secreta, com feedback por cores a cada palpite.

### 1.2 Objetivo
- Entregar um jogo jogável, responsivo e apresentável para avaliação escolar.
- Demonstrar domínio de HTML/CSS/JS, lógica, manipulação de DOM e persistência local.
- Sessão curta (2–5 min), regra explicável em 1 frase.

### 1.3 Público-alvo
Estudantes e público casual, jogadores de navegador no celular ou PC. Sem necessidade de cadastro.

### 1.4 Premissas (decisões travadas com o cliente)
1. Fixo de 5 letras.
2. 4 categorias temáticas.
3. Tudo em `localStorage`, sem login, sem servidor.
4. Dificuldade = número de tentativas.
5. Palavra do dia calculada por data no JS (determinística, igual para todos no mesmo dia/categoria).

---

## 2. Loop principal de gameplay

1. Jogador escolhe **categoria** + **dificuldade** + **modo** (Diário / Livre) na tela inicial.
2. Sistema sorteia palavra secreta de 5 letras da lista da categoria.
3. Jogador digita palpite de 5 letras (teclado físico + teclado virtual na tela) e confirma com Enter.
4. Sistema valida e pinta cada letra:
   - 🟩 **Verde:** letra certa na posição certa.
   - 🟨 **Amarelo:** letra existe na palavra, mas em outra posição.
   - ⬛ **Cinza:** letra não existe na palavra.
5. Repete até acertar tudo (vitória) ou esgotar tentativas (derrota, revela resposta).
6. Tela final exibe pontos, moedas, streak, botão de compartilhar (emoji grid) e rejogar.

---

## 3. Regras detalhadas

### 3.1 Tentativas por dificuldade
| Dificuldade | Tentativas | Bônus pontos |
|---|---|---|
| Fácil | 8 | +0 |
| Médio (padrão) | 6 | +200 |
| Difícil | 4 | +400 |

Grid renderiza dinamicamente: 5 colunas x N linhas conforme dificuldade.

### 3.2 Validação do palpite
- Deve ter exatamente 5 letras.
- Deve existir na lista de palavras aceitas (lista secreta + lista extra de válidos, para aceitar chutes válidos que não são resposta).
- Caso inválido: toast "Palavra inválida" + shake na linha, sem consumir tentativa.

### 3.3 Regra de letras repetidas (obrigatória)
Contagem por ocorrências, em duas passadas:
1. Marca verdes primeiro e consome ocorrências.
2. Depois marca amarelos até esgotar ocorrências restantes; resto cinza.
- Ex: resposta `OSSO`, chute `OSSOS` (se 5 letras: `SOSSO`): não pode pintar 3 S de verde/amarelo se resposta só tem 2 S.

### 3.4 Acentos
- Digitação **sem acento**. Exibição **com acento**.
- Equivalências: `A` = Á À Â Ã | `E` = É Ê | `I` = Í | `O` = Ó Ô Õ | `U` = Ú Ü | `C` = Ç.
- Armazenamento: `chave` sem acento para lógica + `display` com acento para exibição. Ex: `{ key: "SAUDE", display: "SAÚDE" }`.

### 3.5 Palavra do dia (sem servidor)
- `seed = AAAAMMDD` (data local) como número.
- PRNG `mulberry32(seed)` → `index = rand() % listaCategoria.length`.
- Mesma categoria + mesmo dia = mesma palavra para todos. Vira à meia-noite local.
- Diário permite **1 partida válida por dia por categoria** para efeito de streak (rejogar livre não quebra streak).

### 3.6 Pontuação e moedas
- Fórmula: `pontos = max(0, 1000 - 150 * (tentativasUsadas - 1)) + bonusDificuldade + (streak * 10)` só em vitória. Derrota = 0 pts.
- Moedas: vitória = 50 + 10 por tentativa não usada. Usadas para desbloquear temas visuais.
- Customização inicial: tema Claro/Escuro grátis + 2 temas desbloqueáveis (ex: `Oceano 200 moedas`, `Uva 350 moedas`).

### 3.7 Streak e estatísticas
- Streak incrementa ao vencer o Diário do dia; zera ao perder/pular um dia.
- Estatísticas: jogos, vitórias, % vitória, média de tentativas, por categoria.

---

## 4. Requisitos funcionais

### P0 — MVP (sem não apresenta)
- **RF01** Tabuleiro 5xN dinâmico por dificuldade.
- **RF02** Teclado virtual clicável + suporte a teclado físico (A-Z, Enter, Backspace).
- **RF03** Validação de 5 letras + pertencimento ao dicionário.
- **RF04** Pintura verde/amarelo/cinza com regra de repetidas.
- **RF05** Estados de teclado (letras já usadas mantêm cor de maior prioridade: verde > amarelo > cinza).
- **RF06** Banco de palavras: 4 categorias x mín. 100 palavras secretas + lista de válidos.
- **RF07** Modo Livre (aleatório via `Math.random`) + Modo Diário (seed por data).
- **RF08** Telas: Início (categoria/dificuldade/modo) / Jogo / Fim (resposta, pontos, rejogar).
- **RF09** Layout responsivo mobile-first (360px+) e desktop.

### P1 — Completo viável (escopo contratado)
- **RF10** Seletor de dificuldade (8/6/4 tentativas).
- **RF11** Seletor de 4 categorias. **Sugestão inicial:** Animais, Comidas, Escola, Objetos. (Trocável sem impacto no código.)
- **RF12** Pontos + moedas + loja simples de 2 temas.
- **RF13** Streak diário + histórico + estatísticas em `localStorage`.
- **RF14** Compartilhar resultado (texto emoji 🟩🟨⬛ + `navigator.clipboard`, fallback copiar manual).
- **RF15** Preferências persistidas (tema, última categoria/dificuldade).
- **RF16** Tema claro/escuro.

### P2 — Bônus (se sobrar tempo)
- **RF17** Definição/dica da palavra no fim.
- **RF18** Animação flip + shake + sons (WebAudio, sem arquivos).
- **RF19** Painel local para professor adicionar palavras (form + salva em `localStorage`, mescla com base).
- **RF20** Modo Dueto (2 palavras simultâneas).

### Requisitos não funcionais
- **RNF01** Load inicial < 2s, sem libs externas, funciona com `file://` ou Live Server.
- **RNF02** Funciona offline após primeiro load.
- **RNF03** Acessibilidade: contraste AA, não depender só de cor (letra + `aria-label`), foco visível, botões ≥ 44px.
- **RNF04** Compatível Chrome + Firefox atual, mobile e desktop.
- **RNF05** Código separado em 4 arquivos para avaliação: `index.html`, `style.css`, `app.js`, `words.js`.

---

## 5. Banco de palavras

- Formato: `words.js` exporta `WORDS = { animais: [{key, display}], comidas: [...], escola: [...], objetos: [...] }` + `VALID = Set(...)` com todas as chaves + extras aceitos como chute.
- Critérios de curadoria (aprendizado da pesquisa: qualidade > quantidade):
  - Só palavras familiares, sem arcaicas, sem nomes próprios, sem regionalismos obscuros.
  - 5 letras na forma sem acento. Ex: `ZEBRA`, `UVA??` — não (tem 3). Só 5.
  - Evitar duplicar mesma chave em 2 categorias.
- Meta inicial: 100/categoria para apresentar (400 total). Expansível para 200 sem mudar código.

---

## 6. Persistência (`localStorage`)

Chaves com prefixo `termo:`:
```
termo:prefs   { theme, category, difficulty }
termo:stats   { games, wins, totalTries, byCategory:{...}, lastWin }
termo:streak  { count, lastDailyDate: "YYYY-MM-DD" }
termo:coins   { balance, unlocked: ["default","dark"] }
termo:history [{ date, category, tries, win, difficulty }] (máx. 30)
termo:custom  palavras adicionadas pelo professor
```
Sem dados sensíveis. Botão "Apagar dados" na tela inicial (bom para demonstração).

---

## 7. UI/UX

- **Tela inicial:** título, seletor categoria (4 cards), seletor dificuldade (3 botões), botões [Jogar Diário] [Jogo Livre], streak atual, moedas.
- **Tela jogo:** header (categoria + tentativas restantes), grid, teclado virtual QWERTY, botão desistir, toast de erro.
- **Tela fim:** vitória/derrota, palavra + (P2: definição), pontos/moedas ganhos, streak, grid emoji, botões [Compartilhar] [Jogar de novo] [Trocar categoria].
- **Cores:** verde `#538d4e`, amarelo `#b59f3b`, cinza `#3a3a3c` (dark) / `#787c7e` (light). Suporte daltônico: além da cor, borda/símbolo diferente no teclado.
- Feedback: flip 300ms por letra, shake em erro, teclado atualiza após cada tentativa.

---

## 8. Arquitetura técnica

- `index.html` — semântico, header/main/footer, containers `#board`, `#keyboard`, `#modal`.
- `style.css` — CSS variables por tema, grid com `aspect-ratio: 1`, flex para teclado, media query 480px.
- `app.js` — módulos: `state`, `dailySeed`, `validate`, `paint`, `storage`, `ui`. Sem framework.
- `words.js` — dados puros, sem lógica.
- Sem Firebase/Auth/Firestore por decisão (para usar Firebase no futuro: trocar `storage` por Firestore + Auth, resto intacto).

---

## 9. Marcos e tarefas (SMART, 1–4h cada)

**Alpha (núcleo jogável):** A1 grid+teclado (3h), A2 validação+pintura+repetidas (4h), A3 words.js 400 palavras (4h), A4 telas início/fim (2h).
**Beta (completo viável):** B1 dificuldades 8/6/4 (2h), B2 diário por data + livre (3h), B3 pontos/moedas/temas (3h), B4 streak/stats/history (3h), B5 share + prefs + dark/light (2h), B6 responsivo + acessibilidade (3h).
**Release:** R1 6 cenários de teste manual (2h), R2 compat Chrome/Firefox/mobile (1h), R3 polish + apagar-dados + README apresentação (2h).

---

## 10. Critérios de aceitação e testes

- [ ] Acerta em N tentativas → vitória, pontos > 0, streak/coins atualizam e sobrevivem a reload.
- [ ] Esgota tentativas → derrota, resposta revelada com acento correto.
- [ ] Palpite inválido/curto não consome tentativa e mostra toast.
- [ ] Repetidas: ex. resposta `OSSO` não pinta 3 S.
- [ ] Diário: mesma categoria + mesma data = mesma palavra em 2 navegadores; muda no dia seguinte.
- [ ] Reload no meio da partida? Fora de escopo v1 (reinicia) — documentado.
- [ ] Mobile 360px sem scroll horizontal; teclado utilizável por toque.
- [ ] `Apagar dados` zera tudo.

**Fora de escopo v1:** login, ranking online, multiplayer, backend, monetização, PWA instalável.

---

## 11. Riscos

1. Lista com palavras obscuras → frustração. Mitigação: curadoria manual + teste com 2 colegas.
2. Acentos quebrando validação → mitigação: lógica sempre na `key` sem acento.
3. Diário divergente por fuso → aceito: usa hora local, documentado.

---

**Próximo passo aprovado:** implementar Alpha → Beta → Release conforme §9. Categorias assumidas: Animais, Comidas, Escola, Objetos (trocáveis em `words.js` sem mudar lógica). Dificuldade assumida: 8/6/4.
