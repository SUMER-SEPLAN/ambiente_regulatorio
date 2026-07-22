const THEMES = [
    "Arquitetura institucional e marco regulatório do setor elétrico",
    "Direito do Consumidor de Energia",
    "Politicas e Mecanismos de Inclusão Energética",
    "Tributação Estadual do Setor Elétrico",
    "Conexão e Acesso à Rede",
    "Geração Distribuída",
    "Mercado Livre de Energia",
    "Planejamento Energético",
    "Transição Energética e Novas tecnologias",
    "Licenciamento Ambiental"
];

const THEME_FILES = {
    "Arquitetura institucional e marco regulatório do setor elétrico": "setor_eletrico.xml",
    "Direito do Consumidor de Energia": "direito_consumidor.xml",
    "Politicas e Mecanismos de Inclusão Energética": "inclusao_energetica.xml",
    "Tributação Estadual do Setor Elétrico": "tributacao_estadual.xml",
    "Conexão e Acesso à Rede": "conexao_acesso.xml",
    "Geração Distribuída": "geracao_distribuida.xml",
    "Mercado Livre de Energia": "mercado_livre.xml",
    "Planejamento Energético": "planejamento_energetico.xml",
    "Transição Energética e Novas tecnologias": "transicao_energetica.xml",
    "Licenciamento Ambiental": "licenciamento_ambiental.xml"
};

const THEME_INTRO_TEXTS = {
    "Arquitetura institucional e marco regulatório do setor elétrico": "Este tema detalha a estrutura de governança do setor elétrico brasileiro, apresentando as principais instituições, suas competências e como elas se inter-relacionam. O diagrama ilustra o fluxo de comando e as responsabilidades de órgãos como o Ministério de Minas e Energia (MME), a Agência Nacional de Energia Elétrica (ANEEL), o Operador Nacional do Sistema (ONS) e a Câmara de Comercialização de Energia Elétrica (CCEE).",
    "Direito do Consumidor de Energia": "Aqui são abordados os direitos e deveres dos consumidores de energia elétrica, conforme estabelecido pela ANEEL. O conteúdo explora as regras sobre faturamento, qualidade do serviço, atendimento, e os canais disponíveis para registro de reclamações, garantindo a proteção e o tratamento justo aos usuários do serviço de distribuição.",
    "Politicas e Mecanismos de Inclusão Energética": "Este macrotema foca nas políticas públicas voltadas para universalizar o acesso à energia elétrica e mitigar a pobreza energética. São apresentados programas como o Luz para Todos e a Tarifa Social de Energia Elétrica (TSEE), que oferecem subsídios e condições especiais para populações de baixa renda e comunidades remotas.",
    "Tributação Estadual do Setor Elétrico": "A tributação é um componente crucial na formação do preço da energia. Este tema explora a incidência de impostos estaduais, com destaque para o ICMS (Imposto sobre Circulação de Mercadorias e Serviços), detalhando sua base de cálculo, alíquotas e o impacto na fatura de energia dos consumidores.",
    "Conexão e Acesso à Rede": "O acesso às redes de transmissão e distribuição é fundamental para geradores e grandes consumidores. Este diagrama descreve os procedimentos, normas técnicas e regulatórias que devem ser seguidas para solicitar a conexão de um novo empreendimento ao Sistema Interligado Nacional (SIN), garantindo um acesso seguro e não discriminatório.",
    "Geração Distribuída": "A Geração Distribuída (GD) permite que os consumidores gerem sua própria energia, principalmente a partir de fontes renováveis como a solar. Este tema aborda o marco legal da GD, o sistema de compensação de energia elétrica (net metering) e as regras para conexão de micro e minigeradores à rede da distribuidora.",
    "Mercado Livre de Energia": "O Ambiente de Contratação Livre (ACL), ou Mercado Livre, permite que determinados consumidores escolham seu fornecedor de energia, negociando livremente preços, prazos e volumes. Este tema explora as regras de migração, os agentes envolvidos (comercializadoras, geradores) e as vantagens deste modelo de contratação.",
    "Planejamento Energético": "Para garantir a segurança e a eficiência do suprimento de energia no futuro, o setor realiza estudos de planejamento de longo prazo. Este macrotema aborda como são elaborados os planos de expansão da geração e da transmissão, considerando a previsão de demanda, a diversidade de fontes e os investimentos necessários.",
    "Transição Energética e Novas tecnologias": "A transição para uma matriz energética mais limpa e sustentável é um desafio global. Este tema explora as políticas de incentivo às fontes renováveis, o desenvolvimento de novas tecnologias como armazenamento de energia e hidrogênio verde, e as estratégias para a descarbonização do setor elétrico.",
    "Licenciamento Ambiental": "Todo empreendimento de energia deve passar por um rigoroso processo de licenciamento ambiental para garantir sua sustentabilidade. Este tema detalha as etapas do licenciamento (Licença Prévia, de Instalação e de Operação), os estudos ambientais exigidos (EIA/RIMA) e os órgãos responsáveis pela aprovação dos projetos."
};

