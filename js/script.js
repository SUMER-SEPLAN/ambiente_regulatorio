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
    "Planejamento Energético": "O planejamento energético é o processo pelo qual o poder público antecipa as necessidades futuras de energia e orienta a expansão do setor. A partir de projeções de demanda, cenários econômicos, disponibilidade de recursos, evolução tecnológica e critérios socioambientais, são definidas estratégias para garantir segurança energética, qualidade do fornecimento, modicidade de custos e desenvolvimento sustentável.<br><br>O planejamento não se resume a um único documento, ele se consolida por meio de instrumentos complementares, organizados em diferentes horizontes de tempo e níveis de decisão: desde a visão estratégica nacional de longo prazo até a definição de novas linhas de transmissão, reforços na rede elétrica e obras nos sistemas de distribuição.<br><br>Nesta página, você conhecerá:<br>• os principais instrumentos do planejamento energético brasileiro;<br>• a finalidade e o funcionamento de cada instrumento;<br>• os órgãos responsáveis por sua elaboração e implementação;<br>• as normas que estruturam o tema;<br>• os links oficiais para consulta dos planos, estudos e bases de dados.",
    "Transição Energética e Novas tecnologias": "A transição energética é a transformação gradual da forma como a energia é produzida, transportada, armazenada e consumida. Mais do que substituir combustíveis fósseis por fontes renováveis, esse processo envolve modernizar infraestruturas, desenvolver novas cadeias produtivas, ampliar a eficiência energética e incorporar tecnologias capazes de reduzir emissões de gases de efeito estufa.",
    "Licenciamento Ambiental": "Todo empreendimento de energia deve passar por um rigoroso processo de licenciamento ambiental para garantir sua sustentabilidade. Este tema detalha as etapas do licenciamento (Licença Prévia, de Instalação e de Operação), os estudos ambientais exigidos (EIA/RIMA) e os órgãos responsáveis pela aprovação dos projetos."
};

