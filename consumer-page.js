"use strict";

const complaintRanking = {
  brasil: [
    ["Fatura, medição e cobrança", 93],
    ["Interrupção do fornecimento", 80],
    ["Atendimento e prazos", 77],
    ["Qualidade do fornecimento", 37],
    ["Cadastro e contratos", 27]
  ],
  piaui: [
    ["Interrupção do fornecimento", 100],
    ["Fatura, medição e cobrança", 83],
    ["Atendimento e prazos", 63],
    ["Qualidade do fornecimento", 37],
    ["Cadastro e contratos", 33]
  ]
};

const complaintNumber = new Intl.NumberFormat("pt-BR");
const complaintPercent = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function complaintTotals(rows, scope, filter = () => true) {
  const totals = new Map();
  rows.filter((row) => row.scope === scope && filter(row)).forEach((row) => {
    totals.set(row.category, (totals.get(row.category) || 0) + row.received);
  });
  return totals;
}

function complaintShares(totals) {
  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);
  return new Map([...totals].map(([key, value]) => [key, grandTotal ? (100 * value / grandTotal) : 0]));
}

function renderComplaintAnalysis(data) {
  const root = document.querySelector("[data-complaints-analysis]");
  if (!root) return;
  const categories = data.meta.categories;
  const rows = data.annual;
  const brTotals = complaintTotals(rows, "BR");
  const piTotals = complaintTotals(rows, "PI");
  const brShares = complaintShares(brTotals);
  const piShares = complaintShares(piTotals);
  const ordered = Object.keys(categories).sort((a, b) => (piShares.get(b) || 0) - (piShares.get(a) || 0));
  const comparisonMax = Math.max(...ordered.flatMap((key) => [piShares.get(key) || 0, brShares.get(key) || 0]), 1);
  const comparisonVisualValue = (value) => value >= 0.05 ? 85 * Math.sqrt(value / comparisonMax) : 0;

  const comparisonRows = ordered.map((key) => `
    <div class="complaints-analysis__compare-row">
      <strong>${categories[key]}</strong>
      <div class="complaints-analysis__pair"><span>Piauí</span><progress max="100" value="${comparisonVisualValue(piShares.get(key) || 0)}" aria-label="Piauí: ${complaintPercent.format(piShares.get(key) || 0)}%"></progress><em>${complaintPercent.format(piShares.get(key) || 0)}%</em></div>
      <div class="complaints-analysis__pair complaints-analysis__pair--br"><span>Brasil</span><progress max="100" value="${comparisonVisualValue(brShares.get(key) || 0)}" aria-label="Brasil: ${complaintPercent.format(brShares.get(key) || 0)}%"></progress><em>${complaintPercent.format(brShares.get(key) || 0)}%</em></div>
    </div>`).join("");

  const annualYears = [2021, 2022, 2023, 2024, 2025];
  const annualShare = (scope, year, key) => complaintShares(complaintTotals(rows, scope, (row) => row.year === year)).get(key) || 0;
  const annualRows = ordered.map((key) => {
    const cells = annualYears.map((year) => {
      const piShare = annualShare("PI", year, key);
      const brShare = annualShare("BR", year, key);
      return `<span class="complaints-analysis__year-cell complaints-analysis__year-cell--pair"><i>${complaintPercent.format(piShare)}%</i><i>${complaintPercent.format(brShare)}%</i></span>`;
    }).join("");
    return `<div class="complaints-analysis__year-row"><strong>${categories[key]}</strong>${cells}</div>`;
  }).join("");
  const annualHead = annualYears.map((year) => `<b>${year}<small><i>PI</i><span>·</span><i>BR</i></small></b>`).join("");

  const procedureRate = (scope, key) => {
    const selected = rows.filter((row) => row.scope === scope && row.category === key);
    const procedent = selected.reduce((sum, row) => sum + row.procedent, 0);
    const solved = selected.reduce((sum, row) => sum + row.procedent + row.improcedent, 0);
    return solved ? 100 * procedent / solved : 0;
  };
  const procedureRows = ordered.map((key) => `<tr><th scope="row">${categories[key]}</th><td><span class="complaints-analysis__result-value complaints-analysis__result-value--pi">${complaintPercent.format(procedureRate("PI", key))}%</span></td><td><span class="complaints-analysis__result-value complaints-analysis__result-value--br">${complaintPercent.format(procedureRate("BR", key))}%</span></td></tr>`).join("");

  const municipal = new Map();
  data.piaui_municipal.filter((row) => row.year >= 2023).forEach((row) => municipal.set(row.municipality, (municipal.get(row.municipality) || 0) + row.received));
  const topMunicipal = [...municipal].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const municipalTotal = [...municipal.values()].reduce((sum, value) => sum + value, 0);
  const municipalMaxShare = municipalTotal ? 100 * (topMunicipal[0]?.[1] || 0) / municipalTotal : 1;
  const municipalRows = topMunicipal.map(([name, value]) => {
    const share = municipalTotal ? 100 * value / municipalTotal : 0;
    const scale = Math.max(1, Math.round(100 * share / municipalMaxShare));
    return `<li class="complaints-analysis__municipal-scale-${scale}"><i><b></b><em>${complaintPercent.format(share)}%</em><span>${complaintNumber.format(value)}</span></i><strong>${name}</strong></li>`;
  }).join("");

  const monthly = new Map();
  [2023, 2024, 2025].forEach((year) => {
    const yearRows = data.piaui_monthly.filter((row) => row.year === year && row.category === "interrupcao");
    const yearTotal = yearRows.reduce((sum, row) => sum + row.received, 0);
    yearRows.forEach((row) => monthly.set(row.month, (monthly.get(row.month) || 0) + (yearTotal ? 100 * row.received / yearTotal / 3 : 0)));
  });
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthMax = Math.max(...monthly.values(), 1);
  const monthBars = months.map((name, index) => { const value = monthly.get(index + 1) || 0; const scale = Math.max(1, Math.round(100 * value / monthMax)); return `<span><em>${complaintPercent.format(value)}%</em><i><b class="complaints-analysis__bar-scale-${scale}"></b></i><small>${name}</small></span>`; }).join("");

  root.innerHTML = `
    <article class="complaints-analysis__panel complaints-analysis__panel--wide">
      <header><div><small>Comparação Piauí–Brasil</small><h3>Classificação das reclamações registradas na ANEEL</h3></div><p>Piauí e Brasil · 2021–2025</p></header>
      <div class="complaints-analysis__compare">${comparisonRows}</div>
    </article>
    <div class="complaints-analysis__grid">
      <article class="complaints-analysis__panel complaints-analysis__panel--summary">
        <header><div><small>Evolução anual</small><h3>Participação anual por tema — Piauí e Brasil</h3></div></header>
        <div class="complaints-analysis__years"><div class="complaints-analysis__year-head"><span>Tema</span>${annualHead}</div>${annualRows}</div>
      </article>
      <article class="complaints-analysis__panel complaints-analysis__panel--summary complaints-analysis__panel--results">
        <header><div><small>Resultado das manifestações</small><h3>Reclamações consideradas procedentes pelas distribuidoras</h3></div></header>
        <div class="complaints-analysis__table-wrap"><table><thead><tr><th>Tema</th><th>Piauí</th><th>Brasil</th></tr></thead><tbody>${procedureRows}</tbody></table></div>
      </article>
      <article class="complaints-analysis__panel complaints-analysis__panel--wide complaints-analysis__panel--territorial" id="recorte-territorial-piaui">
        <header><div><small>Recorte territorial</small><h3>Municípios com maior volume total de reclamações registradas</h3></div><div class="complaints-analysis__territorial-mark complaints-analysis__territorial-mark--featured"><img src="../assets/maps/piaui-municipios-reclamacoes.svg" alt="Mapa do Piauí com os dez municípios de maior volume de reclamações destacados em tons de azul"></div></header>
        <ol class="complaints-analysis__municipal">${municipalRows}</ol>
        <p class="complaints-analysis__caution">O gráfico reúne os dez municípios do Piauí com maior número de reclamações registradas entre 2023 e 2025, período em que a base analisada disponibiliza o detalhamento necessário por município. A maior participação ocupa a altura máxima e as demais barras mantêm proporção em relação a ela. Acima de cada barra, a primeira linha mostra a participação percentual no total estadual e a segunda informa o número absoluto de reclamações.</p>
      </article>
    </div>
    <article class="complaints-analysis__panel complaints-analysis__panel--wide" id="padrao-mensal-piaui">
      <header><div><small>Padrão mensal no Piauí</small><h3>Participação média mensal das reclamações por interrupção</h3></div><p class="complaints-analysis__period">2023–2025</p></header>
      <div class="complaints-analysis__months">${monthBars}</div>
      <p class="complaints-analysis__caution">A análise mensal considera as reclamações por interrupção, tema de maior participação no período, e mostra como esses registros se distribuem entre os meses de 2023 a 2025. O padrão se repete nos três anos: menor participação entre maio e agosto e crescimento no fim e no início do ano.</p>
    </article>
    <details class="complaints-analysis__method">
      <summary>Nota metodológica</summary>
      <p>Foram reunidas 79 nomenclaturas de reclamações utilizadas pela ANEEL entre 2021 e 2025, por equivalência temática, em sete grupos comparáveis. Pedidos de informação, solicitações de serviço, denúncias, elogios e sugestões ficaram de fora por não serem reclamações. Registros classificados como “Outros” também foram excluídos, pois não identificam o problema específico. As barras acompanham a participação de cada grupo e recebem um ajuste visual para tornar valores pequenos perceptíveis; os percentuais apresentados correspondem aos valores exatos.</p>
      <p>A análise territorial considera 2023 a 2025, período em que a base passou a disponibilizar a desagregação municipal necessária para identificar e comparar os municípios.</p>
      <div class="complaints-analysis__method-links">
        <a href="${data.meta.classification_url}" target="_blank" rel="noopener noreferrer">Consultar a tipologia oficial da ANEEL ↗</a>
        <a href="https://dadosabertos.aneel.gov.br/dataset/manifestacoes-no-1o-e-2o-niveis-da-distribuidora" target="_blank" rel="noopener noreferrer">Consultar os dados abertos da ANEEL ↗</a>
      </div>
    </details>`;
}

