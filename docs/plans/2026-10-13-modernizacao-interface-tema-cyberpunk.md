# PRD & Plano de Modernização da Interface — Termo C (Cyberpunk + Temas Modernos)

**Data:** 2026-10-13  
**Status:** Aprovado para Implementação  
**Contexto:** Evolução do design system do Termo C para uma interface moderna, dinâmica e visualmente rica, adicionando o tema Cyberpunk entre os 3 temas liberados de início.

---

## 1. Objetivos

1. **Modernização Visual Completa:**
   - Elevar a interface de uma estética rústica/monocromática para um design moderno, fluido e premium.
   - Adotar tipografia contemporânea (Google Fonts `Outfit` e `Space Grotesk` com fallbacks robustos para modo offline).
   - Introduzir superfícies com *glassmorphism* sutis, cantos harmoniosos, microinterações e sombras com profundidade.
   - Manter 100% da acessibilidade (WCAG AA/AAA, leitores de tela com ARIA live, suporte para daltônicos com símbolos permanentes, contraste alto e `prefers-reduced-motion`).

2. **Tema Cyberpunk Liberado:**
   - Adicionar o tema `cyberpunk` entre os 3 temas gratuitos desbloqueados por padrão.
   - Trinca de temas liberados iniciais:
     1. **⚡ Cyberpunk** (Neon ciano/magenta/amarelo sobre fundo void tech dark, efeitos de brilho e botões futuristas) — Grátis (0 🪙).
     2. **🌙 Midnight Navy** (Escuro moderno, paleta slate sofisticada, esmeralda e âmbar suave) — Grátis (0 🪙).
     3. **☀️ Claro Minimalista** (Interface clean, superfícies brancas com sombras difusas e contraste impecável) — Grátis (0 🪙).
   - Modo de acessibilidade `Alto Contraste` mantido e disponível (0 🪙) com toggle dedicado no topo.
   - Temas cosméticos da loja mantidos: `Oceano` (200 🪙) e `Nebulosa` (350 🪙).

3. **Melhorias de Componentes & Interação:**
   - **Header & HUD:** Badge moderna no título, pílulas com brilho suave para moedas (🪙) e streak (🔥), botões de acessibilidade integrados.
   - **Seletor de Temas (Loja):** Exibição interativa com miniatura de cores (swatches), status visual claro e feedback ao clicar.
   - **Tabuleiro (Board):** Células com bordas arredondadas modernas, feedback ao digitar, animação 3D de flip suave e brilho neon na célula ativa.
   - **Teclado Virtual:** Teclas com profundidade tátil, feedback tátil no toque, símbolos integrados para daltônicos.
   - **Feedback & Notificações:** Toast flutuante com estilo *glass pill* e animação suave.
   - **Modal de Vitória/Derrota:** Cartão de celebração com métricas organizadas e botão de compartilhar com feedback.

---

## 2. Especificação dos Temas

| ID | Nome | Custo | Paleta Principal | Destaque |
|---|---|---|---|---|
| `cyberpunk` | ⚡ Cyberpunk | 0 🪙 | Fundo `#030308`, Ciano Neon `#00f0ff`, Magenta Neon `#ff007f`, Verde Laser `#00ff88`, Amarelo `#ffe600` | Efeito Ultra-Neon, laser glow em múltiplas camadas, iluminação atmosférica, gradientes cibernéticos |
| `dark` | 🌙 Midnight | 0 🪙 | Fundo `#0a0f1d`, Superfície `#151f33`, Ciano Claro `#38bdf8`, Esmeralda `#10b981` | Escuro elegante com glassmorphism |
| `light` | ☀️ Claro Clean | 0 🪙 | Fundo `#f8fafc`, Superfície `#ffffff`, Azul Real `#2563eb`, Esmeralda `#059669` | Minimalista, sombras suaves e alta legibilidade |
| `hc` | 👁️ Alto Contraste | 0 🪙 | Fundo `#000000`, Texto `#ffffff`, Amarelo `#ffd60a`, Verde `#00ff66` | Máximo contraste WCAG AAA |
| `oceano` | 🌊 Oceano | 200 🪙 | Fundo `#031525`, Superfície `#072540`, Ciano Abissal `#06b6d4`, Coral `#f59e0b` | Aquático profundo |
| `uva` | 🔮 Nebulosa | 350 🪙 | Fundo `#110521`, Superfície `#200d3d`, Roxo Lilás `#c084fc`, Rosa `#f43f5e` | Synthwave cósmico |

---

## 3. Compatibilidade & Migração

- Jogadores existentes no `localStorage` que tinham `unlocked: ["dark", "light", "hc"]` recebem automaticamente o tema `cyberpunk` sem perder moedas, histórico ou streak.
- Zero dependência externa obrigatória: se a internet cair ou for aberto via `file://`, os fallbacks de fontes (`system-ui`, `-apple-system`, `sans-serif`) mantêm a integridade total do layout.
