/* words.js — banco de palavras Termo 5 letras (PT-BR)
 * Formato: { key: sem acento p/ lógica, display: com acento p/ exibição }
 * 4 categorias x 100 secretas + VALID global + DEFINITIONS (P2)
 * Sem lógica, só dados. Funciona com file:// (script clássico, sem modules).
 */
var WORDS = {
animais: [
{k:"ZEBRA",d:"ZEBRA"},{k:"TIGRE",d:"TIGRE"},{k:"CORVO",d:"CORVO"},{k:"CABRA",d:"CABRA"},
{k:"COBRA",d:"COBRA"},{k:"ARARA",d:"ARARA"},{k:"POMBO",d:"POMBO"},{k:"BURRO",d:"BURRO"},
{k:"POTRO",d:"POTRO"},{k:"VESPA",d:"VESPA"},{k:"MOSCA",d:"MOSCA"},{k:"CUPIM",d:"CUPIM"},
{k:"TRACA",d:"TRAÇA"},{k:"GRILO",d:"GRILO"},{k:"CUTIA",d:"CUTIA"},{k:"RATOS",d:"RATOS"},
{k:"LOBOS",d:"LOBOS"},{k:"HIENA",d:"HIENA"},{k:"BAGRE",d:"BAGRE"},{k:"CARPA",d:"CARPA"},
{k:"TRUTA",d:"TRUTA"},{k:"OSTRA",d:"OSTRA"},{k:"POLVO",d:"POLVO"},{k:"LULAS",d:"LULAS"},
{k:"CORAL",d:"CORAL"},{k:"URUBU",d:"URUBU"},{k:"CISNE",d:"CISNE"},{k:"GANSO",d:"GANSO"},
{k:"PAVAO",d:"PAVÃO"},{k:"URSOS",d:"URSOS"},{k:"PANDA",d:"PANDA"},{k:"COALA",d:"COALA"},
{k:"SAGUI",d:"SAGUI"},{k:"BUGIO",d:"BUGIO"},{k:"MICOS",d:"MICOS"},{k:"VEADO",d:"VEADO"},
{k:"ALCES",d:"ALCES"},{k:"BISAO",d:"BISÃO"},{k:"LHAMA",d:"LHAMA"},{k:"BODES",d:"BODES"},
{k:"OVINO",d:"OVINO"},{k:"SUINO",d:"SUÍNO"},{k:"PORCO",d:"PORCO"},{k:"TAPIR",d:"TAPIR"},
{k:"FURAO",d:"FURÃO"},{k:"AGUIA",d:"ÁGUIA"},{k:"SABIA",d:"SABIÁ"},{k:"GARCA",d:"GARÇA"},
{k:"PINTO",d:"PINTO"},{k:"PERUS",d:"PERUS"},{k:"LEOES",d:"LEÕES"},{k:"PUMAS",d:"PUMAS"},
{k:"LINCE",d:"LINCE"},{k:"GATOS",d:"GATOS"},{k:"LEBRE",d:"LEBRE"},{k:"FOCAS",d:"FOCAS"},
{k:"MORSA",d:"MORSA"},{k:"QUATI",d:"QUATI"},{k:"ASNOS",d:"ASNOS"},{k:"MULAS",d:"MULAS"},
{k:"EGUAS",d:"ÉGUAS"},{k:"VACAS",d:"VACAS"},{k:"TOURO",d:"TOURO"},{k:"GALOS",d:"GALOS"},
{k:"PATOS",d:"PATOS"},{k:"TIZIU",d:"TIZIU"},{k:"SAIRA",d:"SAÍRA"},{k:"POMBA",d:"POMBA"},
{k:"ATOBA",d:"ATOBÁ"},{k:"GIBAO",d:"GIBÃO"},{k:"LEMUR",d:"LÊMUR"},{k:"OCAPI",d:"OCAPI"},
{k:"PEIXE",d:"PEIXE"},{k:"ATUNS",d:"ATUNS"},{k:"SIRIS",d:"SIRIS"},{k:"CACAO",d:"CAÇÃO"},
{k:"ACARA",d:"ACARÁ"},{k:"BARBO",d:"BARBO"},{k:"GAMBA",d:"GAMBA"},{k:"LESMA",d:"LESMA"},
{k:"PULGA",d:"PULGA"},{k:"IRARA",d:"IRARA"},{k:"ONCAS",d:"ONÇAS"},{k:"ANTAS",d:"ANTAS"},
{k:"PREAS",d:"PREÁS"},{k:"TORDO",d:"TORDO"},{k:"JACUS",d:"JACUS"},{k:"CURIO",d:"CURIÓ"},
{k:"BICHO",d:"BICHO"},{k:"VISON",d:"VISON"},{k:"DINGO",d:"DINGO"},{k:"CHITA",d:"CHITA"},
{k:"AGUTI",d:"AGUTI"},{k:"TETRA",d:"TETRA"},{k:"ZEBUS",d:"ZEBUS"},{k:"BONGO",d:"BONGO"},
{k:"NYALA",d:"NYALA"},{k:"KUDUS",d:"KUDUS"},{k:"SAIGA",d:"SAIGA"},{k:"ELAND",d:"ELAND"}
],
comidas: [
{k:"ARROZ",d:"ARROZ"},{k:"PIZZA",d:"PIZZA"},{k:"BOLOS",d:"BOLOS"},{k:"FRUTA",d:"FRUTA"},
{k:"FRITO",d:"FRITO"},{k:"CARNE",d:"CARNE"},{k:"LOMBO",d:"LOMBO"},{k:"COXAO",d:"COXÃO"},
{k:"PENNE",d:"PENNE"},{k:"QUIBE",d:"QUIBE"},{k:"TORTA",d:"TORTA"},{k:"SUFLE",d:"SUFLÊ"},
{k:"GEMAS",d:"GEMAS"},{k:"CLARA",d:"CLARA"},{k:"SONHO",d:"SONHO"},{k:"BROAS",d:"BROAS"},
{k:"CREPE",d:"CREPE"},{k:"BEIJU",d:"BEIJU"},{k:"DOCES",d:"DOCES"},{k:"BALAS",d:"BALAS"},
{k:"SUCOS",d:"SUCOS"},{k:"AGUAS",d:"ÁGUAS"},{k:"CAFES",d:"CAFÉS"},{k:"LATTE",d:"LATTE"},
{k:"MOCHA",d:"MOCHA"},{k:"CACAU",d:"CACAU"},{k:"CRAVO",d:"CRAVO"},{k:"SALSA",d:"SALSA"},
{k:"ALHOS",d:"ALHOS"},{k:"NABOS",d:"NABOS"},{k:"COUVE",d:"COUVE"},{k:"VAGEM",d:"VAGEM"},
{k:"GRAOS",d:"GRÃOS"},{k:"FAVAS",d:"FAVAS"},{k:"MILHO",d:"MILHO"},{k:"AVEIA",d:"AVEIA"},
{k:"TRIGO",d:"TRIGO"},{k:"MALTE",d:"MALTE"},{k:"POLEN",d:"PÓLEN"},{k:"OLEOS",d:"ÓLEOS"},
{k:"SHOYU",d:"SHOYU"},{k:"CURRY",d:"CURRY"},{k:"DENDE",d:"DENDÊ"},{k:"LOURO",d:"LOURO"},
{k:"MACAS",d:"MAÇÃS"},{k:"PERAS",d:"PERAS"},{k:"PASSA",d:"PASSA"},{k:"LIMAO",d:"LIMÃO"},
{k:"CIDRA",d:"CIDRA"},{k:"MAMAO",d:"MAMÃO"},{k:"MANGA",d:"MANGA"},{k:"CAJUS",d:"CAJUS"},
{k:"CAQUI",d:"CAQUI"},{k:"FIGOS",d:"FIGOS"},{k:"AMORA",d:"AMORA"},{k:"JAMBO",d:"JAMBO"},
{k:"PINHA",d:"PINHA"},{k:"KIWIS",d:"KIWIS"},{k:"MELAO",d:"MELÃO"},{k:"COCOS",d:"COCOS"},
{k:"NOZES",d:"NOZES"},{k:"AVELA",d:"AVELÃ"},{k:"BACON",d:"BACON"},{k:"LEITE",d:"LEITE"},
{k:"MINAS",d:"MINAS"},{k:"GOUDA",d:"GOUDA"},{k:"FETAS",d:"FETAS"},{k:"FAVOS",d:"FAVOS"},
{k:"CALDA",d:"CALDA"},{k:"PAVES",d:"PAVÊS"},{k:"PUDIM",d:"PUDIM"},{k:"FLANS",d:"FLANS"},
{k:"SAGUS",d:"SAGUS"},{k:"CURAU",d:"CURAU"},{k:"VINHO",d:"VINHO"},{k:"CHOPE",d:"CHOPE"},
{k:"SIDRA",d:"SIDRA"},{k:"SAQUE",d:"SAQUÊ"},{k:"VODKA",d:"VODKA"},{k:"LICOR",d:"LICOR"},
{k:"MATES",d:"MATES"},{k:"BOLDO",d:"BOLDO"},{k:"CAPIM",d:"CAPIM"},{k:"ERVAS",d:"ERVAS"},
{k:"POEJO",d:"POEJO"},{k:"FUBAS",d:"FUBÁS"},{k:"GOMAS",d:"GOMAS"},{k:"PIRAO",d:"PIRÃO"},
{k:"TUTUS",d:"TUTUS"},{k:"SUSHI",d:"SUSHI"},{k:"UDONS",d:"UDONS"},{k:"MISSO",d:"MISSÔ"},
{k:"TOFUS",d:"TOFUS"},{k:"SHAKE",d:"SHAKE"},{k:"SODAS",d:"SODAS"},{k:"DONUT",d:"DONUT"},
{k:"KEBAB",d:"KEBAB"},{k:"HUMUS",d:"HÚMUS"},{k:"TORRA",d:"TORRA"},{k:"COADO",d:"COADO"}
],
escola: [
{k:"LIVRO",d:"LIVRO"},{k:"PROVA",d:"PROVA"},{k:"ALUNO",d:"ALUNO"},{k:"NOTAS",d:"NOTAS"},
{k:"MEDIA",d:"MÉDIA"},{k:"TEXTO",d:"TEXTO"},{k:"LETRA",d:"LETRA"},{k:"VERBO",d:"VERBO"},
{k:"REGRA",d:"REGRA"},{k:"ERROS",d:"ERROS"},{k:"CERTO",d:"CERTO"},{k:"APAGA",d:"APAGA"},
{k:"LAPIS",d:"LÁPIS"},{k:"GIZES",d:"GIZES"},{k:"LOUSA",d:"LOUSA"},{k:"PENAS",d:"PENAS"},
{k:"FOLHA",d:"FOLHA"},{k:"CAPAS",d:"CAPAS"},{k:"BOLSA",d:"BOLSA"},{k:"REGUA",d:"RÉGUA"},
{k:"COLAS",d:"COLAS"},{k:"CLIPS",d:"CLIPS"},{k:"PLANO",d:"PLANO"},{k:"HORAS",d:"HORAS"},
{k:"TURMA",d:"TURMA"},{k:"SERIE",d:"SÉRIE"},{k:"GRAUS",d:"GRAUS"},{k:"CURSO",d:"CURSO"},
{k:"AULAS",d:"AULAS"},{k:"PATIO",d:"PÁTIO"},{k:"ATLAS",d:"ATLAS"},{k:"MAPAS",d:"MAPAS"},
{k:"GLOBO",d:"GLOBO"},{k:"ABACO",d:"ÁBACO"},{k:"SOMAS",d:"SOMAS"},{k:"RETAS",d:"RETAS"},
{k:"CURVA",d:"CURVA"},{k:"PONTO",d:"PONTO"},{k:"LINHA",d:"LINHA"},{k:"TRACO",d:"TRAÇO"},
{k:"TINTA",d:"TINTA"},{k:"DOBRA",d:"DOBRA"},{k:"MURAL",d:"MURAL"},{k:"FEIRA",d:"FEIRA"},
{k:"FICHA",d:"FICHA"},{k:"DEVER",d:"DEVER"},{k:"LICAO",d:"LIÇÃO"},{k:"EXAME",d:"EXAME"},
{k:"TESTE",d:"TESTE"},{k:"ITENS",d:"ITENS"},{k:"FALTA",d:"FALTA"},{k:"SAIDA",d:"SAÍDA"},
{k:"SALAS",d:"SALAS"},{k:"BANCO",d:"BANCO"},{k:"TAMPO",d:"TAMPO"},{k:"TELAS",d:"TELAS"},
{k:"VIDEO",d:"VÍDEO"},{k:"AUDIO",d:"ÁUDIO"},{k:"FONES",d:"FONES"},{k:"PALCO",d:"PALCO"},
{k:"DANCA",d:"DANÇA"},{k:"CANTO",d:"CANTO"},{k:"COROS",d:"COROS"},{k:"BANDA",d:"BANDA"},
{k:"HINOS",d:"HINOS"},{k:"JOGOS",d:"JOGOS"},{k:"VOLEI",d:"VÔLEI"},{k:"TRAVE",d:"TRAVE"},
{k:"REDES",d:"REDES"},{k:"BOLAS",d:"BOLAS"},{k:"AREIA",d:"AREIA"},{k:"HORTO",d:"HORTO"},
{k:"CALCA",d:"CALÇA"},{k:"TENIS",d:"TÊNIS"},{k:"MEIAS",d:"MEIAS"},{k:"PASTA",d:"PASTA"},
{k:"GIBIS",d:"GIBIS"},{k:"CRASE",d:"CRASE"},{k:"TEMPO",d:"TEMPO"},{k:"MODOS",d:"MODOS"},
{k:"VOZES",d:"VOZES"},{k:"VOGAL",d:"VOGAL"},{k:"HIATO",d:"HIATO"},{k:"POEMA",d:"POEMA"},
{k:"VERSO",d:"VERSO"},{k:"RIMAS",d:"RIMAS"},{k:"PROSA",d:"PROSA"},{k:"CONTO",d:"CONTO"},
{k:"LENDA",d:"LENDA"},{k:"MITOS",d:"MITOS"},{k:"SAGAS",d:"SAGAS"},{k:"TESES",d:"TESES"},
{k:"AUTOR",d:"AUTOR"},{k:"TUTOR",d:"TUTOR"},{k:"AMIGO",d:"AMIGO"},{k:"VISTO",d:"VISTO"},
{k:"PRAZO",d:"PRAZO"},{k:"METAS",d:"METAS"},{k:"GREGO",d:"GREGO"},{k:"LATIM",d:"LATIM"}
],
objetos: [
{k:"MESAS",d:"MESAS"},{k:"PORTA",d:"PORTA"},{k:"TACOS",d:"TACOS"},{k:"VASOS",d:"VASOS"},
{k:"PUFES",d:"PUFES"},{k:"SOFAS",d:"SOFÁS"},{k:"CAMAS",d:"CAMAS"},{k:"NICHO",d:"NICHO"},
{k:"CHAVE",d:"CHAVE"},{k:"VIDRO",d:"VIDRO"},{k:"TOCHA",d:"TOCHA"},{k:"VELAS",d:"VELAS"},
{k:"FAROL",d:"FAROL"},{k:"POSTE",d:"POSTE"},{k:"CABOS",d:"CABOS"},{k:"PILHA",d:"PILHA"},
{k:"MOUSE",d:"MOUSE"},{k:"TECLA",d:"TECLA"},{k:"CAIXA",d:"CAIXA"},{k:"PAPEL",d:"PAPEL"},
{k:"TONER",d:"TONER"},{k:"SELOS",d:"SELOS"},{k:"FOTOS",d:"FOTOS"},{k:"JARRO",d:"JARRO"},
{k:"PRATO",d:"PRATO"},{k:"COPOS",d:"COPOS"},{k:"GARFO",d:"GARFO"},{k:"FACAS",d:"FACAS"},
{k:"CUIAS",d:"CUIAS"},{k:"TACHO",d:"TACHO"},{k:"FORNO",d:"FORNO"},{k:"FOGAO",d:"FOGÃO"},
{k:"MIXER",d:"MIXER"},{k:"PANOS",d:"PANOS"},{k:"RODOS",d:"RODOS"},{k:"BALDE",d:"BALDE"},
{k:"SABAO",d:"SABÃO"},{k:"CESTO",d:"CESTO"},{k:"LIXOS",d:"LIXOS"},{k:"SACOS",d:"SACOS"},
{k:"BOTAS",d:"BOTAS"},{k:"BLUSA",d:"BLUSA"},{k:"SAIAS",d:"SAIAS"},{k:"SHORT",d:"SHORT"},
{k:"ROUPA",d:"ROUPA"},{k:"MANTA",d:"MANTA"},{k:"CARRO",d:"CARRO"},{k:"MOTOS",d:"MOTOS"},
{k:"TRENS",d:"TRENS"},{k:"NAVIO",d:"NAVIO"},{k:"BARCO",d:"BARCO"},{k:"CANOA",d:"CANOA"},
{k:"REMOS",d:"REMOS"},{k:"PEDAL",d:"PEDAL"},{k:"SELIM",d:"SELIM"},{k:"PNEUS",d:"PNEUS"},
{k:"PLACA",d:"PLACA"},{k:"RADAR",d:"RADAR"},{k:"SINAL",d:"SINAL"},{k:"FAIXA",d:"FAIXA"},
{k:"CASAS",d:"CASAS"},{k:"CHALE",d:"CHALÉ"},{k:"MUROS",d:"MUROS"},{k:"TELHA",d:"TELHA"},
{k:"BRITA",d:"BRITA"},{k:"VIGAS",d:"VIGAS"},{k:"VITRO",d:"VITRÔ"},{k:"RAMPA",d:"RAMPA"},
{k:"PREGO",d:"PREGO"},{k:"SERRA",d:"SERRA"},{k:"BROCA",d:"BROCA"},{k:"TENAZ",d:"TENAZ"},
{k:"NIVEL",d:"NÍVEL"},{k:"TRENA",d:"TRENA"},{k:"ROLOS",d:"ROLOS"},{k:"LATAS",d:"LATAS"},
{k:"MASSA",d:"MASSA"},{k:"LIXAS",d:"LIXAS"},{k:"FITAS",d:"FITAS"},{k:"ARAME",d:"ARAME"},
{k:"CORDA",d:"CORDA"},{k:"SISAL",d:"SISAL"},{k:"BUCHA",d:"BUCHA"},{k:"PORCA",d:"PORCA"},
{k:"ROSCA",d:"ROSCA"},{k:"MALAS",d:"MALAS"},{k:"LENTE",d:"LENTE"},{k:"HASTE",d:"HASTE"},
{k:"PENTE",d:"PENTE"},{k:"CUBAS",d:"CUBAS"},{k:"SIFAO",d:"SIFÃO"},{k:"RALOS",d:"RALOS"},
{k:"DUTOS",d:"DUTOS"},{k:"CANOS",d:"CANOS"},{k:"DUCHA",d:"DUCHA"},{k:"BOXES",d:"BOXES"},
{k:"PISOS",d:"PISOS"},{k:"FORRO",d:"FORRO"},{k:"GESSO",d:"GESSO"},{k:"BULES",d:"BULES"}
]
};