async function initializeComplaintAnalysis() {
  const root = document.querySelector("[data-complaints-analysis]");
  if (!root) return;
  try {
    const response = await fetch("../data/consumer-complaints-analysis.json?v=20261105-1");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderComplaintAnalysis(await response.json());
  } catch (error) {
    root.innerHTML = "<p class=\"complaints-analysis__error\">Não foi possível carregar a análise neste momento. Consulte a fonte oficial indicada abaixo.</p>";
  }
}

const consumerRights = {
  interrupcao: {
    kicker: "Interrupções no fornecimento",
    title: "Como registrar e acompanhar a falta de energia",
    lead: "A interrupção deve ser comunicada à distribuidora para gerar protocolo e permitir a identificação da ocorrência. A continuidade é acompanhada por indicadores que medem a duração e a frequência das interrupções percebidas pelo consumidor.",
    facts: [
      ["Registre a ocorrência", "Informe a unidade consumidora, a data e o horário de início da falta de energia. Anote o protocolo e, se possível, registre quando o fornecimento foi restabelecido.", "REN nº 1.000/2021, arts. 401, § 2º, 403 e 405."],
      ["Verifique a continuidade", "Consulte na fatura ou no canal da distribuidora os indicadores individuais de continuidade, como DIC, FIC, DMIC e DICRI, e compare-os com os limites informados.", "REN nº 1.000/2021, art. 435; PRODIST, Módulo 8, Seção 8.2."],
      ["Compensação automática", "Quando os limites individuais são ultrapassados, a compensação deve ser calculada pela distribuidora e creditada automaticamente na fatura, conforme as regras do PRODIST.", "REN nº 1.000/2021, art. 435; PRODIST, Módulo 8, Seção 8.2."],
      ["Interrupção programada", "Confira se houve aviso prévio com data, horário e duração estimada. Informe à distribuidora a existência de morador que dependa de equipamento elétrico indispensável à vida.", "REN nº 1.000/2021, art. 436."]
    ],
    basis: "REN ANEEL nº 1.000/2021 e PRODIST — Módulo 8, continuidade do fornecimento.",
    url: "https://www.gov.br/aneel/pt-br/assuntos/distribuicao/qualidade-do-fornecimento-de-energia-eletrica"
  },
  fatura: {
    kicker: "Fatura, medição e cobrança",
    title: "Como conferir e contestar valores da conta",
    lead: "A fatura deve permitir identificar o período de consumo, a leitura utilizada, as tarifas, os encargos, os tributos e outros valores cobrados. Quando houver divergência, o consumidor pode registrar uma reclamação e exigir análise objetiva dos itens questionados.",
    facts: [
      ["Antes de reclamar", "Compare a leitura indicada na fatura com o medidor e confira a unidade consumidora, o período faturado, a tarifa, a bandeira tarifária, os tributos e a existência de débitos anteriores.", "REN nº 1.000/2021, art. 327; PRODIST, Módulo 11."],
      ["Faturamento estimado", "Quando a distribuidora não consegue acessar o medidor, o consumo pode ser estimado pela média dos 12 meses anteriores. Após a leitura real, a diferença deve ser ajustada nas faturas seguintes.", "REN nº 1.000/2021, arts. 278, 289 e 321."],
      ["Cobrança a maior", "Se houver faturamento incorreto para mais, a REN nº 1.000/2021 prevê devolução em dobro, exceto quando a distribuidora comprovar responsabilidade exclusiva do consumidor ou de terceiro não relacionado a ela.", "REN nº 1.000/2021, art. 323, §§ 2º a 4º."],
      ["Documentos úteis", "Guarde a fatura contestada, os comprovantes de pagamento, os protocolos e, quando possível, fotografias legíveis do medidor com a data do registro. Esses elementos facilitam a análise.", "REN nº 1.000/2021, arts. 403 a 405; art. 252."]
    ],
    basis: "REN ANEEL nº 1.000/2021 e PRODIST — Módulos 5 e 11.",
    url: "https://www.gov.br/aneel/pt-br/consumidores/como-resolver"
  },
  atendimento: {
    kicker: "Atendimento e prazos",
    title: "A reclamação deve ser registrada e respondida pela distribuidora",
    lead: "O primeiro passo é registrar a demanda em um canal oficial da distribuidora. O protocolo identifica o pedido, inicia a contagem dos prazos e permite acompanhar a resposta, solicitar reanálise e levar a reclamação às instâncias seguintes, se necessário.",
    facts: [
      ["Protocolo obrigatório", "O número deve ser informado no início do atendimento. O registro deve reunir identificação, data, horário, tipo e detalhamento da demanda e ser disponibilizado eletronicamente em até um dia útil, quando autorizado.", "REN nº 1.000/2021, art. 403, caput e §§ 1º a 3º."],
      ["Resposta clara e completa", "A resposta deve ser objetiva, conclusiva, usar linguagem compreensível e abordar todos os pontos apresentados. Se o pedido for negado, a distribuidora deve explicar os motivos e indicar a base normativa.", "REN nº 1.000/2021, art. 406, § 3º, e art. 416."],
      ["Prazos para solução", "A reclamação deve ser solucionada em até cinco dias úteis quando não houver visita técnica e em até dez dias úteis nas demais situações, salvo quando houver prazo específico para o assunto.", "REN nº 1.000/2021, art. 408, I e II."],
      ["Acompanhamento", "Guarde o protocolo e a resposta. Em reclamações repetidas sobre o mesmo objeto ainda não solucionado, a contagem considera o primeiro registro. A gravação do atendimento telefônico também pode ser solicitada.", "REN nº 1.000/2021, arts. 393, 405 e 410."]
    ],
    basis: "REN ANEEL nº 1.000/2021, atendimento ao consumidor e tratamento das reclamações.",
    url: "https://www.gov.br/aneel/pt-br/canais_atendimento/reclame-da-distribuidora"
  },
  qualidade: {
    kicker: "Qualidade da energia e rede",
    title: "Como reclamar de oscilações e tensão inadequada",
    lead: "A qualidade da energia envolve a manutenção da tensão e de outros parâmetros dentro dos limites regulatórios. Oscilações, subtensão, sobretensão e perturbações recorrentes devem ser registradas para avaliação técnica.",
    facts: [
      ["Caracterize o problema", "Informe quando as oscilações ocorrem, a frequência percebida e os equipamentos afetados. Guarde protocolos, fotografias, vídeos e registros de data e horário.", "REN nº 1.000/2021, arts. 403 a 405; PRODIST, Módulo 8, Seção 8.1."],
      ["Solicite avaliação técnica", "Peça a verificação da tensão e, quando aplicável, a instalação de medição específica. A distribuidora deve informar os procedimentos e os prazos da análise.", "REN nº 1.000/2021, arts. 437 e 438; PRODIST, Módulo 8, Seção 8.1."],
      ["Exija resposta técnica", "A resposta deve apresentar as análises realizadas, o resultado das medições e, quando houver desconformidade, as ações e os prazos previstos para correção ou mitigação.", "REN nº 1.000/2021, art. 438; PRODIST, Módulo 8, Seção 8.1."],
      ["Confira a compensação", "A violação dos limites dos indicadores DRP e DRC gera compensação financeira automática na fatura até a regularização da tensão.", "PRODIST, Módulo 8, Seção 8.1 e Anexo 8.A."]
    ],
    basis: "REN ANEEL nº 1.000/2021 e PRODIST — Módulo 8, qualidade do produto.",
    url: "https://www.gov.br/aneel/pt-br/assuntos/distribuicao/qualidade-do-fornecimento-de-energia-eletrica"
  },
  suspensao: {
    kicker: "Suspensão, pagamento e religação",
    title: "Quais regras condicionam o corte e a religação",
    lead: "A suspensão depende de motivo previsto na regulação e, em regra, de comunicação prévia ao consumidor. Depois de resolvida a causa, a distribuidora deve receber o pedido de religação e cumprir os prazos aplicáveis.",
    facts: [
      ["Comunicação prévia", "A suspensão por falta de pagamento exige aviso com antecedência mínima de 15 dias. Nos casos relacionados a razões técnicas ou de segurança, a antecedência mínima informada pela ANEEL é de três dias.", "REN nº 1.000/2021, art. 360, § 1º, I e II."],
      ["Dias protegidos", "A suspensão por inadimplemento não pode começar às sextas-feiras, aos sábados, aos domingos, em feriados ou no dia anterior a feriado, quando o acesso aos meios de regularização pode ser limitado.", "REN nº 1.000/2021, art. 359."],
      ["Corte indevido", "Se o fornecimento for suspenso indevidamente, a distribuidora deve restabelecê-lo em até quatro horas, sem cobrança, e aplicar o crédito previsto na regulação, sem prejuízo da análise de outros danos.", "REN nº 1.000/2021, arts. 361 e 362, I e § 1º."],
      ["Pedido de religação", "Regularizada a causa, registre a solicitação e guarde o protocolo. O prazo é de até 24 horas em área urbana e 48 horas em área rural; o descumprimento pode gerar compensação na fatura.", "REN nº 1.000/2021, art. 362, IV e V, e art. 365, § 1º."]
    ],
    basis: "REN ANEEL nº 1.000/2021, regras de suspensão e religação.",
    url: "https://www.gov.br/aneel/pt-br/consumidores/como-resolver"
  },
  danos: {
    kicker: "Ressarcimento de danos elétricos",
    title: "Como solicitar ressarcimento por dano elétrico",
    lead: "O Módulo 9 do PRODIST estabelece o procedimento aplicável aos consumidores do Grupo B (baixa tensão) quando um equipamento é supostamente danificado por ocorrência no sistema de distribuição. A distribuidora deve analisar o dano, a relação com a rede e as situações que podem afastar sua responsabilidade.",
    facts: [
      ["Prazo e registro", "A solicitação pode ser apresentada em até cinco anos contados da ocorrência. Informe a data e o horário provável do dano, a unidade consumidora, os equipamentos afetados e as características do problema observado.", "PRODIST, Módulo 9, Seção 9.1, itens 8 e 13."],
      ["Verificação", "A distribuidora dispõe de até um dia útil para verificar equipamento usado na conservação de alimentos perecíveis ou medicamentos e de até dez dias para os demais equipamentos.", "PRODIST, Módulo 9, Seção 9.2 — Da Verificação."],
      ["Reparo antes da análise", "O consumidor pode providenciar o conserto antes da verificação, mas deve guardar notas fiscais, laudos, orçamentos, peças substituídas e outros elementos que permitam avaliar o dano.", "PRODIST, Módulo 9, Seção 9.1, item 17.1."],
      ["Limites do procedimento", "O Módulo 9 não abrange pedidos de consumidores do Grupo A, danos morais, lucros cessantes ou danos emergentes. Esses pedidos podem depender de outros meios de apuração.", "PRODIST, Módulo 9, Seção 9.0, itens 3 e 4."]
    ],
    basis: "REN ANEEL nº 1.000/2021 e PRODIST — Módulo 9.",
    url: "https://www.gov.br/aneel/pt-br/centrais-de-conteudos/procedimentos-regulatorios/prodist"
  },
  cadastro: {
    kicker: "Cadastro, contrato e conexão",
    title: "Como regularizar os dados e a relação contratual",
    lead: "Pedidos de conexão, alteração de titularidade, correção cadastral e encerramento contratual devem ser formalizados e acompanhados por protocolo. A distribuidora deve informar documentos, condições e prazos aplicáveis.",
    facts: [
      ["Pedido de conexão", "Apresente as informações e os documentos solicitados no formulário da distribuidora. Quando necessário, o orçamento deve discriminar obras, custos, responsabilidades e prazos.", "REN nº 1.000/2021, arts. 64 a 69."],
      ["Contrato de fornecimento", "Para unidade do Grupo B (baixa tensão), o fornecimento é formalizado por contrato de adesão, que deve ser legível e encaminhado ao consumidor até a apresentação da primeira fatura.", "REN nº 1.000/2021, arts. 123 a 126."],
      ["Titularidade e cadastro", "Solicite a correção de dados incorretos ou a alteração de titularidade e guarde o protocolo. A distribuidora deve informar eventual indeferimento por escrito.", "REN nº 1.000/2021, arts. 138 e 346; art. 403."],
      ["Encerramento contratual", "Peça o encerramento quando deixar o imóvel e guarde o comprovante. A distribuidora não pode condicioná-lo à quitação de débitos e deve emitir o faturamento final.", "REN nº 1.000/2021, arts. 140 e 141."]
    ],
    basis: "REN ANEEL nº 1.000/2021, conexão, contratos, titularidade e encerramento.",
    url: "https://www.gov.br/aneel/pt-br/centrais-de-conteudos/procedimentos-regulatorios/prodist"
  }
};