let consolidadaData = [];
let activeLeaderLines = []; 
let currentSelectedTheme = ""; 
let currentTipoFilter = "";
let currentTipoFilterValues = [];
let tipoChartInstance = null;
let tipoChartGroupMap = {};
let diagramRequestCounter = 0; 

// Variáveis globais para espelhar os filtros entre as tabelas
let globalCompFilter = 'todas';
let globalTipoFilter = 'todas';

document.addEventListener("DOMContentLoaded", () => {
    initUI();
    loadCSV();
    initTooltip();

    // GARANTE QUE AS TABELAS COMECEM FECHADAS NO PRIMEIRO CARREGAMENTO
    if (document.getElementById('content-especificas')) {
        document.getElementById('content-especificas').style.display = 'none';
        document.getElementById('btn-especificas').classList.remove('active');
    }
    if (document.getElementById('content-ambientais')) {
        document.getElementById('content-ambientais').style.display = 'none';
        document.getElementById('btn-ambientais').classList.remove('active');
    }

    // Sincroniza todos os filtros de Competência
    document.querySelectorAll('.filter-competencia').forEach(el => {
        el.addEventListener('change', (e) => {
            globalCompFilter = e.target.value;
            document.querySelectorAll('.filter-competencia').forEach(select => select.value = globalCompFilter);
            renderTable(currentSelectedTheme || '');
        });
    });

    // Sincroniza todos os filtros de Tipo
    document.querySelectorAll('.filter-tipo').forEach(el => {
        el.addEventListener('change', (e) => {
            globalTipoFilter = e.target.value;
            document.querySelectorAll('.filter-tipo').forEach(select => select.value = globalTipoFilter);
            renderTable(currentSelectedTheme || '');
        });
    });
});

function removeAcentos(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Abre/Fecha as tabelas sanfonadas da página inicial
function toggleTable(id) {
    const content = document.getElementById('content-' + id);
    const btn = document.getElementById('btn-' + id);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.classList.add('active');
    } else {
        content.style.display = 'none';
        btn.classList.remove('active');
    }
}

function initUI() {
    const menuContent = document.getElementById('menu-content');
    const menuContainer = document.getElementById('animated-menu');
    const openMenuBtn = document.getElementById('open-theme-menu-btn');
    
    document.getElementById('toggle-menu').addEventListener('click', (e) => {
        e.stopPropagation();
        menuContainer.classList.toggle('is-open');
    });

    if (openMenuBtn) {
        openMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuContainer.classList.add('is-open');
        });
    }

    document.addEventListener('click', (e) => {
        if(!menuContainer.contains(e.target)) {
            menuContainer.classList.remove('is-open');
        }
    });

    const homeBtn = document.createElement('div');
    homeBtn.className = 'menu-btn active';
    homeBtn.textContent = '↩ Página inicial';
    homeBtn.onclick = () => goToHome();
    menuContent.appendChild(homeBtn);

    THEMES.forEach(theme => {
        const btn = document.createElement('div');
        btn.className = 'menu-btn';
        btn.textContent = theme;
        btn.onclick = () => selectTheme(theme);
        menuContent.appendChild(btn);
    });
}

function showRepositoryView(selectedTheme = "") {
    const tableSection = document.getElementById('table-section');
    const titleElement = document.getElementById('selected-theme-title');
    if (tableSection) {
        tableSection.style.display = 'block';
    }
    if (titleElement) {
        titleElement.textContent = selectedTheme ? `Legislação: ${selectedTheme}` : 'Catálogo de Normas';
    }
    renderTable(selectedTheme || '');
}

function goToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo

    currentSelectedTheme = ''; 
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'visible';
    document.getElementById('animated-menu').classList.remove('is-open');
    document.getElementById('intro-section').style.display = 'flex';
    
    // Reseta filtros do Gráfico
    currentTipoFilter = "";
    currentTipoFilterValues = [];
    if (document.getElementById('chart-reset-container')) {
        document.getElementById('chart-reset-container').style.display = 'none';
    }

    // Reseta filtros Globais
    globalCompFilter = 'todas';
    globalTipoFilter = 'todas';
    document.querySelectorAll('.filter-competencia').forEach(select => select.value = 'todas');
    document.querySelectorAll('.filter-tipo').forEach(select => select.value = 'todas');

    renderIntroStats();
    showRepositoryView(''); 

    // Oculta demais seções
    document.getElementById('reclamacao-section').style.display = 'none';
    document.getElementById('institucional-links-section').style.display = 'none';
    document.getElementById('theme-intro-section').style.display = 'none';
    document.getElementById('mindmap-section').style.display = 'none';
