"use strict";

/* Dados e utilitários compartilhados entre a home (app.js) e as páginas de
   macrotema (macrotema.js). Carregar antes dos dois. */

const THEMES = [
  { slug: "arquitetura-institucional", name: "Arquitetura institucional e marco regulatório do setor elétrico", label: "Entenda como o setor elétrico é organizado", icon: "landmark" },
  { slug: "direito-do-consumidor", name: "Direito do Consumidor de Energia", label: "Entenda as regras que protegem a relação de consumo no setor elétrico", icon: "consumer" },
  { slug: "inclusao-energetica", name: "Politicas e Mecanismos de Inclusão Energética", label: "Conheça os principais instrumentos normativos de ampliação do acesso à energia", icon: "access" },
  { slug: "tributacao-estadual", name: "Tributação Estadual do Setor Elétrico", label: "Como o ICMS influencia a conta de energia e os investimentos no Piauí", icon: "coins" },
  { slug: "conexao-e-acesso-a-rede", name: "Conexão e Acesso à Rede", label: "Regras e procedimentos para conexão à rede", icon: "tower" },
  { slug: "geracao-distribuida", name: "Geração Distribuída", label: "Entenda as regras para gerar a própria energia conectada à rede de distribuição", icon: "home-energy" },
  { slug: "comercializacao-de-energia", name: "Comercialização de Energia", label: "Entenda como a energia é contratada nos ambientes regulado e livre", icon: "market" },
  { slug: "planejamento-energetico", name: "Planejamento Energético", label: "Como o futuro da energia é planejado", icon: "clipboard" },
  { slug: "transicao-energetica", name: "Transição Energética e Novas tecnologias", label: "O setor de energia em transformação", icon: "transition" },
  { slug: "licenciamento-ambiental", name: "Licenciamento Ambiental", label: "Energia e licenciamento ambiental", icon: "leaf-hand" },
  { slug: "participacao-publica", name: "Participação Pública", label: "Contribua para a construção das regras", icon: "messages" },
];

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/* Categoria funcional compartilhada pelo card, catálogo e zoom do brain. */
function isSectorInstrument(lawOrType) {
  const type = normalize(typeof lawOrType === "string" ? lawOrType : lawOrType?.type);
  return [
    "instrumento setorial",
    "procedimento de rede ons",
    "regras dos servicos de transmissao",
  ].includes(type);
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ";" && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell); if (row.some((item) => item.trim() !== "")) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

function getValue(row, expectedName) {
  const found = Object.keys(row).find((key) => normalize(key) === normalize(expectedName));
  return found ? row[found] : "";
}

function mapLaw(row) {
  const competence = getValue(row, "Competência");
  return {
    type: getValue(row, "Tipo"),
    number: getValue(row, "Nº da Norma"),
    name: getValue(row, "Nome/Definição da iniciativa"),
    description: getValue(row, "Ementa/Descrição"),
    relation: getValue(row, "Relação com Setor Energético"),
    url: getValue(row, "Link"),
    competence,
    scope: normalize(competence).includes("estadual") ? "Estadual" : normalize(competence).includes("federal") ? "Federal" : "Não informado",
    theme: getValue(row, "Macrotema Relacionado"),
  };
}

async function loadLaws(path) {
  const response = await fetch(path, { credentials: "same-origin" });
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return parseCsv(await response.text()).map(mapLaw);
}

function lawsOfTheme(laws, themeName) {
  return laws.filter((law) => normalize(law.theme) === normalize(themeName));
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