function renderRanking(scope) {
  const list = document.querySelector(`#complaints-bars-${scope}`);
  if (!list) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  list.replaceChildren(...complaintRanking[scope].map(([label, value], index) => {
    const item = document.createElement("li");
    item.className = "complaints__bar";
    const rank = document.createElement("span");
    rank.className = "complaints__bar-rank";
    rank.textContent = String(index + 1).padStart(2, "0");
    rank.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "complaints__bar-label";
    name.textContent = label;
    const track = document.createElement("span");
    track.className = "complaints__bar-track";
    const fill = document.createElement("span");
    fill.className = "complaints__bar-fill";
    fill.setAttribute("aria-hidden", "true");
    const delay = reduceMotion ? 0 : index * 90;
    fill.style.setProperty("--complaint-delay", `${delay}ms`);
    track.append(fill);
    const number = document.createElement("span");
    number.className = "complaints__bar-value";
    number.textContent = reduceMotion ? String(value) : "0";
    number.setAttribute("aria-label", `índice ${value} de 100`);
    item.append(rank, name, track, number);
    requestAnimationFrame(() => {
      fill.style.width = `${value}%`;
      if (reduceMotion) return;
      const duration = 1600;
      window.setTimeout(() => {
        const start = performance.now();
        const count = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          number.textContent = String(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(count);
        };
        requestAnimationFrame(count);
      }, delay);
    });
    return item;
  }));
}