// Garante que as tabelas sanfonadas voltem a ficar fechadas
    if (document.getElementById('content-especificas')) {
        document.getElementById('content-especificas').style.display = 'none';
        document.getElementById('btn-especificas').classList.remove('active');
    }
    if (document.getElementById('content-ambientais')) {
        document.getElementById('content-ambientais').style.display = 'none';
        document.getElementById('btn-ambientais').classList.remove('active');
    }
    activeLeaderLines.forEach(line => line.remove());
    activeLeaderLines = [];

    document.querySelectorAll('.menu-btn').forEach(el => {
        if (el.textContent.includes('Página inicial')) el.classList.add('active');
        else el.classList.remove('active');
    });
}

function selectTheme(selectedTheme) {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo

    currentSelectedTheme = selectedTheme; 
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'hidden';
    document.getElementById('intro-section').style.display = 'none';
    document.getElementById('animated-menu').classList.remove('is-open');
    
    // Reseta filtros do Gráfico
    currentTipoFilter = "";
    currentTipoFilterValues = [];
    if (document.getElementById('chart-reset-container')) {
        document.getElementById('chart-reset-container').style.display = 'none';
    }

    // Reseta filtros Globais
    globalCompFilter = 'todas';
    globalTipoFilter = 'todas';
    document.querySelectorAll('.filter-competencia').forEach(select => select.value = 'todas');
    document.querySelectorAll('.filter-tipo').forEach(select => select.value = 'todas');

    // Intro do Tema
    const themeIntroSection = document.getElementById('theme-intro-section');
    const themeIntroTitle = document.getElementById('theme-intro-title');
    const themeIntroText = document.getElementById('theme-intro-text');
    const introText = THEME_INTRO_TEXTS[selectedTheme];

    if (introText && themeIntroSection && themeIntroTitle && themeIntroText) {
        themeIntroTitle.textContent = selectedTheme;
        themeIntroText.textContent = introText;
        themeIntroSection.style.display = 'block';
    } else {
        if (themeIntroSection) themeIntroSection.style.display = 'none';
    }

    const reclamacaoSection = document.getElementById('reclamacao-section');
    const institucionalSection = document.getElementById('institucional-links-section'); 
    
    if (selectedTheme.toLowerCase().includes("direito do consumidor")) reclamacaoSection.style.display = 'block';
    else reclamacaoSection.style.display = 'none';
    
    if (selectedTheme.toLowerCase().includes("arquitetura institucional")) institucionalSection.style.display = 'block';
    else institucionalSection.style.display = 'none';

    document.querySelectorAll('.menu-btn').forEach(el => {
        if(el.textContent === selectedTheme) el.classList.add('active');
        else el.classList.remove('active');
    });

    showRepositoryView(selectedTheme);
    loadDiagram(selectedTheme);
}

// -------------------------------------------------------------
// MOTOR DO MAPA MENTAL (DRAW.IO XML)
// -------------------------------------------------------------
function loadDiagram(themeName) {
    const container = document.getElementById('mindmap-container');
    const section = document.getElementById('mindmap-section');
    
    // Incrementa o contador e obtém um ID único para esta requisição.
    const currentRequest = ++diagramRequestCounter;
    
    // RESET DE DIMENSÕES: Evita que o espaço do diagrama anterior fique sobrando na tela
    // A limpeza foi movida para o início da renderXML para garantir que o conteúdo antigo seja removido antes de desenhar o novo, evitando sobreposição.
    container.style.width = '100%';
    container.style.minHeight = 'auto'; // Reseta a altura mínima para que o container se ajuste ao conteúdo
    section.style.display = 'none';

    let fileName = THEME_FILES[themeName];
    if (!fileName) {
        fileName = themeName.replace(/[:/]/g, '').trim() + '.xml';
    }

    const filePath = `diagrama/${fileName}`;

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error("Mapa mental não encontrado para este tema.");
            return response.text();
        })
        .then(xmlString => {
            // Apenas renderiza o diagrama se esta for a requisição mais recente.
            // Isso evita que uma resposta de rede lenta de um clique anterior
            // sobreponha o diagrama que o usuário realmente quer ver.
            if (currentRequest !== diagramRequestCounter) return;

            section.style.display = 'block';
            renderXML(xmlString);
        })
        .catch(err => {
            console.log("Aviso:", err.message);
        });
}

function extractText(html) {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
    let text = tempDiv.innerText || tempDiv.textContent;
    return text.trim();
}

function renderXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Usa só a primeira página/diagrama do arquivo, caso ele tenha mais de uma
    // (evita misturar nós de um tema com nós de outro no mesmo desenho).
    const primeiraPagina = xmlDoc.querySelector("mxGraphModel") || xmlDoc;
    const celulas = primeiraPagina.querySelectorAll("mxCell");

    const container = document.getElementById('mindmap-container');
    
    // Limpa o conteúdo anterior para evitar sobreposição, tratando a condição de corrida de cliques rápidos.
    container.innerHTML = '';
    activeLeaderLines.forEach(line => line.remove());
    activeLeaderLines = [];

    const nodesData = {};
    const hexagonsData = {};
    const edges = [];
    let titleAssigned = false;

    // PASSO 1: Mapear Elementos e Definir as Regras
    celulas.forEach(cell => {
        const id = cell.getAttribute("id");
        const isVertex = cell.getAttribute("vertex") === "1";
        const isEdge = cell.getAttribute("edge") === "1";
        const style = cell.getAttribute("style") || "";
        const value = cell.getAttribute("value") || "";
        const geo = cell.querySelector("mxGeometry");

        if (isVertex && geo) {
            const rawText = extractText(value);

            // REGRA DE DEFINIÇÃO VISUAL:
            let tipo = 'square'; // Por padrão, tudo (quadrado ou retângulo não-arredondado) será tratado como quadrado principal

            if (style.includes('shape=hexagon')) {
                tipo = 'hexagon';
            } else if (style.includes('rounded=1')) {
                // Se for arredondado, o primeiro com texto vira o Titulo. Os outros viram o retângulo azul claro.
                if (!titleAssigned && rawText.trim() !== '') {
                    tipo = 'title';
                    titleAssigned = true;
                } else {
                    tipo = 'rect'; 
                }
            }

            if (tipo === 'hexagon') {
                hexagonsData[id] = rawText;
            } else {
                nodesData[id] = {
                    id, styleStr: style, text: rawText, tipo,
                    x: parseFloat(geo.getAttribute("x") || 0),
                    y: parseFloat(geo.getAttribute("y") || 0),
                    w: parseFloat(geo.getAttribute("width") || 100),
                    h: parseFloat(geo.getAttribute("height") || 50),
                    tooltipText: null
                };
            }
        } else if (isEdge) {
            const source = cell.getAttribute("source");
            const target = cell.getAttribute("target");
            const isDashed = style.includes('dashed=1');

            const getStyleNum = (key) => {
                const m = style.match(new RegExp(key + '=([0-9.]+)'));
                return m ? parseFloat(m[1]) : null;
            };

            const points = geo ? Array.from(geo.querySelectorAll('Array[as="points"] > mxPoint')).map(p => ({
                x: parseFloat(p.getAttribute('x')), y: parseFloat(p.getAttribute('y'))
            })) : [];

            if (source && target) {
                edges.push({ source, target, isDashed, points, exitX: getStyleNum('exitX'), exitY: getStyleNum('exitY'), entryX: getStyleNum('entryX'), entryY: getStyleNum('entryY') });
            }
        }
    });

    // PASSO 2: Associar Tooltips
    edges.forEach(edge => {
        if (hexagonsData[edge.target]) {
            if (nodesData[edge.source]) nodesData[edge.source].tooltipText = hexagonsData[edge.target];
        } else if (hexagonsData[edge.source]) {
            if (nodesData[edge.target]) nodesData[edge.target].tooltipText = hexagonsData[edge.source];
        }
    });

    // PASSO 3: MATEMÁTICA CORRETA DAS DIMENSÕES 
    const minX = Math.min(...Object.values(nodesData).map(n => n.x));
    const minY = Math.min(...Object.values(nodesData).map(n => n.y));
    const maxX = Math.max(...Object.values(nodesData).map(n => n.x + n.w));
    const maxY = Math.max(...Object.values(nodesData).map(n => n.y + n.h));

    const drawWidth = maxX - minX;
    const drawHeight = maxY - minY;

    const containerWidth = drawWidth + 160; // Remove a largura mínima fixa
    const containerHeight = drawHeight + 180; // Remove a altura mínima fixa

    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;

    const offsetX = (containerWidth - drawWidth) / 2 - minX;
    const offsetY = 90 - minY;

    // PASSO 4: Criar as Caixas Visuais
    Object.values(nodesData).forEach(node => {
        const div = document.createElement("div");
        div.id = `node-${node.id}`;
        div.className = "drawio-node";
        div.style.left = `${node.x + offsetX}px`;
        div.style.top = `${node.y + offsetY}px`;
        div.style.width = `${node.w}px`;
        div.style.height = `${node.h}px`;

        if (node.tipo === 'square') {
            const parenIndex = node.text.indexOf('(');
            const listIndex = node.text.indexOf('\n-');

            if (parenIndex !== -1) {
                // Caso 1: O texto tem parênteses. Divide em topo/base.
                div.classList.add('drawio-square');
                const topText = node.text.substring(0, parenIndex).trim();
                let bottomText = node.text.substring(parenIndex).trim();
                
                bottomText = bottomText.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');

                div.innerHTML = `<div class="square-top">${topText}</div><div class="square-bottom">${bottomText}</div>`;
            } else if (listIndex !== -1) {
                // Caso 2: O texto tem uma lista (ex: '- item'), mas sem parênteses. Divide em topo/base.
                div.classList.add('drawio-square');
                const topText = node.text.substring(0, listIndex).trim().replace(/\n/g, '<br>');
                let bottomText = node.text.substring(listIndex);
                
                // Converte os marcadores da lista e remove a quebra de linha inicial.
                bottomText = bottomText.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
                if (bottomText.startsWith('<br>')) {
                    bottomText = bottomText.substring(4).trim();
                }
                div.innerHTML = `<div class="square-top">${topText}</div><div class="square-bottom">${bottomText}</div>`;
            } else {
                // Caso 3: Sem parênteses e sem lista. Renderiza como um bloco único todo azul.
                div.classList.add('drawio-square-full');
                let fullText = node.text.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
                div.innerHTML = fullText;
            }

            if (node.tooltipText) {
                div.setAttribute('data-tooltip', node.tooltipText);
            }

        } else if (node.tipo === 'title') {
            div.classList.add('drawio-title');
            div.innerHTML = node.text;
        } else {
            // Retângulo azul claro
            div.classList.add('drawio-rect');
            div.innerHTML = node.text.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
        }

        container.appendChild(div);
    });

    // PASSO 5: Linhas (SVG Customizado)
    window.drawioTimeout = setTimeout(() => {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.zIndex = "1";
        svg.style.pointerEvents = "none";
        svg.style.overflow = "visible"; // <--- ADICIONE ESTA LINHA: ELA REVELA AS SETAS CORTADAS
        container.appendChild(svg);
        activeLeaderLines.push(svg);

        const fixedPoint = (node, fx, fy) => ({ x: node.x + offsetX + node.w * fx, y: node.y + offsetY + node.h * fy });
        const floatingPoint = (node, refX, refY) => {
            const cx = node.x + node.w / 2;
            const cy = node.y + node.h / 2;
            const dx = refX - cx;
            const dy = refY - cy;
            let px, py;
            if (Math.abs(dx) > Math.abs(dy)) { px = dx > 0 ? node.x + node.w : node.x; py = cy; } 
            else { px = cx; py = dy > 0 ? node.y + node.h : node.y; }
            return { x: px + offsetX, y: py + offsetY };
        };

        edges.forEach(edge => {
            if (hexagonsData[edge.source] || hexagonsData[edge.target]) return;

            const nSource = nodesData[edge.source];
            const nTarget = nodesData[edge.target];
            if (!nSource || !nTarget) return;

            const firstMid = edge.points[0] || { x: nTarget.x + nTarget.w / 2, y: nTarget.y + nTarget.h / 2 };
            const lastMid = edge.points[edge.points.length - 1] || { x: nSource.x + nSource.w / 2, y: nSource.y + nSource.h / 2 };

            const start = (edge.exitX !== null && edge.exitY !== null) ? fixedPoint(nSource, edge.exitX, edge.exitY) : floatingPoint(nSource, firstMid.x, firstMid.y);
            const end = (edge.entryX !== null && edge.entryY !== null) ? fixedPoint(nTarget, edge.entryX, edge.entryY) : floatingPoint(nTarget, lastMid.x, lastMid.y);
            const middle = edge.points.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));
            
            const pointsAttr = [start, ...middle, end].map(p => `${p.x},${p.y}`).join(' ');

            const polyline = document.createElementNS(svgNS, "polyline");
            polyline.setAttribute("points", pointsAttr);
            polyline.setAttribute("fill", "none");
            polyline.setAttribute("stroke", "#6c8ebf");
            polyline.setAttribute("stroke-width", "2");
            if (edge.isDashed) {
                polyline.setAttribute("stroke-dasharray", "6,4");
                polyline.animate([{ strokeDashoffset: '0' }, { strokeDashoffset: '-20' }], { duration: 1200, iterations: Infinity, easing: 'linear' });
            }
            svg.appendChild(polyline);
        });
    }, 200);
}


