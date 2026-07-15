const THEMES = [
    "Setor elétrico: arquitetura institucional e marco regulatório",
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
    "Setor elétrico: arquitetura institucional e marco regulatório": "setor_eletrico.xml",
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

let consolidadaData = [];
let activeLeaderLines = []; 
let currentSelectedTheme = ""; // NOVO: Guarda o tema que está ativo na tela
let diagramRequestCounter = 0; // Controla requisições concorrentes para evitar que diagramas antigos sobreponham os novos.

document.addEventListener("DOMContentLoaded", () => {
    initUI();
    loadCSV();
    initTooltip();

    // NOVO: Faz a tabela atualizar sozinha quando mudar o botão de competência
    const filterComp = document.getElementById('filter-competencia');
    if (filterComp) {
        filterComp.addEventListener('change', () => {
            renderTable(currentSelectedTheme || '');
        });
    }
});

function removeAcentos(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
        // Se um tema for selecionado, o título é o tema. Senão, é o título geral.
        titleElement.textContent = selectedTheme ? `Legislação: ${selectedTheme}` : 'Repositório Completo de Normas';
    }
    renderTable(selectedTheme || '');
}

function goToHome() {
    currentSelectedTheme = ''; 
    
    // Mostra o botão "Voltar"
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'visible';
    
    document.getElementById('animated-menu').classList.remove('is-open');

    // Mostra a introdução e a tabela completa
    document.getElementById('intro-section').style.display = 'flex';
    showRepositoryView(''); // Exibe a tabela com todos os itens
    // Garante que as outras seções específicas de temas estejam ocultas
    document.getElementById('reclamacao-section').style.display = 'none';
    document.getElementById('mindmap-section').style.display = 'none';

    // Limpa as linhas do mapa mental
    activeLeaderLines.forEach(line => line.remove());
    activeLeaderLines = [];

    // Atualiza o estado ativo dos botões do menu
    document.querySelectorAll('.menu-btn').forEach(el => {
        if (el.textContent.includes('Página inicial')) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

function selectTheme(selectedTheme) {
    currentSelectedTheme = selectedTheme; 
    
    // Deixa o botão invisível, mas mantendo o espaço dele no layout
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'hidden';
    
    // ESCONDE A INTRODUÇÃO
    document.getElementById('intro-section').style.display = 'none';
    
    document.getElementById('animated-menu').classList.remove('is-open');
    
    // Reseta o filtro para "Todas" ao clicar num tema novo no menu
    const filterComp = document.getElementById('filter-competencia');
    if (filterComp) filterComp.value = 'todas';

    const reclamacaoSection = document.getElementById('reclamacao-section');
    if (selectedTheme.toLowerCase().includes("direito do consumidor")) {
        reclamacaoSection.style.display = 'block';
    } else { 
        reclamacaoSection.style.display = 'none';
    }

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
    container.style.minHeight = '600px';
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

    // Novo cálculo sem o limite de largura
    const containerWidth = Math.max(900, drawWidth + 160);
    const containerHeight = Math.max(600, drawHeight + 180);

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

function renderTable(theme) {
    const tbody = document.getElementById('laws-body');
    tbody.innerHTML = '';

    const themeClean = removeAcentos(theme).toLowerCase();
    const compFilter = document.getElementById('filter-competencia').value; // Pega valor selecionado ('todas', 'estadual', 'federal')
    
    const getCol = (row, possibleNames) => {
        for(let key of Object.keys(row)) {
            const keyClean = removeAcentos(key).toLowerCase();
            const match = possibleNames.some(name => keyClean.includes(removeAcentos(name).toLowerCase()));
            if (match) return (row[key] && String(row[key]).trim() !== "") ? String(row[key]).trim() : "-";
        }
        return "-";
    };

    let dadosProcessados = [];
    
    // Passo 1: Puxar do CSV e filtrar apenas por Tema, ignorando linhas mal formatadas
    consolidadaData.forEach(row => {
        // Encontra em qual chave/coluna está o nome do macrotema (para ter flexibilidade se mudar o cabeçalho)
        const macrotemaKeys = Object.keys(row).filter(k => removeAcentos(k).toLowerCase().includes('macrotema'));
        let valMacrotema = macrotemaKeys.length > 0 ? row[macrotemaKeys[0]] : "";

        const macrotemaClean = removeAcentos(valMacrotema || "").toLowerCase();
        const rawStringClean = removeAcentos(row._rawString || "").toLowerCase();
        
        // Verifica se a linha pertence ao macrotema clicado no menu
        if (macrotemaClean.includes(themeClean) || rawStringClean.includes(themeClean)) {
            
            const valNorma = getCol(row, ['nº', 'numero', 'norma', 'lei']);
            const valNome = getCol(row, ['nome', 'definição', 'iniciativa']);
            const valDesc = getCol(row, ['ementa', 'descrição', 'descricao']);
            const valComp = getCol(row, ['competência', 'competencia', 'esfera']);
            let valLink = getCol(row, ['link']);
            
            // Medida extra: Exclui a linha se os três campos mais importantes estiverem vazios (isso previne "tabela branca")
            if (valNorma !== "-" || valNome !== "-" || valDesc !== "-") {
                dadosProcessados.push({
                    norma: valNorma,
                    nome: valNome,
                    desc: valDesc,
                    comp: valComp,
                    link: valLink
                });
            }
        }
    });

    // Passo 2: O Novo Filtro por Competência (Estadual ou Federal)
    if (compFilter !== "todas") {
        dadosProcessados = dadosProcessados.filter(item => {
            const compLower = removeAcentos(item.comp).toLowerCase();
            if (compFilter === "estadual") return compLower.includes("estadual");
            if (compFilter === "federal") return compLower.includes("federal");
            return true;
        });
    }

    // Passo 3: Renderizar Tabela no HTML
    if (dadosProcessados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="no-data">Nenhuma legislação encontrada para os filtros selecionados.</td></tr>`;
        return;
    }

    dadosProcessados.forEach(item => {
        const tr = document.createElement('tr');
        
        let linkHtml = "-";
        if (item.link !== "-" && item.link !== "") {
            linkHtml = `<a href="${item.link}" target="_blank" class="link-btn">Acessar</a>`;
        }

        tr.innerHTML = `
            <td><strong>${item.norma}</strong></td>
            <td>${item.nome}</td>
            <td>${item.desc}</td>
            <td>${item.comp}</td>
            <td style="text-align:center;">${linkHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

// COLOQUE ESTA FUNÇÃO NO FINAL DO ARQUIVO JS
function renderIntroStats() {
    const statsContainer = document.getElementById('intro-stats');
    if (!statsContainer) return;

    let totalNormas = 0;
    let totalEstaduais = 0;
    let totalFederais = 0;

    // Em vez de contar o que o CSV diz, vamos verificar 
    // quais dos 10 temas oficiais realmente possuem leis cadastradas
    let temasComLeis = new Set(); 

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

        if (valNorma !== "") {
            totalNormas++;
            
            const compLower = removeAcentos(valComp).toLowerCase();
            if (compLower.includes("estadual")) totalEstaduais++;
            if (compLower.includes("federal")) totalFederais++;
            
            // Só adiciona se o tema do CSV existir na nossa lista oficial (THEMES)
            // Isso ignora erros de digitação ou temas extras
            const temaNormalizado = THEMES.find(t => removeAcentos(t).toLowerCase() === removeAcentos(valMacrotema).toLowerCase());
            if (temaNormalizado) {
                temasComLeis.add(temaNormalizado);
            }
        }
    });

    statsContainer.innerHTML = `
        <div class="stat-card" data-tooltip="Total de leis, decretos, resoluções e regulamentos em vigor que estruturam, orientam e ditam as regras do setor de energia.">
            <span class="stat-number">${totalNormas}</span>
            <span class="stat-label">Normativas Mapeadas</span>
        </div>
        <div class="stat-card" data-tooltip="Grandes áreas de atuação que agrupam a legislação por assunto, facilitando a consulta e a compreensão do arcabouço legal.">
            <span class="stat-number">${THEMES.length}</span>
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
}