function renderRight(key, focus = false) {
  const panel = document.querySelector("#right-panel");
  const data = consumerRights[key];
  if (!panel || !data) return;
  document.querySelectorAll("[data-right]").forEach((button) => {
    const active = button.dataset.right === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const tabs = document.querySelectorAll("[data-right]");
  const activeTab = [...tabs].find((button) => button.dataset.right === key);
  panel.setAttribute("aria-labelledby", activeTab?.id || "rights-title");
  panel.innerHTML = `
    <p class="consumer-rights__panel-kicker">${data.kicker}</p>
    <h3>${data.title}</h3>
    <p class="consumer-rights__panel-lead">${data.lead}</p>
    <h4 class="consumer-rights__facts-title">O que observar e como proceder</h4>
    <div class="consumer-rights__facts">${data.facts.map(([title, text, reference]) => `<div class="consumer-rights__fact"><strong>${title}</strong><p>${text}</p><small class="consumer-rights__fact-reference"><b>Referência normativa</b>${reference}</small></div>`).join("")}</div>
    <div class="consumer-rights__basis"><strong>Base normativa</strong><span>${data.basis}</span></div>`;
  if (focus) panel.focus({ preventScroll: true });
}

document.querySelectorAll("[data-right]").forEach((button) => {
  button.addEventListener("click", () => renderRight(button.dataset.right));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll("[data-right]")];
    const current = tabs.indexOf(button);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + tabs.length) % tabs.length;
    tabs[next].focus();
    renderRight(tabs[next].dataset.right);
  });
});