// DADOS DOS CARDS ORGANIZADOS POR TEMA
// DADOS DOS CARDS ORGANIZADOS POR TEMA
const THEME_CARDS_DATA = {
    "Planejamento Energético": [
        {
            title: "Diretriz estratégica",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Plano Nacional de Energia — PNE</div>
                <p>O Plano Nacional de Energia é o principal instrumento de planejamento energético de longo prazo do país. Ele analisa diferentes cenários para a evolução da demanda e da oferta de energia, considerando mudanças econômicas, tecnológicas, sociais e ambientais.</p>
                <p>O PNE não determina diretamente quais obras serão executadas. Sua função é orientar políticas públicas e escolhas estratégicas relacionadas à segurança energética, à diversificação da matriz, à transição energética, à eficiência energética e à expansão sustentável da infraestrutura.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>construir cenários para o futuro energético do país;</li>
                    <li>avaliar riscos, oportunidades e incertezas;</li>
                    <li>orientar políticas energéticas nacionais;</li>
                    <li>apoiar decisões relacionadas à transição energética; e</li>
                    <li>oferecer referências de longo prazo para o setor público e os investidores.</li>
                </ul>
                <p><strong>RESPONSÁVEIS</strong> elaborado pela Empresa de Pesquisa Energética — EPE, sob coordenação e diretrizes do Ministério de Minas e Energia — MME.</p>
                <p><strong>HORIZONTE</strong> no mínimo 30 anos, com publicação prevista a cada cinco anos.</p>
                <p>Essas características estão estabelecidas pela Portaria MME nº 6/2020.</p>
            `,
            links: [{text: "ACESSAR › Acessar o Plano Nacional de Energia — EPE", url: "#"}]
        },
        {
            title: "Planejamento integrado da expansão",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Plano Decenal de Expansão de Energia — PDE</div>
                <p>O Plano Decenal de Expansão de Energia apresenta as perspectivas de crescimento do setor energético para os dez anos seguintes. Ele aproxima a visão estratégica do PNE das decisões que precisam ser avaliadas no médio prazo.</p>
                <p>Elaborado anualmente, o PDE analisa de forma integrada a evolução da demanda e a expansão da oferta de energia, abrangendo geração elétrica, transmissão, petróleo, gás natural, biocombustíveis, eficiência energética e demais fontes.</p>
                <p>É importante destacar que o PDE possui caráter indicativo: ele sinaliza trajetórias e necessidades de expansão, mas não representa, por si só, uma autorização para a execução de obras.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>projetar a demanda de energia;</li>
                    <li>avaliar a necessidade de expansão da geração e da transmissão;</li>
                    <li>estimar investimentos no setor;</li>
                    <li>analisar segurança energética e disponibilidade de combustíveis;</li>
                    <li>incorporar condicionantes econômicos e socioambientais; e</li>
                    <li>subsidiar políticas públicas, leilões e decisões de investimento.</li>
                </ul>
                <p><strong>RESPONSÁVEIS</strong> elaborado pela EPE, sob diretrizes e coordenação do MME.</p>
                <p><strong>HORIZONTE</strong> dez anos, com atualização anual.</p>
            `,
            links: [{text: "ACESSAR › Acessar o Plano Decenal de Expansão de Energia — EPE", url: "#"}]
        },
        {
            title: "Expansão da transmissão",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">PET/PELP e POTEE</div>
                <p>O planejamento da transmissão identifica as linhas, subestações, transformadores e demais equipamentos necessários para transportar a energia dos centros de geração até as regiões consumidoras.</p>
                <p>Esse processo envolve diferentes instituições, com funções complementares:</p>
                <ul>
                    <li>A EPE coordena os estudos estruturais de expansão da transmissão.</li>
                    <li>As recomendações desses estudos são organizadas no PET/PELP.</li>
                    <li>ONS identifica necessidades relacionadas à segurança e ao desempenho operativo por meio do PAR/PEL.</li>
                    <li>MME compatibiliza e consolida as recomendações no POTEE.</li>
                    <li>A ANEEL conduz os processos de licitação e autorização dos empreendimentos.</li>
                </ul>
                <p><strong>PET — Programa de Expansão da Transmissão:</strong> Reúne as instalações consideradas prioritárias para a expansão da transmissão no horizonte mais próximo.</p>
                <p><strong>PELP — Plano de Expansão de Longo Prazo:</strong> Apresenta as necessidades estruturais da rede em horizonte mais amplo, permitindo antecipar corredores de transmissão, novas interligações e soluções necessárias ao crescimento do sistema.</p>
                <p>O PET e o PELP são publicados conjuntamente pela EPE e atualizados semestralmente. O documento reúne obras recomendadas pelos estudos de planejamento que ainda não foram licitadas ou autorizadas.</p>
                <p><strong>POTEE — Plano de Outorgas de Transmissão de Energia Elétrica:</strong> O POTEE consolida as obras consideradas necessárias para a expansão do sistema e orienta sua inclusão nos processos de outorga. Pode contemplar novas linhas, subestações, ampliações, reforços e equipamentos associados.</p>
                <p><strong>RESPONSÁVEL</strong> Ministério de Minas e Energia, a partir dos estudos da EPE e das indicações do ONS. Desdobramento: as obras são encaminhadas à ANEEL para licitação ou autorização, conforme o caso.</p>
            `,
            links: [{text: "ACESSAR › Acessar o POTEE — MME", url: "#"}]
        },
        {
            title: "Planejamento da operação elétrica",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">PAR/PEL — Plano da Operação Elétrica de Médio Prazo do SIN</div>
                <p>O PAR/PEL avalia como o Sistema Interligado Nacional deverá operar nos cinco anos seguintes, verificando se a rede prevista será capaz de atender à demanda e integrar novos empreendimentos com segurança e confiabilidade.</p>
                <p>O plano combina duas perspectivas:</p>
                <ul>
                    <li><strong>enfoque operativo</strong>, concentrado nos dois primeiros anos, com medidas para contornar restrições enquanto as soluções estruturais não estão disponíveis;</li>
                    <li><strong>enfoque estruturante</strong>, voltado aos três anos seguintes, com indicação de ampliações, reforços, melhorias e eventuais ajustes no cronograma de expansão da transmissão.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>avaliar o desempenho futuro do SIN;</li>
                    <li>identificar riscos de sobrecarga ou restrições elétricas;</li>
                    <li>recomendar medidas operativas;</li>
                    <li>indicar ampliações, reforços e melhorias;</li>
                    <li>apoiar a integração de novas usinas e cargas;</li>
                    <li>preservar a segurança e a confiabilidade da operação.</li>
                </ul>
                <p><strong>RESPONSÁVEL</strong> Operador Nacional do Sistema Elétrico — ONS.</p>
                <p><strong>HORIZONTE</strong> cinco anos, com elaboração anual.</p>
            `,
            links: [{text: "ACESSAR › Acessar o PAR/PEL — ONS", url: "#"}]
        },
        {
            title: "Planejamento da distribuição",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">PDD — Plano de Desenvolvimento da Distribuição</div>
                <p>O PDD consolida os estudos realizados pelas distribuidoras para orientar a expansão e a modernização das redes que entregam energia aos consumidores.</p>
                <p>O documento considera o crescimento da carga, as características de cada área de concessão, a necessidade de novas subestações e redes, a renovação de ativos e a melhoria da qualidade do fornecimento.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>projetar o crescimento da demanda;</li>
                    <li>planejar novas redes e subestações;</li>
                    <li>identificar reforços e ampliações;</li>
                    <li>modernizar e renovar os ativos de distribuição;</li>
                    <li>melhorar a continuidade e a qualidade do serviço;</li>
                    <li>subsidiar conexões de consumidores e empreendimentos; e</li>
                    <li>apoiar o atendimento de áreas urbanas, rurais e regiões em expansão.</li>
                </ul>
                <p><strong>RESPONSÁVEIS</strong> cada concessionária ou permissionária elabora o PDD de sua área de atuação e encaminha as informações à ANEEL.</p>
                <p>Base regulatória: Módulo 2 dos Procedimentos de Distribuição — PRODIST, aprovado pela Resolução Normativa ANEEL nº 956/2021.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar o Módulo 2 do PRODIST", url: "#"},
                {text: "ACESSAR › Consultar os dados do PDD — ANEEL", url: "#"}
            ]
        },
        {
            title: "Planejamento energético do Piauí",
            content: `
                <p>O planejamento nacional precisa ser complementado por uma leitura territorial. No Piauí, instrumentos estaduais permitem conhecer a evolução da geração, do consumo, da infraestrutura e das necessidades energéticas dos diferentes territórios.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Balanço Energético do Estado do Piauí</div>
                <p>O Balanço Energético do Estado do Piauí reúne indicadores sobre capacidade instalada, geração centralizada e distribuída, consumo, demanda, fontes energéticas e empreendimentos em diferentes estágios de implantação.</p>
                <p>Ele funciona como instrumento de diagnóstico e acompanhamento da realidade eletroenergética estadual.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">PEEPI — Planejamento Eletroenergético do Estado do Piauí</div>
                <p>O PEEPI deverá consolidar uma visão estratégica para o desenvolvimento energético do estado, articulando disponibilidade de energia, expansão da infraestrutura, desenvolvimento produtivo, transição energética, segurança energética e redução das desigualdades territoriais.</p>
                <p>Entre seus possíveis usos estão:</p>
                <ul>
                    <li>identificar gargalos de transmissão e distribuição;</li>
                    <li>projetar a demanda energética dos territórios;</li>
                    <li>orientar investimentos públicos e privados;</li>
                    <li>apoiar a atração de atividades produtivas;</li>
                    <li>ampliar o acesso à energia de qualidade; e</li>
                    <li>transformar o potencial renovável do Piauí em desenvolvimento econômico e social.</li>
                </ul>
                <p><strong>RESPONSÁVEL</strong> Governo do Estado do Piauí, sob coordenação da SEPLAN e com participação de instituições estaduais e parceiros técnicos.</p>
                <p><strong>STATUS</strong> Em elaboração em agosto de 2026. O acesso será disponibilizado após a publicação oficial.</p>
            `,
            links: [{text: "ACESSAR › Acessar o Painel de Energia do Piauí", url: "#"}]
        },
        {
            title: "Base legal e regulatória",
            content: `
                <ul>
                    <li><strong>Lei nº 9.478/1997:</strong> Institui os princípios e objetivos da Política Energética Nacional e cria o Conselho Nacional de Política Energética — CNPE.</li>
                    <li style="margin-top: 10px;"><strong>Lei nº 9.648/1998:</strong> Estabelece atribuições relacionadas à coordenação e ao controle da operação do Sistema Interligado Nacional e fundamenta a atuação do ONS, inclusive na proposição de ampliações e reforços da Rede Básica.</li>
                    <li style="margin-top: 10px;"><strong>Lei nº 10.847/2004:</strong> Autoriza a criação da EPE e estabelece sua finalidade de produzir estudos e pesquisas destinados a subsidiar o planejamento do setor energético.</li>
                    <li style="margin-top: 10px;"><strong>Lei nº 10.848/2004:</strong> Estrutura o modelo de comercialização de energia elétrica, cria bases para a CCEE e o CMSE e disciplina mecanismos relacionados à expansão e à segurança do suprimento.</li>
                    <li style="margin-top: 10px;"><strong>Decreto nº 5.081/2004:</strong> Regulamenta a organização e as atribuições do ONS, incluindo o planejamento e a programação da operação e a proposição de ampliações e reforços do SIN.</li>
                    <li style="margin-top: 10px;"><strong>Decreto nº 5.163/2004:</strong> Regulamenta aspectos da comercialização e das outorgas e estabelece disposições sobre o planejamento da expansão da geração e da transmissão.</li>
                </ul>
            `,
            links: []
        }
    ],

    "Transição Energética e Novas tecnologias": [
        {
            title: "Base da transição energética",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Política Nacional sobre Mudança do Clima — PNMC (Lei nº 12.187/2009)</div>
                <p>A Política Nacional sobre Mudança do Clima estabelece os princípios, objetivos, diretrizes e instrumentos da atuação brasileira no enfrentamento das mudanças climáticas.</p>
                <p>Embora não seja uma política exclusivamente energética, a PNMC constitui uma das bases legais da transição energética. A lei define a mitigação como a implementação de mudanças e substituições tecnológicas capazes de reduzir o uso de recursos e as emissões de gases de efeito estufa.</p>
                <p>Sua relação com o setor energético ocorre porque grande parte da redução de emissões depende de mudanças na produção e no consumo de energia, especialmente nos transportes, na indústria, na geração elétrica e no uso de combustíveis.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Como se relaciona com a transição energética</p>
                <ul>
                    <li>orienta a formulação de medidas de mitigação de emissões;</li>
                    <li>prevê planos setoriais para uma economia de baixo carbono;</li>
                    <li>estimula mudanças e substituições tecnológicas;</li>
                    <li>permite a criação de instrumentos econômicos e financeiros;</li>
                    <li>conecta as políticas energéticas aos compromissos climáticos nacionais; e</li>
                    <li>oferece fundamento para políticas de biocombustíveis, hidrogênio, eficiência e mobilidade sustentável.</li>
                </ul>
            `,
            links: [{text: "ACESSAR › Acessar a Lei nº 12.187/2009", url: "#"}]
        },
        {
            title: "Política Nacional de Transição Energética — PNTE",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Resolução CNPE nº 5/2024</div>
                <p>A PNTE organiza e integra os esforços nacionais para a transformação da matriz energética brasileira em direção a uma estrutura de baixa emissão de carbono.</p>
                <p>A política busca articular programas que antes eram conduzidos por diferentes órgãos e setores, promovendo maior coerência entre planejamento energético, política climática, desenvolvimento industrial, inovação, financiamento e inclusão social.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Objetivos centrais</p>
                <ul>
                    <li>contribuir para a neutralidade das emissões líquidas;</li>
                    <li>ampliar a participação de fontes e tecnologias de baixa emissão;</li>
                    <li>preservar a segurança e a confiabilidade energética;</li>
                    <li>estimular inovação e desenvolvimento tecnológico;</li>
                    <li>fortalecer cadeias produtivas nacionais;</li>
                    <li>combater a pobreza energética;</li>
                    <li>promover emprego, renda e desenvolvimento regional; e</li>
                    <li>garantir uma transição justa, inclusiva e sustentável.</li>
                </ul>
                <p>A PNTE possui dois instrumentos principais:</p>
                <ul>
                    <li>PLANTE, responsável por organizar as ações; e</li>
                    <li>FONTE, responsável pela participação e pelo diálogo social.</li>
                </ul>
            `,
            links: [{text: "ACESSAR › Conhecer a Política Nacional de Transição Energética — MME", url: "#"}]
        },
        {
            title: "Governança da transição energética",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Plano Nacional de Transição Energética — Plante</div>
                <p>O Plante é o plano de ações criado para concretizar os objetivos e as diretrizes da PNTE. Enquanto a PNTE indica a direção estratégica, o Plante organiza como a transição deverá acontecer. Ele sistematiza programas federais existentes, identifica sobreposições e lacunas regulatórias e propõe novas iniciativas.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>transformar diretrizes em ações executáveis;</li>
                    <li>definir responsáveis institucionais;</li>
                    <li>organizar metas, etapas e resultados;</li>
                    <li>integrar políticas energéticas, climáticas e industriais;</li>
                    <li>identificar necessidades de regulamentação e financiamento;</li>
                    <li>acompanhar a implementação da transição; e</li>
                    <li>alinhar as ações aos cenários do PNE e do PDE.</li>
                </ul>
                <p><strong>HORIZONTE</strong> longo prazo, organizado em ciclos de implementação de quatro anos.</p>
                <p><strong>RESPONSÁVEIS</strong> coordenado pelo MME, com apoio técnico da EPE e participação de outros ministérios e instituições.</p>
                <p>A minuta submetida à consulta pública em 2026 está estruturada em três pilares:</p>
                <ul>
                    <li>segurança e resiliência do sistema energético;</li>
                    <li>justiça energética, climática e ambiental; e</li>
                    <li>energia competitiva para uma economia de baixo carbono.</li>
                </ul>
                <p><strong>STATUS</strong> O Plante já passou por consulta pública e se encontra em fase de consolidação para posterior aprovação pelo CNPE.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Fórum Nacional de Transição Energética — Fonte</div>
                <p>O Fonte é o instrumento consultivo e permanente de participação social da PNTE. Reúne representantes do governo, dos estados e municípios, da sociedade civil, da academia e do setor produtivo.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>promover diálogo entre governo e sociedade;</li>
                    <li>reunir diferentes perspectivas territoriais e setoriais;</li>
                    <li>apoiar a formulação e o monitoramento da PNTE;</li>
                    <li>acompanhar a implementação do Plante;</li>
                    <li>ampliar a transparência das decisões; e</li>
                    <li>encaminhar recomendações ao CNPE.</li>
                </ul>
                <p><strong>NATUREZA</strong> consultiva. As recomendações do Fonte não substituem as decisões do CNPE ou os atos das agências reguladoras.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Coordenação institucional</div>
                <p>A coordenação federal é exercida pelo Ministério de Minas e Energia, principalmente por meio da:</p>
                <ul>
                    <li>Secretaria Nacional de Transição Energética e Planejamento — SNTEP;</li>
                    <li>Departamento de Transição Energética — DTE; e</li>
                    <li>Coordenação-Geral de Articulação de Políticas para a Transição Energética.</li>
                </ul>
                <p>Essas unidades promovem a articulação entre políticas federais, estaduais e municipais e coordenam os instrumentos da PNTE.</p>
            `,
            links: [
                {text: "ACESSAR › Acessar o Plante — MME", url: "#"},
                {text: "ACESSAR › Acessar o Fórum Nacional de Transição Energética", url: "#"},
                {text: "ACESSAR › Conhecer o Departamento de Transição Energética", url: "#"}
            ]
        },
        {
            title: "Rotas tecnológicas de descarbonização: Hidrogênio",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Programa Nacional do Hidrogênio — PNH2</div>
                <p>O hidrogênio é um vetor energético que pode ser utilizado como matéria-prima industrial, combustível ou meio de armazenamento de energia. A Resolução CNPE nº 6/2021 determinou a elaboração de diretrizes, a Resolução CNPE nº 6/2022 instituiu formalmente o PNH2, e a Resolução CNPE nº 4/2023 o atualizou.</p>
                <p>O PNH2 organiza a atuação federal para o desenvolvimento do mercado e da indústria do hidrogênio no Brasil.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>coordenar a estratégia nacional do hidrogênio;</li>
                    <li>estimular pesquisa, desenvolvimento e inovação;</li>
                    <li>apoiar a formação de uma cadeia produtiva nacional;</li>
                    <li>promover projetos-piloto e hubs de produção;</li>
                    <li>articular órgãos públicos, empresas e academia; e</li>
                    <li>acompanhar a implementação do marco regulatório.</li>
                </ul>
                <p><strong>Governança:</strong> conduzida pelo Comitê Gestor do PNH2 — Coges-PNH2, com coordenação do MME.</p>
            `,
            links: [{text: "ACESSAR › Conhecer a instituição do PNH2", url: "#"}]
        },
        {
            title: "Marco legal do hidrogênio",
            content: `
                <p><strong>Lei nº 14.948/2024:</strong> Institui o marco legal do hidrogênio de baixa emissão de carbono e estabelece: a Política Nacional do Hidrogênio de Baixa Emissão de Carbono; princípios, objetivos e conceitos aplicáveis ao setor; competências regulatórias da ANP; o Sistema Brasileiro de Certificação do Hidrogênio — SBCH₂; o Rehidro; e as bases do PHBC.</p>
                <p><strong>Lei nº 14.990/2024:</strong> Disciplina o Programa de Desenvolvimento do Hidrogênio de Baixa Emissão de Carbono — PHBC e estabelece o mecanismo de concessão de créditos fiscais. Prioriza usos em setores como fertilizantes, siderurgia, cimento, química, petroquímica e transporte pesado.</p>
                <p><strong>Decreto nº 13.096/2026:</strong> Regulamenta as Leis nº 14.948/2024 e nº 14.990/2024 e detalha:</p>
                <ul>
                    <li>a governança da política;</li>
                    <li>o funcionamento do SBCH₂;</li>
                    <li>as competências do Coges-PNH2, ANP, Inmetro e CCEE;</li>
                    <li>a habilitação de projetos no Rehidro; e</li>
                    <li>o procedimento de concessão dos créditos fiscais do PHBC.</li>
                </ul>
            `,
            links: [
                {text: "ACESSAR › Acessar a Lei nº 14.948/2024", url: "#"},
                {text: "ACESSAR › Acessar a Lei nº 14.990/2024", url: "#"},
                {text: "ACESSAR › Acessar o Decreto nº 13.096/2026", url: "#"}
            ]
        },
        {
            title: "Instrumentos de consolidação do hidrogênio",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">SBCH₂ — Sistema Brasileiro de Certificação do Hidrogênio</div>
                <p>O SBCH₂ verifica e registra a intensidade de emissões associada ao hidrogênio ao longo de seu ciclo de vida.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Principais responsáveis</p>
                <ul>
                    <li>Coges-PNH2: autoridade competente;</li>
                    <li>ANP: autoridade reguladora;</li>
                    <li>Inmetro: responsável pela acreditação das certificadoras;</li>
                    <li>CCEE: gestora dos registros; e</li>
                    <li>empresas certificadoras: verificam os projetos e emitem os certificados.</li>
                </ul>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Rehidro</div>
                <p>O Regime Especial de Incentivos para a Produção de Hidrogênio de Baixa Emissão de Carbono reduz o custo de implantação de projetos. Prevê a suspensão de PIS/Pasep e Cofins incidentes sobre determinados bens.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>reduzir custos de investimento;</li>
                    <li>estimular a implantação de projetos;</li>
                    <li>apoiar a infraestrutura da cadeia do hidrogênio;</li>
                    <li>promover conteúdo local e inovação; e</li>
                    <li>aumentar a competitividade da produção nacional.</li>
                </ul>
                <p><strong>RESPONSÁVEIS</strong> MME, ANP e Receita Federal, dentro de suas respectivas competências.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">PHBC</div>
                <p>O Programa de Desenvolvimento do Hidrogênio de Baixa Emissão de Carbono é o mecanismo de apoio econômico à produção e ao uso do hidrogênio. Ele prevê créditos fiscais concedidos por procedimento concorrencial.</p>
                <p><strong>PERÍODO DOS CRÉDITOS</strong> operações realizadas entre 2030 e 2034, conforme a redação atualizada pela Lei nº 15.269/2025.</p>
            `,
            links: []
        },
        {
            title: "Hidrogênio verde no Piauí",
            content: `
                <p><strong>Lei Estadual nº 8.459/2024:</strong> Institui a Política Pública Estadual do Hidrogênio Verde do Piauí. A política busca fomentar a cadeia produtiva estadual, atrair investimentos, ampliar a utilização de fontes renováveis e estimular aplicações como a produção de fertilizantes.</p>
                <p>A legislação estadual utiliza o conceito de hidrogênio verde, associado à produção a partir de fontes renováveis. Já a legislação federal adota o conceito mais amplo de hidrogênio de baixa emissão de carbono, baseado no desempenho ambiental da rota produtiva.</p>
                <p><strong>Resolução CONSEMA nº 52/2023:</strong> Estabelece critérios para o licenciamento ambiental de empreendimentos de produção de hidrogênio verde no Piauí, incluindo enquadramento por porte e estudos ambientais exigidos.</p>
                <p><strong>RESPONSÁVEIS</strong> Conselho Estadual de Meio Ambiente e Desenvolvimento Sustentável — CONSEMA e Secretaria de Estado do Meio Ambiente e Recursos Hídricos — SEMARH.</p>
            `,
            links: [
                {text: "ACESSAR › Acessar a Lei Estadual nº 8.459/2024 no Diário Oficial", url: "#"},
                {text: "ACESSAR › Acessar a Resolução CONSEMA nº 52/2023", url: "#"}
            ]
        },
        {
            title: "Armazenamento de energia",
            content: `
                <p>O armazenamento permite guardar energia em um determinado momento e utilizá-la posteriormente. Entre as tecnologias disponíveis estão baterias, usinas hidrelétricas reversíveis, sistemas térmicos, hidrogênio e outras soluções químicas ou mecânicas.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>deslocar energia de períodos de maior oferta para períodos de maior demanda;</li>
                    <li>reduzir desperdícios e restrições à geração renovável;</li>
                    <li>fornecer potência e flexibilidade ao sistema;</li>
                    <li>prestar serviços ancilares;</li>
                    <li>auxiliar no controle de frequência e tensão;</li>
                    <li>aumentar a estabilidade e a resiliência da rede; e</li>
                    <li>reduzir a necessidade de acionamento de fontes mais emissoras em determinadas situações.</li>
                </ul>
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Lei nº 15.269/2025</div>
                <p>A lei moderniza o marco regulatório do setor elétrico e estabelece as bases legais para a atividade de armazenamento de energia elétrica.</p>
                <p>Entre seus principais efeitos estão:</p>
                <ul>
                    <li>atribuição à ANEEL da competência para regular e fiscalizar o armazenamento;</li>
                    <li>possibilidade de operação autônoma ou integrada a agentes do setor;</li>
                    <li>reconhecimento de serviços como potência, flexibilidade e serviços ancilares;</li>
                    <li>previsão de sistemas de armazenamento na Rede Básica;</li>
                    <li>estabelecimento de regras de acesso e remuneração;</li>
                    <li>previsão de incentivos para sistemas de baterias; e</li>
                    <li>possibilidade de contratação por meio de leilões.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Responsáveis principais</p>
                <ul>
                    <li>MME: política pública e diretrizes de contratação;</li>
                    <li>ANEEL: regulação, acesso, remuneração e fiscalização;</li>
                    <li>EPE: estudos de planejamento;</li>
                    <li>ONS: requisitos operativos e utilização dos sistemas conectados ao SIN.</li>
                </ul>
            `,
            links: [
                {text: "ACESSAR › Acessar a Lei nº 15.269/2025", url: "#"},
                {text: "ACESSAR › Conhecer o LRCAP 2026 — Armazenamento", url: "#"}
            ]
        },
        {
            title: "Combustíveis sustentáveis",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">RenovaBio (Lei nº 13.576/2017)</div>
                <p>O RenovaBio é a Política Nacional de Biocombustíveis. Seu objetivo é ampliar a participação dos biocombustíveis na matriz brasileira e induzir ganhos de eficiência e redução de emissões.</p>
                <p>A política trabalha com três elementos principais:</p>
                <ul>
                    <li>metas nacionais de redução de emissões;</li>
                    <li>metas individuais para distribuidores de combustíveis; e</li>
                    <li>certificação da eficiência energético-ambiental dos produtores e importadores.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Como se relaciona com a transição energética</p>
                <ul>
                    <li>substitui parte dos combustíveis fósseis;</li>
                    <li>estimula combustíveis com menor intensidade de carbono;</li>
                    <li>reconhece diferenças de eficiência entre produtores;</li>
                    <li>transforma redução de emissões em valor econômico; e</li>
                    <li>oferece previsibilidade para investimentos em biocombustíveis.</li>
                </ul>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">CBIO — Crédito de Descarbonização</div>
                <p>O CBIO é o principal instrumento de mercado do RenovaBio. Produtores e importadores de biocombustíveis certificados podem emitir CBIOs de acordo com o volume comercializado e a eficiência ambiental de sua produção.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Responsáveis</p>
                <ul>
                    <li>CNPE: define as metas nacionais;</li>
                    <li>ANP: certifica, regula e fiscaliza;</li>
                    <li>produtores e importadores certificados: geram lastro para emissão;</li>
                    <li>distribuidores: cumprem metas por meio da aposentadoria de créditos; e</li>
                    <li>B3: ambiente de negociação.</li>
                </ul>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Lei do Combustível do Futuro (Lei nº 14.993/2024)</div>
                <p>A Lei do Combustível do Futuro estabelece uma estratégia integrada para a mobilidade sustentável de baixo carbono.</p>
                <p>A norma:</p>
                <ul>
                    <li>amplia os limites legais de mistura de etanol e biodiesel;</li>
                    <li>cria o ProBioQAV;</li>
                    <li>cria o PNDV;</li>
                    <li>cria o programa de descarbonização do gás natural e incentivo ao biometano;</li>
                    <li>regulamenta combustíveis sintéticos;</li>
                    <li>estabelece bases para captura e estocagem geológica de carbono; e</li>
                    <li>integra políticas como RenovaBio, Mover, PBEV e Proconve.</li>
                </ul>
            `,
            links: [
                {text: "ACESSAR › Acessar o RenovaBio — ANP", url: "#"},
                {text: "ACESSAR › Consultar informações e painéis de CBIO — ANP", url: "#"},
                {text: "ACESSAR › Acessar a Lei nº 14.993/2024", url: "#"}
            ]
        },
        {
            title: "ProBioQAV, PNDV e Biometano",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">ProBioQAV e SAF</div>
                <p><strong>Programa Nacional de Combustível Sustentável de Aviação — ProBioQAV:</strong> É o programa público que organiza a introdução do combustível sustentável de aviação na matriz brasileira.</p>
                <p><strong>SAF — Sustainable Aviation Fuel:</strong> É o combustível utilizado para reduzir as emissões da aviação em comparação com o querosene de origem fóssil.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Responsabilidades</p>
                <ul>
                    <li>CNPE e MME: diretrizes da política;</li>
                    <li>ANP: especificação, qualidade, rotas tecnológicas e intensidade de carbono;</li>
                    <li>ANAC: metodologia de verificação e fiscalização das obrigações dos operadores aéreos; e</li>
                    <li>operadores aéreos: cumprimento das metas.</li>
                </ul>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Programa Nacional de Diesel Verde — PNDV</div>
                <p>O PNDV busca introduzir progressivamente o diesel verde na matriz de combustíveis brasileira.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Finalidade</p>
                <ul>
                    <li>ampliar a oferta de combustíveis renováveis;</li>
                    <li>reduzir emissões no transporte pesado;</li>
                    <li>diminuir a dependência de diesel fóssil;</li>
                    <li>estimular biorrefinarias e inovação industrial; e</li>
                    <li>criar mercado para novas rotas produtivas.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Responsáveis</p>
                <ul>
                    <li>CNPE: define a participação mínima obrigatória;</li>
                    <li>MME: coordena o programa;</li>
                    <li>ANP: regulamenta especificações, mistura, qualidade e fiscalização.</li>
                </ul>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Biometano</div>
                <p>Criado pela Lei nº 14.993/2024, o Programa de Descarbonização do Gás Natural e Incentivo ao Biometano estabelece metas de redução de emissões para produtores e importadores de gás natural.</p>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">O cumprimento pode ocorrer por meio:</p>
                <ul>
                    <li>da compra ou utilização de biometano; ou</li>
                    <li>da aquisição e posterior aposentadoria de CGOBs.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">Responsáveis</p>
                <ul>
                    <li>CNPE: definição das metas;</li>
                    <li>MME: coordenação da política;</li>
                    <li>ANP: certificação, metodologia, regulação e fiscalização;</li>
                    <li>produtores e importadores de gás natural: cumprimento das obrigações; e</li>
                    <li>produtores de biometano: produção e geração de lastro para CGOBs.</li>
                </ul>
            `,
            links: [
                {text: "ACESSAR › Acessar o Decreto nº 13.094/2026", url: "#"},
                {text: "ACESSAR › Consultar informações sobre biometano — ANP", url: "#"}
            ]
        }
    ],

    "Conexão e Acesso à Rede": [
        {
            title: "Padrão de entrada gratuito",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 49</p>
                <p>O dispositivo assegura a instalação gratuita do padrão de entrada, do ramal de conexão e das instalações internas para escolas e postos de saúde públicos em áreas rurais e para domicílios rurais de famílias de baixa renda que preencham os requisitos regulatórios.</p>
                <ul>
                    <li>Famílias de baixa renda devem estar inscritas no CadÚnico, com cadastro atualizado e renda dentro do limite aplicável.</li>
                    <li>A ligação deve observar as condições técnicas previstas para o atendimento.</li>
                    <li>O benefício não se confunde com a gratuidade de toda e qualquer extensão de rede.</li>
                </ul>
                <p><strong>Relevância:</strong> Permite identificar quando os itens básicos da ligação não podem ser cobrados do usuário e quais documentos comprovam o direito.</p>
            `,
            links: []
        },
        {
            title: "Aprovação prévia do projeto",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 50 e seguintes</p>
                <p>Quando as características da conexão exigirem projeto elétrico, o usuário deve submetê-lo à distribuidora antes da execução. A análise verifica conformidade com padrões técnicos, segurança, proteção, medição e compatibilidade com a rede.</p>
                <ul>
                    <li>A distribuidora deve informar os requisitos e os documentos necessários.</li>
                    <li>A aprovação não transfere ao usuário obrigações que são próprias da distribuidora.</li>
                    <li>Alterações relevantes no projeto devem ser reapresentadas antes da obra.</li>
                </ul>
                <p><strong>POR QUE IMPORTA:</strong> Evita retrabalho, reprovação na vistoria e implantação de instalações incompatíveis com a rede.</p>
            `,
            links: []
        },
        {
            title: "Orçamento de conexão",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 63 e seguintes</p>
                <p>É a proposta formal da distribuidora para viabilizar a conexão. Deve identificar a solução técnica, o ponto de conexão, as obras, os prazos, os custos, a participação financeira de cada parte e as condições para execução.</p>
                <ul>
                    <li>Deve apresentar memória de cálculo e informações suficientes para conferência.</li>
                    <li>Deve separar responsabilidades da distribuidora e do usuário.</li>
                    <li>Deve indicar validade, forma de aceite e consequências do não aceite no prazo.</li>
                </ul>
                <p><strong>Relevância:</strong> É o documento central para comparar a solução, questionar valores e decidir se a conexão seguirá adiante.</p>
            `,
            links: []
        },
        {
            title: "Estudos e projetos da distribuidora",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 70 e seguintes; Módulo 3 do PRODIST</p>
                <p>A distribuidora realiza os estudos necessários para verificar capacidade, níveis de tensão, curto-circuito, proteção, qualidade, fluxo de potência e impactos da nova conexão. Quando houver alternativas, deve demonstrar as opções viáveis e justificar a solução selecionada.</p>
                <ul>
                    <li>Os estudos devem usar dados e critérios técnicos consistentes.</li>
                    <li>Obras sem relação necessária com a conexão não podem ser transferidas ao usuário.</li>
                    <li>Para geração distribuída, a análise pode incluir inversão de fluxo e alternativas técnicas.</li>
                </ul>
                <p><strong>Relevância:</strong> A transparência dos estudos permite verificar se as obras e os custos atribuídos à conexão são tecnicamente necessários.</p>
            `,
            links: []
        },
        {
            title: "Execução das obras",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 87 e seguintes</p>
                <p>As obras devem seguir os projetos aprovados, os padrões da distribuidora e os prazos regulatórios. A norma disciplina comunicação, acompanhamento, atrasos, impedimentos e entrega das instalações.</p>
                <ul>
                    <li>Registre datas, protocolos e documentos.</li>
                    <li>Alterações de escopo devem ser justificadas e formalizadas.</li>
                    <li>Instalações executadas pelo usuário devem atender às especificações e permitir inspeção.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Vistoria e instalação da medição",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, art. 91 e seguintes</p>
                <p>Concluídas as instalações, a distribuidora verifica a conformidade com o projeto, os padrões técnicos e os requisitos de segurança. Com a aprovação, instala ou adequa o sistema de medição e adota as providências para iniciar o fornecimento ou a operação da conexão.</p>
                <p>Se houver reprovação, a distribuidora deve informar de forma objetiva as não conformidades e as correções necessárias.</p>
            `,
            links: []
        },
        {
            title: "Regras financeiras de conexão",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Custos de conexão</div>
                <p>Os custos dependem do tipo de usuário, da tensão, da demanda, das obras necessárias e das regras de gratuidade ou participação financeira. Valores cobrados em desacordo com a regulação podem ser contestados.</p>
                
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Conexão gratuita</div>
                <p>O consumidor tem direito à conexão gratuita quando preencher cumulativamente os critérios regulatórios, entre eles o enquadramento no Grupo B, carga instalada dentro do limite, inexistência de outra unidade atendida na propriedade e demais condições previstas na norma.</p>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Obras com participação financeira</div>
                <p>Quando a conexão não for integralmente gratuita, o custo da obra pode ser compartilhado. A memória de cálculo deve permitir a conferência da proporcionalização e do valor atribuído a cada parte.</p>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Obras de responsabilidade exclusiva</div>
                <p>Algumas obras e instalações são de responsabilidade exclusiva do usuário, especialmente quando atendem a interesse particular, exigem solução além do mínimo necessário ou se situam após o ponto de conexão.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar a Resolução Normativa ANEEL nº 1.000/2021", url: "#"},
                {text: "ACESSAR › Consultar o Módulo 3 do PRODIST", url: "#"},
                {text: "ACESSAR › Consultar orientações sobre universalização", url: "#"}
            ]
        }
    ],

    "Tributação Estadual do Setor Elétrico": [
        {
            title: "Diferimento para equipamentos de energia solar, eólica e biogás",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 10, XII</p>
                <p>O dispositivo adia o lançamento e o pagamento do ICMS incidente no diferencial de alíquotas de aquisições interestaduais e na importação de máquinas, equipamentos e materiais destinados à captação, geração e transmissão de energia solar ou eólica ou à geração a partir de biogás.</p>
                <p>O imposto fica diferido até a desincorporação do bem ou até 31 de dezembro de 2034.</p>
            `,
            links: []
        },
        {
            title: "Energia destinada à produção de hidrogênio verde na ZPE",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 10, XVI</p>
                <p>Prevê diferimento nas entradas interestaduais de energia elétrica, inclusive valores de conexão e uso dos sistemas de transmissão, quando a energia for utilizada no processo produtivo de hidrogênio verde por estabelecimento situado na Zona de Processamento de Exportação do Piauí.</p>
            `,
            links: []
        },
        {
            title: "Operações das concessionárias e consumo protegido",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, Seção IX, arts. 60 a 62</p>
                <p>Os dispositivos tratam de três hipóteses distintas:</p>
                <ul>
                    <li><strong>Art. 60:</strong> isenta a movimentação de bens da própria concessionária de energia entre seus estabelecimentos ou locais de guarda e o respectivo retorno.</li>
                    <li><strong>Art. 61:</strong> isenta o fornecimento residencial até 50 kWh mensais, nos termos do Convênio ICM 20/89.</li>
                    <li><strong>Art. 62:</strong> isenta o fornecimento destinado a órgãos da Administração Pública Estadual Direta, fundações e autarquias mantidas pelo Estado, observadas as condições documentais.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Energia para água e saneamento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 90</p>
                <p>Isenta operações internas de fornecimento de energia destinadas ao consumo da AGESPISA e do Serviço Autônomo de Água e Esgoto de Oeiras, conforme os convênios citados no Regulamento. A desoneração reduz um insumo relevante da prestação de serviços de abastecimento de água e saneamento.</p>
            `,
            links: []
        },
        {
            title: "Equipamentos para energia solar e eólica",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 123; Convênio ICMS 101/97</p>
                <p>Isenta operações com produtos listados por descrição e NCM, incluindo aerogeradores, bombas para sistemas fotovoltaicos, aquecedores solares, geradores e células fotovoltaicas, torres, pás, partes, peças e outros componentes abrangidos pela redação vigente.</p>
            `,
            links: []
        },
        {
            title: "Operações liquidadas na CCEE",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo VIII do RICMS/PI, arts. 160 a 164; Convênio ICMS 15/07</p>
                <p>Disciplina a emissão de documentos fiscais e o tratamento das operações bilaterais e das diferenças apuradas no Mercado de Curto Prazo. O fornecedor emite documento por estabelecimento destinatário; nas liquidações, a posição credora ou devedora orienta o documento fiscal aplicável.</p>
                <p>No fornecimento a consumidor livre, especial ou autoprodutor, o ICMS é devido ao Estado onde ocorre o consumo.</p>
            `,
            links: []
        },
        {
            title: "Obrigações fiscais no PROINFA",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo VIII do RICMS/PI, arts. 170 a 175; Ajuste SINIEF 03/09</p>
                <p>Os dispositivos organizam a emissão de notas fiscais no Programa de Incentivo às Fontes Alternativas de Energia Elétrica. O gerador emite nota contra a Eletrobras pelo faturamento mensal e ajusta, no exercício seguinte, a energia contratada e a efetivamente entregue.</p>
            `,
            links: []
        },
        {
            title: "Biogás e Geração Elétrica",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Biogás de aterro sanitário para geração elétrica</div>
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 174-D; Decreto Estadual nº 22.882/2024; Convênio ICMS 188/23</p>
                <p>Isenta as saídas internas de biogás proveniente de aterros sanitários quando utilizado como matéria-prima na geração de energia elétrica.</p>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Equipamentos para geração a biogás</div>
                <p><strong>BASE NORMATIVA:</strong> Anexo IV do RICMS/PI, art. 171; Convênio ICMS 151/21</p>
                <p>O dispositivo concedeu isenção a uma lista de equipamentos destinados à geração de energia elétrica a partir de biogás, incluindo sistemas de tratamento, coleta, armazenamento, bombeamento, subestação, motogerador, biodigestor e purificação.</p>
            `,
            links: []
        },
        {
            title: "Logística reversa de pilhas e baterias usadas",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo VIII do RICMS/PI, arts. 176 a 178</p>
                <p>Regula documentos fiscais na coleta, armazenagem, transporte e remessa de pilhas e baterias usadas para reciclagem. O art. 177 exige que a indústria recicladora emita NF-e de entrada para acompanhar a remessa realizada pela operadora logística.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar o Decreto Estadual nº 21.866/2023 no Diário Oficial do Piauí", url: "#"},
                {text: "ACESSAR › Consultar o Diário Oficial do Estado do Piauí", url: "#"}
            ]
        }
    ],

    "Geração Distribuída": [
        {
            title: "Criação do SCEE e da micro e minigeração distribuída",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 482/2012</p>
                <p><strong>STATUS:</strong> Revogada — referência histórica</p>
                <p>Foi o primeiro regulamento nacional a disciplinar a conexão de micro e minigeração à rede de distribuição e a criar o SCEE. Estabeleceu a compensação entre energia injetada e energia consumida e abriu caminho para a expansão da geração solar, eólica, hidráulica e por biomassa junto aos consumidores.</p>
            `,
            links: []
        },
        {
            title: "Ampliação e modernização da geração distribuída",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 687/2015</p>
                <p><strong>STATUS:</strong> Revogada — referência histórica</p>
                <p>Ampliou limites, modalidades e possibilidades de compensação. Consolidou figuras como geração compartilhada, autoconsumo remoto e empreendimento com múltiplas unidades consumidoras e aumentou a flexibilidade de uso dos créditos.</p>
            `,
            links: []
        },
        {
            title: "Procedimentos técnicos de conexão",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Módulo 3 do PRODIST, aprovado pela Resolução Normativa ANEEL nº 956/2021</p>
                <p><strong>STATUS:</strong> Vigente, com atualizações</p>
                <p>Padroniza o processo técnico de acesso ao sistema de distribuição. Para MMGD, trata de solicitação de conexão, estudos, orçamento, ponto de conexão, medição, proteção, vistoria, operação, manutenção e segurança.</p>
            `,
            links: []
        },
        {
            title: "Tratamento do ICMS na compensação",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Convênio ICMS 16/2015 — CONFAZ</p>
                <p><strong>STATUS:</strong> Vigente conforme adesão e legislação de cada Estado</p>
                <p>Autoriza os Estados a conceder isenção do ICMS sobre a energia fornecida pela distribuidora em quantidade correspondente à energia injetada pelo consumidor, dentro das condições do SCEE e dos limites adotados pela legislação estadual.</p>
            `,
            links: []
        },
        {
            title: "Marco legal da micro e minigeração distribuída",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Lei nº 14.300/2022</p>
                <p><strong>STATUS:</strong> Vigente, com alterações posteriores</p>
                <p>Institui o marco legal da MMGD, do SCEE e do Programa de Energia Renovável Social — PERS. Define conceitos, limites de potência, modalidades, regras de transição, direitos adquiridos, compensação, responsabilidades, garantias e tratamento tarifário pelo uso da rede.</p>
                <ul>
                    <li>Microgeração: potência instalada de até 75 kW.</li>
                    <li>Minigeração: acima de 75 kW e, em regra, até 3 MW, com hipóteses legais específicas de até 5 MW.</li>
                    <li>Créditos de energia: utilizados conforme titularidade, modalidade e prazo legal.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Regulamentação do marco legal",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.059/2023</p>
                <p><strong>STATUS:</strong> Vigente</p>
                <p>Adaptou a Resolução nº 1.000/2021 e o PRODIST à Lei nº 14.300/2022. Consolidou as regras de MMGD e SCEE nas condições gerais de fornecimento e detalhou conexão, orçamento, medição, faturamento, alocação de excedentes, garantia de fiel cumprimento e tratamento de solicitações.</p>
            `,
            links: []
        },
        {
            title: "Como funciona o SCEE",
            content: `
                <p><strong>STATUS:</strong> Instrumento vigente</p>
                <p>Quando a unidade gera mais energia do que consome, o excedente é injetado na rede e registrado pela medição. Esse valor pode ser compensado na própria unidade ou em outras unidades vinculadas à modalidade escolhida, conforme as regras de faturamento.</p>
                <ul>
                    <li>Autoconsumo local.</li>
                    <li>Autoconsumo remoto.</li>
                    <li>Geração compartilhada.</li>
                    <li>Empreendimento com múltiplas unidades consumidoras.</li>
                </ul>
                <p>Compensação de energia não significa conta zerada: permanecem cobranças mínimas, uso da rede, tributos e demais componentes aplicáveis.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar a página de MMGD da ANEEL", url: "#"},
                {text: "ACESSAR › Consultar a Lei nº 14.300/2022", url: "#"},
                {text: "ACESSAR › Consultar a Resolução Normativa ANEEL nº 1.059/2023", url: "#"},
                {text: "ACESSAR › Consultar o PRODIST", url: "#"},
                {text: "ACESSAR › Acessar formulários de micro e minigeração distribuída", url: "#"}
            ]
        }
    ],

    "Politicas e Mecanismos de Inclusão Energética": [
        {
            title: "Base da política de universalização e modicidade",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Lei nº 10.438/2002</p>
                <p>Estrutura instrumentos centrais da política elétrica brasileira. A lei criou a Conta de Desenvolvimento Energético — CDE, instituiu o PROINFA e estabeleceu bases para universalização, fontes alternativas e redução de desigualdades no acesso.</p>
            `,
            links: []
        },
        {
            title: "Conta de Desenvolvimento Energético — CDE",
            content: `
                <p><strong>STATUS:</strong> Instrumento vigente</p>
                <p>A CDE é um fundo setorial que financia políticas como universalização, Tarifa Social, Luz para Todos, subsídios legalmente previstos e outras ações do setor elétrico. Seu orçamento é aprovado e acompanhado segundo a regulação aplicável. É o principal mecanismo de financiamento coletivo das políticas de acesso e modicidade tarifária.</p>
            `,
            links: []
        },
        {
            title: "Programa de Incentivo às Fontes Alternativas — PROINFA",
            content: `
                <p>Criado pela Lei nº 10.438/2002, promoveu a contratação de energia de fontes eólica, pequenas centrais hidrelétricas e biomassa. Embora sua finalidade original fosse diversificar a oferta, o programa também contribuiu para desenvolver cadeias produtivas e ampliar a disponibilidade de energia renovável.</p>
            `,
            links: []
        },
        {
            title: "Universalização do acesso — Luz para Todos",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Decreto nº 11.628/2023</p>
                <p>O Programa Nacional de Universalização do Acesso e Uso da Energia Elétrica atende população rural e regiões remotas sem serviço de distribuição, priorizando famílias vulneráveis, escolas, unidades de saúde, comunidades tradicionais e infraestruturas de desenvolvimento local.</p>
                <ul>
                    <li>O MME define metas e governança.</li>
                    <li>A ANEEL estabelece metas regulatórias por área de concessão.</li>
                    <li>Distribuidoras e agentes executores implantam as ligações e soluções energéticas.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Tarifa Social de Energia Elétrica — TSEE",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Lei nº 12.212/2010, atualizada pela Lei nº 15.235/2025</p>
                <p>A Tarifa Social reduz o custo da eletricidade para unidades residenciais de baixa renda que preencham os critérios legais. A atualização de 2025 ampliou a gratuidade da tarifa de energia para a parcela de consumo de até 80 kWh mensais, preservadas as demais cobranças legalmente aplicáveis.</p>
            `,
            links: []
        },
        {
            title: "Eficiência energética e pesquisa e desenvolvimento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Lei nº 9.991/2000</p>
                <p>Obriga agentes do setor elétrico a aplicar parte da receita operacional líquida em pesquisa e desenvolvimento e, conforme o segmento, em programas de eficiência energética. Esses recursos financiam inovação, redução de desperdícios, modernização tecnológica e projetos destinados a públicos vulneráveis.</p>
            `,
            links: []
        },
        {
            title: "Ações estaduais de inclusão (Piauí)",
            content: `
                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px;">Programa Estadual Luz Popular</div>
                <p><strong>BASE NORMATIVA:</strong> Lei Estadual nº 8.433/2024 — Piauí</p>
                <p>Institui programa estadual de custeio da fatura de energia para famílias de baixa renda que atendam aos critérios definidos na lei e na regulamentação. A política complementa a proteção federal e utiliza recursos estaduais para reduzir a pobreza energética.</p>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Subsídio para irrigação e aquicultura</div>
                <p><strong>BASE NORMATIVA:</strong> Lei Estadual nº 7.885/2022 — Piauí</p>
                <p>Concede subsídio no consumo de energia de estabelecimentos de produtores rurais dedicados exclusivamente à irrigação ou à aquicultura.</p>

                <div style="border-left: 4px solid #006b5e; padding-left: 10px; font-weight: 700; color: #11364d; font-size: 16px; background-color: #f4f7f8; padding-top: 8px; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px;">Aquisição facilitada de sistemas fotovoltaicos por servidores</div>
                <p><strong>BASE NORMATIVA:</strong> Lei Estadual nº 7.471/2021 — Piauí</p>
                <p>Autoriza mecanismos de financiamento para servidores públicos ativos e inativos, militares e pensionistas adquirirem sistemas solares fotovoltaicos, com possibilidade de pagamento por consignação em folha.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar a Lei nº 10.438/2002", url: "#"},
                {text: "ACESSAR › Consultar o Decreto nº 11.628/2023", url: "#"},
                {text: "ACESSAR › Acessar os normativos do Luz para Todos", url: "#"},
                {text: "ACESSAR › Consultar a Lei nº 12.212/2010", url: "#"},
                {text: "ACESSAR › Consultar a Lei nº 9.991/2000", url: "#"},
                {text: "ACESSAR › Consultar a Lei Estadual nº 8.433/2024", url: "#"},
                {text: "ACESSAR › Consultar a Lei Estadual nº 7.885/2022", url: "#"},
                {text: "ACESSAR › Consultar a Lei Estadual nº 7.471/2021", url: "#"}
            ]
        }
    ],

    "Direito do Consumidor de Energia": [
        {
            title: "Fatura e pagamento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo XI, art. 337 e seguintes</p>
                <p>A fatura deve apresentar informações claras sobre consumo, período de leitura, tarifa, tributos, encargos, bandeiras, débitos e canais de atendimento. O vencimento deve observar antecedência mínima de 10 dias úteis para poder público, iluminação pública e serviço público e de 5 dias úteis nas demais situações.</p>
                <ul>
                    <li>A distribuidora deve oferecer pelo menos seis datas de vencimento.</li>
                    <li>O consumidor pode solicitar segunda via e esclarecimentos.</li>
                    <li>Cobranças contestadas devem ser analisadas e respondidas.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Inadimplemento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo XII, art. 343 e seguintes</p>
                <p>O atraso pode gerar multa de até 2%, atualização monetária e juros de mora de 1% ao mês, calculados proporcionalmente. A distribuidora deve discriminar os acréscimos e observar as regras de cobrança e parcelamento.</p>
                <p>Dívida não autoriza qualquer forma de cobrança: comunicação, prazos, proteção de dados e regras de suspensão continuam obrigatórios.</p>
            `,
            links: []
        },
        {
            title: "Suspensão do fornecimento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo XIII, art. 350 e seguintes</p>
                <p>A suspensão somente pode ocorrer nas hipóteses e condições previstas na norma, como inadimplemento, impedimento de acesso à medição, deficiência técnica ou uso irregular. Em regra, exige notificação prévia e respeito aos dias e horários permitidos.</p>
                <ul>
                    <li>Não pode haver corte por débito antigo fora das condições regulatórias.</li>
                    <li>É vedada a suspensão às sextas-feiras, sábados, domingos, feriados e vésperas de feriado por inadimplemento.</li>
                    <li>Regularizada a situação, a religação deve observar os prazos aplicáveis.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Serviço de atendimento ao consumidor",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo XIV, art. 370 e seguintes</p>
                <p>A distribuidora deve manter canais acessíveis para solicitações, informações, reclamações, denúncias e serviços. Cada atendimento deve gerar protocolo, e o consumidor tem direito a acompanhar a demanda e receber resposta clara.</p>
                <ul>
                    <li>Atendimento telefônico e digital.</li>
                    <li>Postos presenciais, conforme as regras aplicáveis.</li>
                    <li>Ouvidoria como segunda instância da distribuidora.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Qualidade do fornecimento",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo XV, art. 433 e seguintes; Módulo 8 do PRODIST</p>
                <p>A qualidade é avaliada pela continuidade do fornecimento, pela qualidade da tensão e pela qualidade comercial. Indicadores como DEC, FEC e limites individuais permitem acompanhar interrupções; violações podem gerar compensação automática na fatura.</p>
                <p><strong>FIQUE ATENTO:</strong> Oscilações, interrupções repetidas, tensão inadequada e descumprimento de prazo devem ser registrados com data, duração e protocolo.</p>
            `,
            links: []
        },
        {
            title: "Ressarcimento de danos elétricos",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Resolução Normativa ANEEL nº 1.000/2021, Capítulo VIII, art. 599 e seguintes; Módulo 9 do PRODIST</p>
                <p>O procedimento regulatório de ressarcimento aplica-se a danos elétricos em equipamentos instalados em unidades consumidoras do Grupo B. O consumidor pode solicitar análise à distribuidora e deve informar o equipamento, a data provável do evento e as circunstâncias do dano.</p>
                <ul>
                    <li>O pedido pode ser apresentado em até cinco anos após a ocorrência.</li>
                    <li>Equipamentos usados para conservar alimentos perecíveis ou medicamentos têm tratamento prioritário.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Principais direitos dos consumidores do Grupo B",
            content: `
                <p><strong>BASE NORMATIVA:</strong> Anexo I da Resolução Normativa ANEEL nº 1.000/2021</p>
                <p>O Anexo reúne, em linguagem resumida, direitos como fornecimento adequado, informação clara, escolha da data de vencimento, atendimento acessível, religação em prazo, compensação por violações, ressarcimento de danos e acesso aos canais de reclamação.</p>
            `,
            links: [
                {text: "ACESSAR › Consultar a Resolução Normativa ANEEL nº 1.000/2021", url: "#"},
                {text: "ACESSAR › Consultar os Módulos 8 e 9 do PRODIST", url: "#"}
            ]
        }
    ],

    "Mercado Livre de Energia": [
        {
            title: "Origem do consumidor livre (Lei nº 9.074/1995)",
            content: `
                <p>É a base legal da liberdade de escolha no setor elétrico. Os arts. 15 e 16 criaram as condições para que determinados consumidores pudessem adquirir energia de fornecedor diferente da distribuidora local, dando origem à figura do consumidor livre.</p>
                <p>A lei também assegurou o acesso aos sistemas de transmissão e distribuição, mediante contratação e pagamento pelo uso da rede.</p>
            `,
            links: []
        },
        {
            title: "Estruturação dos ambientes ACR e ACL",
            content: `
                <p><strong>Normas:</strong> Lei nº 10.848/2004 e Decreto nº 5.163/2004</p>
                <p>A Lei nº 10.848/2004 reorganizou o modelo de comercialização de energia elétrica e consolidou a existência de dois ambientes:</p>
                <ul>
                    <li>Ambiente de Contratação Regulada — ACR: destinado, principalmente, à contratação de energia pelas distribuidoras para atendimento aos consumidores regulados;</li>
                    <li>Ambiente de Contratação Livre — ACL: destinado à negociação bilateral de energia entre consumidores, geradores e comercializadores.</li>
                </ul>
                <p>O Decreto nº 5.163/2004 regulamenta essa estrutura e detalha as regras de contratação, registro dos contratos, atendimento à carga, contabilização e liquidação das operações.</p>
            `,
            links: []
        },
        {
            title: "Governança e funcionamento da CCEE",
            content: `
                <p><strong>Normas:</strong> Decreto nº 5.177/2004 e Resolução Normativa ANEEL nº 957/2021</p>
                <p>A CCEE (Câmara de Comercialização de Energia Elétrica) é responsável por:</p>
                <ul>
                    <li>registrar contratos de compra e venda;</li>
                    <li>contabilizar a energia contratada e consumida;</li>
                    <li>apurar diferenças entre contratação e consumo;</li>
                    <li>realizar a liquidação financeira do mercado de curto prazo;</li>
                    <li>monitorar agentes e operações;</li>
                    <li>administrar regras e procedimentos de comercialização.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Modernização e comercialização varejista (Lei nº 14.120/2021)",
            content: `
                <p>A Lei nº 14.120/2021 introduziu na Lei nº 10.848/2004 a comercialização varejista, permitindo que pessoas físicas ou jurídicas sejam representadas na CCEE por agentes habilitados.</p>
                <p>Também disciplinou:</p>
                <ul>
                    <li>o encerramento da representação varejista;</li>
                    <li>as consequências da falta de continuidade contratual;</li>
                    <li>o desligamento de agentes da CCEE;</li>
                    <li>a contratação de reserva de capacidade;</li>
                    <li>a distribuição de encargos entre os usuários;</li>
                    <li>a transição dos descontos aplicados às tarifas de uso da rede para determinadas fontes incentivadas.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Abertura do mercado para o Grupo A",
            content: `
                <p><strong>Normas:</strong> Portaria Normativa MME nº 50/2022, Resolução ANEEL nº 1.081/2023 e Resolução ANEEL nº 1.000/2021</p>
                <p>A Portaria nº 50/2022 permitiu que, desde 1º de janeiro de 2024, todos os consumidores classificados no Grupo A — atendidos em tensão igual ou superior a 2,3 kV — possam optar pelo mercado livre, independentemente do consumo ou da demanda contratada.</p>
                <p>A Resolução nº 1.081/2023 adaptou as normas da ANEEL à abertura do Grupo A, alterando regras sobre:</p>
                <ul>
                    <li>migração e retorno ao mercado regulado;</li>
                    <li>representação varejista;</li>
                    <li>troca e encerramento da representação;</li>
                    <li>medição e modelagem das unidades;</li>
                    <li>suspensão do fornecimento;</li>
                    <li>contratos entre consumidor e varejista.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Quem pode migrar atualmente",
            content: `
                <p>Em agosto de 2026:</p>
                <ul>
                    <li>todo consumidor do Grupo A pode migrar;</li>
                    <li>consumidor com carga individual inferior a 500 kW deve ser representado por agente varejista;</li>
                    <li>consumidor com carga igual ou superior a 500 kW pode aderir diretamente à CCEE, se cumprir os requisitos, ou optar pela representação varejista.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Contratação de energia no ACL (Resolução Normativa ANEEL nº 1.009/2022)",
            content: `
                <p>O principal instrumento do mercado livre é o Contrato de Comercialização de Energia no Ambiente Livre — CCEAL, no qual as partes negociam livremente:</p>
                <ul>
                    <li>preço;</li>
                    <li>quantidade;</li>
                    <li>período de fornecimento;</li>
                    <li>sazonalização e modulação;</li>
                    <li>flexibilidade de consumo;</li>
                    <li>garantias financeiras;</li>
                    <li>penalidades;</li>
                    <li>condições de rescisão;</li>
                    <li>origem da energia, quando contratada.</li>
                </ul>
                <p><strong>Relevância para o consumidor:</strong> A liberdade contratual também transfere responsabilidades. Consumo maior ou menor que o contratado, variações no preço de curto prazo e descumprimento de garantias podem gerar custos adicionais.</p>
            `,
            links: []
        },
        {
            title: "Comercializadores e agentes varejistas (Resolução Normativa ANEEL nº 1.011/2022)",
            content: `
                <p><strong>O que é o agente varejista:</strong> É o agente habilitado que representa o consumidor perante a CCEE. Entre suas atribuições estão:</p>
                <ul>
                    <li>registrar e administrar contratos;</li>
                    <li>modelar as unidades consumidoras;</li>
                    <li>acompanhar consumo e contratação;</li>
                    <li>responder pela contabilização e liquidação;</li>
                    <li>cumprir obrigações e prazos perante a CCEE;</li>
                    <li>prestar informações ao consumidor;</li>
                    <li>gerenciar as diferenças entre energia contratada e consumida, conforme o contrato.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Abertura total do mercado",
            content: `
                <p><strong>Normas:</strong> Lei nº 15.269/2025 e Decreto nº 13.097/2026</p>
                <p>O Decreto nº 13.097/2026 fixou as datas da abertura:</p>
                <ul>
                    <li>25 de novembro de 2027: consumidores industriais e comerciais de baixa tensão;</li>
                    <li>25 de novembro de 2028: demais consumidores de baixa tensão, inclusive residenciais.</li>
                </ul>
                <p>Os consumidores de baixa tensão que optarem pelo ACL serão obrigatoriamente representados por um agente varejista e deverão contratar toda a carga de cada unidade consumidora com um único varejista.</p>
            `,
            links: []
        },
        {
            title: "Como funciona a migração",
            content: `
                <ul>
                    <li><strong>Verificar a elegibilidade:</strong> Identificar grupo tarifário, tensão de atendimento, demanda contratada, contratos vigentes e eventual obrigatoriedade de representação varejista.</li>
                    <li><strong>Analisar o perfil de consumo:</strong> Avaliar histórico, sazonalidade, consumo em ponta e fora de ponta, possibilidade de expansão, tolerância a riscos e previsibilidade orçamentária.</li>
                    <li><strong>Comparar propostas:</strong> Solicitar propostas de fornecedores ou varejistas habilitados e comparar o custo total, prazo, reajustes, garantias, flexibilidade e condições de saída.</li>
                    <li><strong>Comunicar a distribuidora:</strong> Formalizar a denúncia ou o encerramento do CCER, observando os prazos contratuais e regulatórios. A distribuidora deverá informar documentos, cronograma e eventual necessidade de adequação da medição.</li>
                    <li><strong>Contratar energia e uso da rede:</strong> Celebrar o CCEAL ou o CCV com o fornecedor e manter o CUSD ou CUST para utilização da rede.</li>
                    <li><strong>Realizar a modelagem na CCEE:</strong> A unidade deve ser cadastrada e modelada. Na representação varejista, essa atividade é conduzida pelo agente varejista.</li>
                    <li><strong>Acompanhar o contrato:</strong> Depois da migração, devem ser acompanhados consumo, demanda, energia contratada, reajustes, encargos, exposições e prazos de renovação.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "O que muda e o que permanece",
            content: `
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">O que muda</p>
                <ul>
                    <li>fornecedor da energia;</li>
                    <li>preço e condições comerciais;</li>
                    <li>forma de contratação;</li>
                    <li>gestão dos volumes consumidos;</li>
                    <li>exposição aos riscos contratuais e de mercado;</li>
                    <li>possibilidade de escolher produtos vinculados a determinadas fontes.</li>
                </ul>
                <p style="font-weight: 700; color: #11364d; margin-top: 15px; margin-bottom: 10px;">O que permanece</p>
                <ul>
                    <li>distribuidora responsável pela rede;</li>
                    <li>cobrança pelo uso da rede;</li>
                    <li>demanda contratada;</li>
                    <li>encargos setoriais aplicáveis;</li>
                    <li>tributos;</li>
                    <li>padrões de qualidade e continuidade;</li>
                    <li>canais para comunicar falta de energia e problemas na rede.</li>
                </ul>
            `,
            links: []
        },
        {
            title: "Supridor de Última Instância — SUI",
            content: `
                <p>O SUI é um mecanismo de atendimento emergencial e temporário para consumidores adimplentes cuja representação varejista seja encerrada ou cujo varejista seja desligado ou inabilitado.</p>
                <p>Até 31 de dezembro de 2030, o serviço será prestado pelas distribuidoras. A partir de 2031, poderá ser prestado por outras pessoas jurídicas, conforme regulamentação da ANEEL.</p>
                <p>O SUI não deve ser interpretado como um fornecedor permanente ou mais barato. Suas tarifas não poderão ser inferiores à tarifa de energia do respectivo subgrupo e deverão ser crescentes, incentivando o consumidor a contratar novo fornecedor ou retornar ao ACR.</p>
            `,
            links: []
        },
        {
            title: "Pontos de atenção antes de migrar",
            content: `
                <p>A migração não garante economia automática. A análise deve considerar:</p>
                <ul>
                    <li>preço da energia;</li>
                    <li>TUSD ou TUST;</li>
                    <li>demanda contratada;</li>
                    <li>perdas e encargos setoriais;</li>
                    <li>tributos;</li>
                    <li>taxa de gestão do varejista;</li>
                    <li>garantias financeiras;</li>
                    <li>exposição ao PLD;</li>
                    <li>limites de flexibilidade;</li>
                    <li>penalidades por consumo diferente do contratado;</li>
                    <li>reajuste e indexador;</li>
                    <li>renovação automática;</li>
                    <li>prazo e custo de rescisão;</li>
                    <li>risco de crédito do fornecedor.</li>
                </ul>
                <p><strong>Benefícios tarifários:</strong> O Decreto nº 13.097/2026 estabelece que benefícios próprios do ACR, como a Tarifa Social de Energia Elétrica e os descontos especiais para irrigação e aquicultura, não serão aplicados no ACL. O consumidor beneficiário deverá comparar o desconto que perderá com as condições oferecidas no mercado livre antes de migrar.</p>
                <p><strong>Retorno ao mercado regulado:</strong> Para consumidores de baixa tensão, o Decreto nº 13.097/2026 garante o retorno mediante comunicação à distribuidora com antecedência de um ano, prazo que poderá ser reduzido. Para consumidores do Grupo A, a regra atualmente exige comunicação com antecedência mínima de cinco anos, salvo aceitação de prazo menor pela distribuidora.</p>
            `,
            links: [
                {text: "ACESSAR › Página da ANEEL sobre o mercado de energia", url: "#"},
                {text: "ACESSAR › Mercado Livre — CCEE", url: "#"},
                {text: "ACESSAR › Lista de agentes comercializadores autorizados", url: "#"},
                {text: "ACESSAR › Regras e Procedimentos de Comercialização da CCEE", url: "#"},
                {text: "ACESSAR › Orientações atualizadas do MME sobre a migração", url: "#"}
            ]
        }
    ]
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

    if (document.getElementById('content-especificas')) {
        document.getElementById('content-especificas').style.display = 'none';
        document.getElementById('btn-especificas').classList.remove('active');
    }
    if (document.getElementById('content-ambientais')) {
        document.getElementById('content-ambientais').style.display = 'none';
        document.getElementById('btn-ambientais').classList.remove('active');
    }

    document.querySelectorAll('.filter-competencia').forEach(el => {
        el.addEventListener('change', (e) => {
            globalCompFilter = e.target.value;
            document.querySelectorAll('.filter-competencia').forEach(select => select.value = globalCompFilter);
            renderTable(currentSelectedTheme || '');
        });
    });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    currentSelectedTheme = ''; 
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'visible';
    document.getElementById('animated-menu').classList.remove('is-open');
    document.getElementById('intro-section').style.display = 'flex';
    
    currentTipoFilter = "";
    currentTipoFilterValues = [];
    if (document.getElementById('chart-reset-container')) {
        document.getElementById('chart-reset-container').style.display = 'none';
    }

    if (document.getElementById('theme-cards-section')) {
        document.getElementById('theme-cards-section').style.display = 'none';
    }

    globalCompFilter = 'todas';
    globalTipoFilter = 'todas';
    document.querySelectorAll('.filter-competencia').forEach(select => select.value = 'todas');
    document.querySelectorAll('.filter-tipo').forEach(select => select.value = 'todas');

    renderIntroStats();
    showRepositoryView(''); 

    document.getElementById('reclamacao-section').style.display = 'none';
    document.getElementById('institucional-links-section').style.display = 'none';
    document.getElementById('theme-intro-section').style.display = 'none';
    document.getElementById('mindmap-section').style.display = 'none';

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

function renderThemeCards(themeName) {
    const grid = document.getElementById('theme-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const cards = THEME_CARDS_DATA[themeName] || [];
    
    if (cards.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#666;">Conteúdo em formatação.</p>';
        return;
    }

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'plan-card';
        cardEl.onclick = function() { this.classList.toggle('expanded'); };
        
        let linksHtml = '';
        if (card.links && card.links.length > 0) {
            linksHtml = '<div class="plan-card-btn-container">';
            card.links.forEach(link => {
                linksHtml += `<a href="${link.url}" target="_blank" class="plan-card-btn">${link.text}</a>`;
            });
            linksHtml += '</div>';
        }
        
        cardEl.innerHTML = `
            <div class="plan-card-header">
                <h4>${card.title}</h4>
                <span class="arrow">▼</span>
            </div>
            <div class="plan-card-body">
                ${card.content}
                ${linksHtml}
            </div>
        `;
        grid.appendChild(cardEl);
    });
}


function selectTheme(selectedTheme) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    currentSelectedTheme = selectedTheme; 
    document.querySelector('.seplan-apps-bar__site-button').style.visibility = 'hidden';
    document.getElementById('intro-section').style.display = 'none';
    document.getElementById('animated-menu').classList.remove('is-open');
    
    currentTipoFilter = "";
    currentTipoFilterValues = [];
    if (document.getElementById('chart-reset-container')) {
        document.getElementById('chart-reset-container').style.display = 'none';
    }

    globalCompFilter = 'todas';
    globalTipoFilter = 'todas';
    document.querySelectorAll('.filter-competencia').forEach(select => select.value = 'todas');
    document.querySelectorAll('.filter-tipo').forEach(select => select.value = 'todas');

    const themeIntroSection = document.getElementById('theme-intro-section');
    const themeIntroTitle = document.getElementById('theme-intro-title');
    const themeIntroText = document.getElementById('theme-intro-text');
    const introText = THEME_INTRO_TEXTS[selectedTheme];

    if (introText && themeIntroSection && themeIntroTitle && themeIntroText) {
        themeIntroTitle.textContent = selectedTheme;
        themeIntroText.innerHTML = introText;
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

    const cardsSection = document.getElementById('theme-cards-section');
    const mindmapSection = document.getElementById('mindmap-section');

    // MÁGICA DOS DIAGRAMAS x CARDS AQUI:
    const THEMES_WITH_CARDS = [
        "Direito do Consumidor de Energia",
        "Politicas e Mecanismos de Inclusão Energética",
        "Tributação Estadual do Setor Elétrico",
        "Conexão e Acesso à Rede",
        "Geração Distribuída",
        "Mercado Livre de Energia",
        "Planejamento Energético",
        "Transição Energética e Novas tecnologias"
    ];

    if (THEMES_WITH_CARDS.includes(selectedTheme)) {
        if (mindmapSection) mindmapSection.style.display = 'none';
        if (cardsSection) {
            cardsSection.style.display = 'block';
            renderThemeCards(selectedTheme);
        }
    } else {
        if (cardsSection) cardsSection.style.display = 'none';
        loadDiagram(selectedTheme); 
    }

    showRepositoryView(selectedTheme);
}

// -------------------------------------------------------------
// MOTOR DO MAPA MENTAL (DRAW.IO XML)
// -------------------------------------------------------------
function loadDiagram(themeName) {
    const container = document.getElementById('mindmap-container');
    const section = document.getElementById('mindmap-section');
    
    const currentRequest = ++diagramRequestCounter;
    
    container.style.width = '100%';
    container.style.minHeight = 'auto'; 
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
    const primeiraPagina = xmlDoc.querySelector("mxGraphModel") || xmlDoc;
    const celulas = primeiraPagina.querySelectorAll("mxCell");

    const container = document.getElementById('mindmap-container');
    
    container.innerHTML = '';
    activeLeaderLines.forEach(line => line.remove());
    activeLeaderLines = [];

    const nodesData = {};
    const hexagonsData = {};
    const edges = [];
    let titleAssigned = false;

    celulas.forEach(cell => {
        const id = cell.getAttribute("id");
        const isVertex = cell.getAttribute("vertex") === "1";
        const isEdge = cell.getAttribute("edge") === "1";
        const style = cell.getAttribute("style") || "";
        const value = cell.getAttribute("value") || "";
        const geo = cell.querySelector("mxGeometry");

        if (isVertex && geo) {
            const rawText = extractText(value);
            let tipo = 'square'; 

            if (style.includes('shape=hexagon')) {
                tipo = 'hexagon';
            } else if (style.includes('rounded=1')) {
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

    edges.forEach(edge => {
        if (hexagonsData[edge.target]) {
            if (nodesData[edge.source]) nodesData[edge.source].tooltipText = hexagonsData[edge.target];
        } else if (hexagonsData[edge.source]) {
            if (nodesData[edge.target]) nodesData[edge.target].tooltipText = hexagonsData[edge.source];
        }
    });

    const minX = Math.min(...Object.values(nodesData).map(n => n.x));
    const minY = Math.min(...Object.values(nodesData).map(n => n.y));
    const maxX = Math.max(...Object.values(nodesData).map(n => n.x + n.w));
    const maxY = Math.max(...Object.values(nodesData).map(n => n.y + n.h));

    const drawWidth = maxX - minX;
    const drawHeight = maxY - minY;

    const containerWidth = drawWidth + 160; 
    const containerHeight = drawHeight + 20;

    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;

    const offsetX = (containerWidth - drawWidth) / 2 - minX;
    const offsetY = 20 - minY;

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
                div.classList.add('drawio-square');
                const topText = node.text.substring(0, parenIndex).trim();
                let bottomText = node.text.substring(parenIndex).trim();
                bottomText = bottomText.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
                div.innerHTML = `<div class="square-top">${topText}</div><div class="square-bottom">${bottomText}</div>`;
            } else if (listIndex !== -1) {
                div.classList.add('drawio-square');
                const topText = node.text.substring(0, listIndex).trim().replace(/\n/g, '<br>');
                let bottomText = node.text.substring(listIndex);
                bottomText = bottomText.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
                if (bottomText.startsWith('<br>')) {
                    bottomText = bottomText.substring(4).trim();
                }
                div.innerHTML = `<div class="square-top">${topText}</div><div class="square-bottom">${bottomText}</div>`;
            } else {
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
            div.classList.add('drawio-rect');
            div.innerHTML = node.text.replace(/\n-/g, '<br>• ').replace(/\n/g, '<br>');
        }

        container.appendChild(div);
    });

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
        svg.style.overflow = "visible"; 
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
// SISTEMA CSV E TABELAS
// -------------------------------------------------------------
function loadCSV() {
    fetch('data/base_consolidada.csv')
        .then(response => {
            if (!response.ok) throw new Error("Arquivo não encontrado");
            return response.text();
        })
        .then(csvText => {
            consolidadaData = parseCSV(csvText);
            renderIntroStats();
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
        rowArray = rowArray.map(val => val.replace(/^"|"$/g, '').trim());
        if (rowArray.join('').trim() === '') continue; 

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
            const valRelacao = getCol(row, ['relação', 'relacao', 'setor energético']);
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

    if (globalCompFilter !== "todas") {
        dadosProcessados = dadosProcessados.filter(item => removeAcentos(item.comp).toLowerCase().includes(globalCompFilter));
    }
    if (globalTipoFilter !== "todas") {
        dadosProcessados = dadosProcessados.filter(item => removeAcentos(item.tipo).toLowerCase().includes(globalTipoFilter));
    }
    if (currentTipoFilterValues.length > 0) {
        dadosProcessados = dadosProcessados.filter(item => currentTipoFilterValues.includes(item.tipo));
    }

    if (!theme) {
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
        document.getElementById('home-tables-container').style.display = 'none';
        document.getElementById('theme-table-container').style.display = 'block';
        const isLicenciamento = removeAcentos(theme).toLowerCase().includes('licenciamento ambiental');
        const themeRelacaoHeader = document.getElementById('theme-relacao-header');
        if (themeRelacaoHeader) themeRelacaoHeader.style.display = isLicenciamento ? '' : 'none';

        if (dadosProcessados.length === 0) {
            tbodyTheme.innerHTML = `<tr><td colspan="${isLicenciamento ? 7 : 6}" class="no-data">Nenhuma legislação encontrada para os filtros selecionados.</td></tr>`;
            return;
        }
        dadosProcessados.forEach(item => {
            const tr = document.createElement('tr');
            let linkHtml = item.link !== "-" && item.link !== "" ? `<a href="${item.link}" target="_blank" class="link-btn">Acessar</a>` : "-";
            const relacaoCell = isLicenciamento ? `<td>${item.relacao}</td>` : '';
            tr.innerHTML = `<td>${item.tipo}</td><td><strong>${item.norma}</strong></td><td>${item.nome}</td><td>${item.desc}</td>${relacaoCell}<td>${item.comp}</td><td style="text-align:center;">${linkHtml}</td>`;
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
            layout: { 
                padding: {
                    top: 40,
                    bottom: 30,
                    left: 110,  
                    right: 70 
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