// -------------------------------------------------------------
// SISTEMA DE TOOLTIP (HEXÁGONOS)
// -------------------------------------------------------------
function initTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    let currentTarget = null;

    function moveTooltip(x, y) {
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y + 15}px`;
    }

    document.addEventListener('mouseover', (e) => {
        // Agora também captura os quadrados totalmente azuis (.drawio-square-full)
        const target = e.target.closest('.drawio-square, .drawio-square-full, .stat-card');
        if (!target || !target.hasAttribute('data-tooltip')) return;

        currentTarget = target;
        tooltip.innerHTML = target.getAttribute('data-tooltip');
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        moveTooltip(e.pageX, e.pageY);
    });

    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('.drawio-square, .drawio-square-full, .stat-card');
        if (!target || !target.hasAttribute('data-tooltip')) return;

        if (currentTarget !== target) {
            currentTarget = target;
            tooltip.innerHTML = target.getAttribute('data-tooltip');
        }

        moveTooltip(e.pageX, e.pageY);
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.drawio-square, .drawio-square-full, .stat-card');
        const relatedTarget = e.relatedTarget;
        const relatedInside = relatedTarget && relatedTarget.closest && relatedTarget.closest('.drawio-square, .drawio-square-full, .stat-card');

        if (!target || !relatedInside) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.style.opacity === '0') {
                    tooltip.style.display = 'none';
                }
            }, 120);
            currentTarget = null;
        }
    });
}


// -------------------------------------------------------------
// SISTEMA CSV
// -------------------------------------------------------------
function loadCSV() {
    fetch('data/base_consolidada.csv')
        .then(response => {
            if (!response.ok) throw new Error("Arquivo não encontrado");
            return response.text();
        })
        .then(csvText => {
            consolidadaData = parseCSV(csvText);
            // GERA OS INDICADORES DA HOME
            renderIntroStats();
            // A tabela de repositório completo não é mais exibida no carregamento inicial
            showRepositoryView('');
        })
        .catch(err => {
            console.warn("Aviso: CSV não carregado.", err);
            document.getElementById('intro-stats').innerHTML = '';
        });
}

function parseCSV(str) {
    const lines = str.split(/\r?\n/).filter(line => line.trim() !== "");
    if(lines.length < 2) return [];
    
    const delimiter = lines[0].includes(';') ? ';' : ',';
    
    function splitRow(rowStr) {
        let result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < rowStr.length; i++) {
            let char = rowStr[i];
            if (char === '"') {
                if (i + 1 < rowStr.length && rowStr[i+1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    const headers = splitRow(lines[0]).map(h => h.trim().toLowerCase());
    
    const data = [];
    for(let i = 1; i < lines.length; i++) {
        let rowArray = splitRow(lines[i]);
        
        // NOVO: Limpa resíduos de aspas e ignora a linha se ela inteira for vazia 
        rowArray = rowArray.map(val => val.replace(/^"|"$/g, '').trim());
        if (rowArray.join('').trim() === '') continue; // Acaba com o bug da tabela em branco

        let obj = {};
        headers.forEach((h, idx) => {
            obj[h] = rowArray[idx] ? rowArray[idx] : "";
        });
        
        obj._rawString = lines[i].toLowerCase();
        data.push(obj);
    }
    return data;
}

function normalizeTipoValue(value) {
    const normalized = removeAcentos(String(value || '').trim()).toLowerCase();
    return normalized === '-' ? '' : normalized;
}

function renderTable(theme) {
    const tbodyEspecificas = document.getElementById('laws-body-especificas');
    const tbodyAmbientais = document.getElementById('laws-body-ambientais');
    const tbodyTheme = document.getElementById('laws-body-theme');

    if (tbodyEspecificas) tbodyEspecificas.innerHTML = '';
    if (tbodyAmbientais) tbodyAmbientais.innerHTML = '';
    if (tbodyTheme) tbodyTheme.innerHTML = '';

    const themeClean = removeAcentos(theme).toLowerCase();
    
    const getCol = (row, possibleNames) => {
        for(let key of Object.keys(row)) {
            const keyClean = removeAcentos(key).toLowerCase();
            const match = possibleNames.some(name => keyClean.includes(removeAcentos(name).toLowerCase()));
            if (match) return (row[key] && String(row[key]).trim() !== "") ? String(row[key]).trim() : "-";
        }
        return "-";
    };

    let dadosProcessados = [];
    
    consolidadaData.forEach(row => {
        const macrotemaKeys = Object.keys(row).filter(k => removeAcentos(k).toLowerCase().includes('macrotema'));
        let valMacrotema = macrotemaKeys.length > 0 ? row[macrotemaKeys[0]] : "";
        const macrotemaClean = removeAcentos(valMacrotema || "").toLowerCase();
        
        if (!theme || macrotemaClean.includes(themeClean)) {
            const valNorma = getCol(row, ['nº', 'numero', 'norma', 'lei']);
            const valNome = getCol(row, ['nome', 'definição', 'iniciativa']);
            const valDesc = getCol(row, ['ementa', 'descrição', 'descricao']);
            const valComp = getCol(row, ['competência', 'competencia', 'esfera']);
            const valRelacao = getCol(row, ['relação', 'relacao', 'setor energético']); // Puxa a nova coluna
            let valLink = getCol(row, ['link']);
            const valTipo = getCol(row, ['tipo']);
            
            if (valNorma !== "-" || valNome !== "-" || valDesc !== "-") {
                dadosProcessados.push({
                    macrotema: valMacrotema, norma: valNorma, nome: valNome,
                    desc: valDesc, relacao: valRelacao, comp: valComp,
                    link: valLink, tipo: valTipo
                });
            }
        }
    });

    // Filtros Globais Sincronizados
    if (globalCompFilter !== "todas") {
        dadosProcessados = dadosProcessados.filter(item => removeAcentos(item.comp).toLowerCase().includes(globalCompFilter));
    }
    if (globalTipoFilter !== "todas") {
        dadosProcessados = dadosProcessados.filter(item => removeAcentos(item.tipo).toLowerCase().includes(globalTipoFilter));
    }
    if (currentTipoFilterValues.length > 0) {
        dadosProcessados = dadosProcessados.filter(item => currentTipoFilterValues.includes(item.tipo));
    }

    // Renderização das Linhas
    if (!theme) {
        // MODO PÁGINA INICIAL: Exibe as duas tabelas sanfonadas
        document.getElementById('home-tables-container').style.display = 'block';
        document.getElementById('theme-table-container').style.display = 'none';

        const ambientais = dadosProcessados.filter(i => removeAcentos(i.macrotema).toLowerCase().includes('licenciamento ambiental'));
        const especificas = dadosProcessados.filter(i => !removeAcentos(i.macrotema).toLowerCase().includes('licenciamento ambiental'));

        const renderRows = (arr, tbody, isAmbiental) => {
            if (arr.length === 0) {
                tbody.innerHTML = `<tr><td colspan="${isAmbiental ? 7 : 6}" class="no-data">Nenhuma legislação encontrada para os filtros selecionados.</td></tr>`;
                return;
            }
            arr.forEach(item => {
                const tr = document.createElement('tr');
                let linkHtml = item.link !== "-" && item.link !== "" ? `<a href="${item.link}" target="_blank" class="link-btn">Acessar</a>` : "-";
                
                if (isAmbiental) {
                    tr.innerHTML = `<td>${item.tipo}</td><td><strong>${item.norma}</strong></td><td>${item.nome}</td><td>${item.desc}</td><td>${item.relacao}</td><td>${item.comp}</td><td style="text-align:center;">${linkHtml}</td>`;
                } else {
                    tr.innerHTML = `<td>${item.tipo}</td><td><strong>${item.norma}</strong></td><td>${item.nome}</td><td>${item.desc}</td><td>${item.comp}</td><td style="text-align:center;">${linkHtml}</td>`;
                }
                tbody.appendChild(tr);
            });
        };

        renderRows(especificas, tbodyEspecificas, false);
        renderRows(ambientais, tbodyAmbientais, true);

    } else {
        // MODO MACROTEMA: Exibe a tabela unificada padrão
        document.getElementById('home-tables-container').style.display = 'none';
        document.getElementById('theme-table-container').style.display = 'block';

        if (dadosProcessados.length === 0) {
            tbodyTheme.innerHTML = `<tr><td colspan="7" class="no-data">Nenhuma legislação encontrada para os filtros selecionados.</td></tr>`;
            return;
        }
        dadosProcessados.forEach(item => {
            const tr = document.createElement('tr');
            let linkHtml = item.link !== "-" && item.link !== "" ? `<a href="${item.link}" target="_blank" class="link-btn">Acessar</a>` : "-";
            tr.innerHTML = `<td>${item.tipo}</td><td><strong>${item.norma}</strong></td><td>${item.nome}</td><td>${item.desc}</td><td>${item.relacao}</td><td>${item.comp}</td><td style="text-align:center;">${linkHtml}</td>`;
            tbodyTheme.appendChild(tr);
        });
    }
}

function renderIntroStats() {
    const statsContainer = document.getElementById('intro-stats');
    const normativasContainer = document.getElementById('stat-normativas-container');
    if (!statsContainer) return;

    let totalNormas = 0;
    let totalEstaduais = 0;
    let totalFederais = 0;
    let temasComLeis = new Set(); 
    let tipoCounts = {};

    const matchesTipoFilter = (tipo) => {
        if (currentTipoFilterValues.length === 0) return true;
        return currentTipoFilterValues.includes(tipo);
    };

    const getColVal = (row, possibleNames) => {
        for(let key of Object.keys(row)) {
            const keyClean = removeAcentos(key).toLowerCase().trim();
            const match = possibleNames.some(name => keyClean.includes(removeAcentos(name).toLowerCase()));
            if (match) return String(row[key] || "").trim();
        }
        return "";
    };

    consolidadaData.forEach(row => {
        const valNorma = getColVal(row, ['nº', 'numero', 'norma', 'lei']);
        const valComp = getColVal(row, ['competência', 'competencia', 'esfera']);
        const valMacrotema = getColVal(row, ['macrotema']);
        const valTipo = getColVal(row, ['tipo']);

        if (valNorma !== "") {
            const tipoChave = valTipo || "Outros";
            tipoCounts[tipoChave] = (tipoCounts[tipoChave] || 0) + 1;

            if (matchesTipoFilter(valTipo)) {
                totalNormas++;
                const compLower = removeAcentos(valComp).toLowerCase();
                if (compLower.includes("estadual")) totalEstaduais++;
                if (compLower.includes("federal")) totalFederais++;
                const temaNormalizado = THEMES.find(t => removeAcentos(valMacrotema).toLowerCase().includes(removeAcentos(t).toLowerCase()));
                if (temaNormalizado) temasComLeis.add(temaNormalizado);
            }
        }
    });

    if (normativasContainer) {
        normativasContainer.innerHTML = `
            <div class="stat-card" style="width: 100%; max-width: 320px; margin:0 auto 10px; border: none; box-shadow: none;" data-tooltip="Total de leis, decretos, resoluções e regulamentos mapeados.">
                <span class="stat-number" style="font-size: 44px;">${totalNormas}</span>
                <span class="stat-label">Normativas Mapeadas</span>
            </div>
        `;
    }

    statsContainer.innerHTML = `
        <div class="stat-card" data-tooltip="Grandes áreas de atuação que agrupam a legislação por assunto, facilitando a consulta e a compreensão do arcabouço legal.">
            <span class="stat-number">${temasComLeis.size}</span>
            <span class="stat-label">Macrotemas</span>
        </div>
        <div class="stat-card" data-tooltip="Legislações e diretrizes estabelecidas pelo poder público estadual para planejar, regular e incentivar o desenvolvimento energético no âmbito local.">
            <span class="stat-number">${totalEstaduais}</span>
            <span class="stat-label">Normas Estaduais</span>
        </div>
        <div class="stat-card" data-tooltip="Leis e resoluções de alcance nacional, editadas pela União e agências reguladoras (como a ANEEL), que formam as bases fundamentais do setor elétrico.">
            <span class="stat-number">${totalFederais}</span>
            <span class="stat-label">Normas Federais</span>
        </div>
    `;

    renderTipoChart(tipoCounts);
}

function renderTipoChart(tipoCounts) {
    const ctx = document.getElementById('tipoChart');
    if (!ctx) return;

    const totalCount = Object.values(tipoCounts).reduce((sum, value) => sum + value, 0);
    const groupedCounts = {};
    let smallCount = 0;
    let smallTipos = [];
    tipoChartGroupMap = {};

    Object.entries(tipoCounts).forEach(([tipo, count]) => {
        const percentage = totalCount > 0 ? count / totalCount : 0;
        if (!tipo || tipo === "Outros" || percentage <= 0.02) {
            smallCount += count;
            smallTipos.push(tipo || "");
            return;
        }

        groupedCounts[tipo] = count;
        tipoChartGroupMap[tipo] = [tipo];
    });

    if (smallCount > 0) {
        groupedCounts.Outros = (groupedCounts.Outros || 0) + smallCount;
        tipoChartGroupMap.Outros = [...new Set(smallTipos)];
    }

    const labels = Object.keys(groupedCounts);
    const data = labels.map(label => groupedCounts[label]);
    const colors = ['#1351B4', '#2c3e50', '#6c8ebf', '#e9f2ff', '#a3c2e0', '#185abc', '#ced4da'];

    if (tipoChartInstance) {
        tipoChartInstance.data.labels = labels;
        tipoChartInstance.data.datasets[0].data = data;
        tipoChartInstance.update();
        return;
    }

    Chart.register(ChartDataLabels);

    tipoChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const selectedTipo = tipoChartInstance.data.labels[index];

                    if (currentTipoFilter === selectedTipo) {
                        currentTipoFilter = "";
                        currentTipoFilterValues = [];
                        document.getElementById('chart-reset-container').style.display = 'none';
                    } else {
                        currentTipoFilter = selectedTipo;
                        currentTipoFilterValues = tipoChartGroupMap[selectedTipo] || [selectedTipo];
                        document.getElementById('chart-reset-container').style.display = 'block';
                    }

                    renderIntroStats();
                    renderTable(currentSelectedTheme);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) { return ` ${context.label}: ${context.parsed} Normativas`; }
                    }
                },
                datalabels: {
                    color: '#333',
                    anchor: 'end',
                    align: 'end',
                    offset: 6,
                    clamp: true,
                    clip: false,
                    formatter: (value, context) => {
                        const total = context.chart._metasets[context.datasetIndex].total;
                        const percentage = total > 0 ? Math.round((value / total) * 100) + '%' : '0%';
                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}\n${percentage}`;
                    },
                    font: { weight: 'bold', size: 10 },
                    textAlign: 'center'
                }
            },
            // SUBSTITUA APENAS ESTA PARTE DO LAYOUT:
            layout: { 
                padding: {
                    top: 40,
                    bottom: 30,
                    left: 110,  /* Espaço generoso para os nomes longos na esquerda */
                    right: 70  /* Espaço generoso para os nomes longos na direita */
                } 
            }
        }
    });

    document.getElementById('reset-tipo-btn').addEventListener('click', () => {
        currentTipoFilter = "";
        currentTipoFilterValues = [];
        document.getElementById('chart-reset-container').style.display = 'none';
        renderIntroStats();
        renderTable(currentSelectedTheme);
    });
}