document.querySelectorAll("[data-right-target]").forEach((button) => {
  button.addEventListener("click", () => {
    renderRight(button.dataset.rightTarget);
    document.querySelector("#direitos")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
});

renderRanking("brasil");
renderRanking("piaui");
renderRight("interrupcao");
initializeComplaintAnalysis();

function initializeRankingReplay() {
  const section = document.querySelector("#reclamacoes");
  if (!section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const triggerLine = 200;
  let lastTop = section.getBoundingClientRect().top;
  let ticking = false;

  const checkPosition = () => {
    const currentTop = section.getBoundingClientRect().top;
    const crossedDescending = lastTop > triggerLine && currentTop <= triggerLine;
    const crossedAscending = lastTop < triggerLine && currentTop >= triggerLine;

    if (crossedDescending || crossedAscending) {
      renderRanking("brasil");
      renderRanking("piaui");
    }

    lastTop = currentTop;
    ticking = false;
  };

  const scheduleCheck = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(checkPosition);
  };

  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck);
}

function initializeComplaintSequence() {
  const section = document.querySelector(".complaint-path");
  if (!section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  section.classList.add("is-sequence-enhanced");
  const triggerLine = 82;
  let played = false;
  let lastTop = section.getBoundingClientRect().top;
  let ticking = false;

  const play = () => {
    played = true;
    section.classList.remove("is-sequence-active");
    void section.offsetWidth;
    requestAnimationFrame(() => section.classList.add("is-sequence-active"));
  };

  const checkPosition = () => {
    const rect = section.getBoundingClientRect();
    const currentTop = rect.top;
    const crossedDescending = lastTop > triggerLine && currentTop <= triggerLine;
    const crossedAscending = lastTop < triggerLine && currentTop >= triggerLine;

    if (crossedDescending || crossedAscending) play();
    if (!played && currentTop <= triggerLine && rect.bottom > triggerLine) play();

    lastTop = currentTop;
    ticking = false;
  };

  const scheduleCheck = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(checkPosition);
  };

  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck);
  if (location.hash === "#como-reclamar") play();
  else scheduleCheck();
}

initializeComplaintSequence();
initializeRankingReplay();
