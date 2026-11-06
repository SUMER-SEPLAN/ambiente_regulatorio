(function(){
  'use strict';
  var flowData={
    direction:{kicker:'Direcionamento estratégico',title:'CNPE e Ministério de Minas e Energia',text:'O CNPE propõe diretrizes para a política energética nacional. O MME coordena sua implementação, define premissas para os estudos e transforma recomendações técnicas em decisões de política e outorga.',output:'Diretrizes e prioridades para o planejamento'},
    data:{kicker:'Base de evidências',title:'Balanços, estatísticas e projeções',text:'Dados de oferta, consumo, carga, infraestrutura e recursos energéticos revelam como o sistema se comporta. Cenários econômicos, demográficos e tecnológicos permitem estimar as necessidades futuras.',output:'Premissas comuns para os estudos prospectivos'},
    epe:{kicker:'Planejamento da expansão',title:'Empresa de Pesquisa Energética',text:'A EPE elabora estudos integrados de longo e médio prazo e avalia alternativas para a expansão. Na transmissão, seus estudos recomendam novas instalações e são consolidados no PET/PELP.',output:'PNE, PDE, estudos de expansão e PET/PELP'},
    ons:{kicker:'Operação e necessidades do sistema',title:'Operador Nacional do Sistema Elétrico',text:'O ONS avalia o desempenho futuro do Sistema Interligado Nacional à luz da operação, dos acessos e das restrições observadas. O PAR/PEL recomenda medidas operativas e obras de ampliações, reforços e melhorias.',output:'PAR/PEL e necessidades identificadas na operação'},
    potee:{kicker:'Consolidação para outorga',title:'Ministério de Minas e Energia · POTEE',text:'O Plano de Outorgas de Transmissão reúne recomendações provenientes dos estudos da EPE e do ONS e organiza os empreendimentos que deverão avançar para licitação ou autorização.',output:'Empreendimentos preparados para outorga'},
    aneel:{kicker:'Regulação e implementação',title:'Agência Nacional de Energia Elétrica',text:'A ANEEL disciplina os serviços, promove leilões, emite autorizações e fiscaliza os agentes. É nessa etapa que os estudos consolidados se convertem em obrigações, contratos e investimentos executáveis.',output:'Leilões, autorizações, fiscalização e implantação'}
  };
  var instrumentData={
    ben:{kicker:'Diagnóstico energético nacional',title:'Balanço Energético Nacional',horizon:'Anual',text:'Consolida a oferta e o consumo de energia no Brasil, abrangendo extração de recursos primários, conversão em formas secundárias, importações, exportações, perdas e usos finais por setor. O BEN descreve o sistema observado e fornece uma base estatística comum para projeções, cenários e avaliação de políticas.',owner:'EPE, com informações de agentes e instituições setoriais',input:'Produção, transformação, comércio externo, estoques, perdas e consumo energético',output:'Séries históricas e matriz energética consolidada para subsidiar os estudos de planejamento',link:'https://epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/balanco-energetico-nacional-ben'},
    pne:{kicker:'Estratégia de longo prazo',title:'Plano Nacional de Energia',horizon:'30 anos',text:'Constrói cenários para o desenvolvimento do setor energético e orienta escolhas estruturais que ultrapassam o ciclo decenal. É integrado, indicativo e considera diferentes fontes e tecnologias.',owner:'EPE, sob diretrizes do MME',input:'Balanços, cenários econômicos, demanda e alternativas tecnológicas',output:'Cenários e orientações de longo prazo',link:'https://epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/plano-nacional-de-energia-pne'},
    pde:{kicker:'Expansão integrada',title:'Plano Decenal de Expansão de Energia',horizon:'10 anos',text:'Apresenta as perspectivas de expansão da oferta, da demanda e da infraestrutura para a década seguinte. Aproxima as orientações de longo prazo das decisões e investimentos mais imediatos.',owner:'EPE, sob diretrizes e apoio do MME',input:'PNE, demanda projetada, recursos, projetos e políticas vigentes',output:'Trajetória decenal de expansão do setor',link:'https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/plano-decenal-de-expansao-de-energia-2035'},
    pet:{kicker:'Expansão da transmissão',title:'PET / PELP',horizon:'6 anos +',text:'Reúne as instalações de transmissão ainda não licitadas ou autorizadas. O PET tem caráter determinativo nos seis primeiros anos; o PELP apresenta, a partir do sétimo ano, a expansão indicativa de longo prazo.',owner:'EPE',input:'PDE, estudos regionais, projeções de carga, geração e intercâmbios',output:'Recomendações de novas instalações de transmissão',link:'https://epe.gov.br/pt/leiloes-de-energia/leiloes-de-transmissao/pet-pelp'},
    par:{kicker:'Operação elétrica de médio prazo',title:'PAR / PEL',horizon:'5 anos',text:'Avalia o desempenho futuro do SIN e combina medidas operativas com recomendações estruturais. Incorpora acessos, restrições e necessidades observadas mais próximas da operação real.',owner:'ONS',input:'Plano de expansão, dados dos agentes, acessos e condições operativas',output:'Medidas operativas, ampliações, reforços e melhorias',link:'https://www.ons.org.br/Paginas/energia-no-futuro/suprimento-eletrico/parpel2025/sumario-executivo/index.aspx'},
    potee:{kicker:'Da recomendação à outorga',title:'Plano de Outorgas de Transmissão',horizon:'Atualizado',text:'Consolida os empreendimentos recomendados pelos estudos de expansão e operação e indica quais deverão ser encaminhados para licitação ou autorização.',owner:'MME, com subsídios da EPE, ONS e ANEEL',input:'PET/PELP, PAR/PEL e análise regulatória',output:'Relação de empreendimentos para leilões e autorizações',link:'https://www.gov.br/mme/pt-br/assuntos/secretarias/sntep/publicacoes/plano-de-outorgas-de-transmissao-de-energia-eletrica-potee'},
    pdd:{kicker:'Expansão da distribuição',title:'Plano de Desenvolvimento da Distribuição',horizon:'Anual',text:'Apresenta os estudos e investimentos previstos para expansão, melhoria e renovação das redes de alta, média e baixa tensão e das subestações de distribuição.',owner:'Cada distribuidora, com envio à ANEEL',input:'Crescimento da carga, novas conexões, qualidade e vida útil dos ativos',output:'Carteira de investimentos da distribuição',link:'https://portalrelatorios.aneel.gov.br/indicadoresDistribuicao/planoDesenvolvimentoDistribuicao'}
  };
  function setText(id,value){var el=document.getElementById(id);if(el)el.textContent=value;}
  function flowBalloon(key){
    var item=flowData[key];
    return '<div class="orgao__balao" id="pe-balao-'+key+'" role="dialog" aria-label="'+item.title+'" hidden>'+
      '<button class="orgao__fechar" type="button" aria-label="Fechar">×</button>'+
      '<h3>'+item.title+'</h3><p class="orgao__extenso">'+item.kicker+'</p><p>'+item.text+'</p>'+
      '<p><strong>Entrega principal:</strong> '+item.output+'.</p></div>';
  }
  var originalFlow=document.querySelector('.pe-flow');
  if(originalFlow){
    var planningOrganogram=document.createElement('div');
    planningOrganogram.className='organograma__workspace pe-organograma__workspace';
    planningOrganogram.innerHTML='<div class="organograma pe-organograma" data-ligacoes="direction>data data>epe data>ons epe>potee ons>potee potee>aneel">'+
      '<svg class="organograma__linhas" aria-hidden="true"></svg>'+
      '<div class="organograma__nivel"><div class="orgao" data-org="direction"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-direction"><strong>CNPE + MME</strong><small>Diretrizes da política energética</small></button>'+flowBalloon('direction')+'</div></div>'+
      '<div class="organograma__nivel"><div class="orgao" data-org="data"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-data"><strong>BEN + projeções</strong><small>Base comum de informações</small></button>'+flowBalloon('data')+'</div></div>'+
      '<div class="organograma__nivel"><div class="orgao" data-org="epe"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-epe"><strong>EPE</strong><small>PNE · PDE · PET/PELP</small></button>'+flowBalloon('epe')+'</div><div class="orgao" data-org="ons"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-ons"><strong>ONS</strong><small>PAR/PEL</small></button>'+flowBalloon('ons')+'</div></div>'+
      '<div class="organograma__nivel"><div class="orgao" data-org="potee"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-potee"><strong>MME · POTEE</strong><small>Consolidação para outorga</small></button>'+flowBalloon('potee')+'</div></div>'+
      '<div class="organograma__nivel"><div class="orgao" data-org="aneel"><button class="orgao__botao" type="button" aria-expanded="false" aria-controls="pe-balao-aneel"><strong>ANEEL</strong><small>Leilões, autorizações e fiscalização</small></button>'+flowBalloon('aneel')+'</div></div></div>'+
      '<aside class="organograma__painel" id="pe-organograma-detalhes" aria-live="polite" hidden></aside>';
    originalFlow.replaceWith(planningOrganogram);
  }
  var instrumentTabs=document.querySelector('.pe-instrument-tabs');
  if(instrumentTabs){
    var benButton=document.createElement('button');
    benButton.type='button';
    benButton.setAttribute('role','tab');
    benButton.setAttribute('aria-selected','false');
    benButton.setAttribute('data-instrument','ben');
    benButton.textContent='BEN';
    instrumentTabs.insertBefore(benButton,instrumentTabs.firstChild);
  }
  document.querySelectorAll('[data-flow]').forEach(function(button){button.addEventListener('click',function(){var key=button.getAttribute('data-flow'),item=flowData[key];if(!item)return;document.querySelectorAll('[data-flow]').forEach(function(el){var active=el===button;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',String(active));});setText('pe-flow-kicker',item.kicker);setText('pe-flow-title',item.title);setText('pe-flow-text',item.text);setText('pe-flow-output',item.output);});});
  document.querySelectorAll('[data-instrument]').forEach(function(button){button.addEventListener('click',function(){var key=button.getAttribute('data-instrument'),item=instrumentData[key];if(!item)return;document.querySelectorAll('[data-instrument]').forEach(function(el){el.setAttribute('aria-selected',String(el===button));});setText('pe-inst-kicker',item.kicker);setText('pe-inst-title',item.title);setText('pe-inst-horizon',item.horizon);setText('pe-inst-text',item.text);setText('pe-inst-owner',item.owner);setText('pe-inst-input',item.input);setText('pe-inst-output',item.output);var link=document.getElementById('pe-inst-link');if(link)link.href=item.link;});});
  var intro=document.querySelector('.pe-intro');
  if(intro){
    var introTitle=document.getElementById('pe-intro-title');
    if(introTitle)introTitle.textContent='Como se organiza o planejamento energético';
    var introLinks=intro.querySelector('.pe-intro__links');
    if(introLinks)introLinks.remove();
    var introCopy=intro.querySelector('.pe-intro__copy');
    if(introCopy){
      introCopy.insertAdjacentHTML('beforeend','<p>A produção documental começa pela base de evidências. A EPE consolida anualmente o Balanço Energético Nacional — BEN, que registra oferta, transformação e consumo de energia. A partir dessa base e de projeções econômicas, demográficas e tecnológicas, a empresa elabora o Plano Nacional de Energia — PNE, com orientação estrutural de longo prazo, e o Plano Decenal de Expansão de Energia — PDE, que aproxima os cenários das decisões esperadas para os dez anos seguintes.</p><p>Na transmissão, a EPE detalha as novas instalações recomendadas no Programa de Expansão da Transmissão e no Plano de Expansão de Longo Prazo — PET/PELP. O ONS, responsável pela coordenação da operação do Sistema Interligado Nacional, produz o PAR/PEL para avaliar o desempenho elétrico no horizonte de cinco anos, indicar medidas operativas e propor ampliações, reforços, melhorias ou ajustes no cronograma da expansão.</p><p>Essas recomendações convergem no Plano de Outorgas de Transmissão de Energia Elétrica — POTEE, elaborado pelo MME para organizar os empreendimentos que avançarão para licitação ou autorização pela ANEEL. Na distribuição, cada concessionária prepara anualmente seu Plano de Desenvolvimento da Distribuição — PDD, reunindo estudos e investimentos em expansão, melhoria e renovação das subestações e redes de alta, média e baixa tensão. Assim, cada instituição produz um documento próprio, mas todos integram um único ciclo de planejamento.</p>');
    }
  }
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var reveals=document.querySelectorAll('.pe-reveal');if(reduced||!('IntersectionObserver'in window)){reveals.forEach(function(el){el.classList.add('is-visible');});}else{var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.12});reveals.forEach(function(el){observer.observe(el);});}
})();