/* Chutes extras aceitos (válidos mas nunca resposta) — 5 letras, sem acento */
var EXTRA_VALID = [
"TERMO","AUREO","IDEIA","SAGAZ","PODER","HONRA","QUEDA","PEDRA","VENTO","FESTA",
"PONTE","FONTE","MUNDO","SERRA","TURMA","LIMPO","PULOS","VERDE","AMIGO","TEMPO",
"CAUSA","PAZES","NUVEM","CHUVA","PRAIA","MONTE","VALOR","LUCRO","TROCA","GRUPO",
"PLANO","SALTO","CANTO","DANCA","PODIO","OUROS","MARCA","SENHA","EMAIL","NIVEL",
"RISCO","MISTO","TEXTO","LETRA","VERBO","REGRA","ERROS","CERTO","LIVRO","PROVA",
"ALUNO","NOTAS","TURMA","CURSO","AULAS","MAPAS","GLOBO","CURVA","PONTO","LINHA",
"ARROZ","PIZZA","CARNE","LOMBO","TORTA","LEITE","CALDA","PUDIM","VINHO","CHOPE",
"ZEBRA","TIGRE","CORVO","CABRA","COBRA","ARARA","POMBO","BURRO","POTRO","VESPA",
"MESAS","PORTA","VASOS","CAMAS","CHAVE","VIDRO","VELAS","FAROL","POSTE","CABOS",
"PILHA","MOUSE","TECLA","CAIXA","PAPEL","FOTOS","JARRO","PRATO","COPOS","GARFO",
"FACAS","TACHO","FORNO","FOGAO","PANOS","BALDE","SABAO","CESTO","LIXOS","SACOS",
"BOTAS","BLUSA","SAIAS","ROUPA","MANTA","CARRO","MOTOS","TRENS","NAVIO","BARCO",
"CANOA","REMOS","PEDAL","SELIM","PNEUS","PLACA","RADAR","SINAL","FAIXA","CASAS",
"MUROS","TELHA","VIGAS","PREGO","SERRA","BROCA","CORDA","PORCA","ROSCA","MALAS"
];

/* VALID global = secretas + extras (normalizado, só A-Z, len 5) */
var VALID = (function(){
  var s = {};
  function add(k){ if(typeof k==="string" && /^[A-Z]{5}$/.test(k)) s[k]=1; }
  Object.keys(WORDS).forEach(function(cat){
    WORDS[cat].forEach(function(e){ add(e.key||e.k); });
  });
  EXTRA_VALID.forEach(add);
  // mescla palavras do professor (se já salvas) será feita em game.js via window.__customWords
  return {
    has: function(w){ return !!s[w]; },
    add: function(w){ add(w); },
    list: function(){ return Object.keys(s); },
    size: function(){ return Object.keys(s).length; }
  };
})();

/* Definições/dicas P2 (amostra — expansível sem mudar código) */
var DEFINITIONS = {
"ZEBRA":"Animal listrado preto e branco, parece um cavalo.",
"TIGRE":"Felino listrado, grande caçador.",
"ARARA":"Ave colorida de bico curvo.",
"COBRA":"Réptil sem patas, rasteja.",
"POLVO":"Molusco de oito braços.",
"ARROZ":"Grão base da comida brasileira.",
"PIZZA":"Disco de massa com queijo e molho.",
"LEITE":"Bebida branca, vem da vaca.",
"MANGA":"Fruta tropical amarela ou roxa.",
"LIMAO":"Fruta azeda verde ou amarela.",
"LIVRO":"Objeto de leitura com páginas.",
"PROVA":"Avaliação escrita da escola.",
"ALUNO":"Quem estuda na escola.",
"LOUSA":"Quadro de escrever da sala.",
"LAPIS":"Escreve e apaga com borracha.",
"PORTA":"Abre e fecha a entrada.",
"PRATO":"Louça para servir comida.",
"GARFO":"Talher com dentes.",
"CARRO":"Veículo de quatro rodas.",
"CHAVE":"Abre portas e cadeados."
};
