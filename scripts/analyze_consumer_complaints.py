#!/usr/bin/env python3
"""Consolida as reclamações ANEEL usadas na página Direito do Consumidor."""

from __future__ import annotations

import csv
import io
import json
import sys
import zipfile
from collections import Counter
from pathlib import Path

YEARS = {str(year) for year in range(2021, 2026)}
CATEGORIES = {
    "interrupcao": "Interrupções no fornecimento",
    "faturamento": "Fatura, medição e cobrança",
    "atendimento": "Atendimento e prazos",
    "qualidade": "Qualidade da energia e rede",
    "danos": "Danos elétricos",
    "suspensao": "Suspensão, pagamento e religação",
    "cadastro": "Cadastro, contrato e conexão",
}
OLD_MAP = {
    "Reclamação de Interrupção do Fornecimento": "interrupcao",
    "Variação de Consumo": "faturamento", "Faturas": "faturamento",
    "Erro de Leitura": "faturamento", "Cobrança por Irregularidade": "faturamento",
    "Apresentação / Entrega de Contas": "faturamento",
    "Cobrança Indevida de Atividade Acessória": "faturamento",
    "Tarifas": "faturamento", "Custo de Disponibilidade": "faturamento",
    "Prazos": "atendimento", "Atendimento": "atendimento",
    "Indisponibilidade de Agência/Postos e Canais de atendimento/Atend. Telefônico/Serviço de Arrecadação": "atendimento",
    "Tensão de Fornecimento": "qualidade", "Danos Elétricos": "danos",
    "Suspensão Indevida": "suspensao", "Alteração Cadastral": "cadastro",
}
NEW_MAP = {
    "Solicitação não atendida ou atrasada": "cadastro",
    "Orçamento - Participação Financeira / Universalização": "cadastro",
    "Restituição de antecipação": "cadastro", "Cadastro": "cadastro",
    "Uso não autorizado de dados cadastrais": "cadastro",
    "Contratos / Encerramento contratual": "cadastro", "Troca de titularidade": "cadastro",
    "Conexão (Caso Geral)": "cadastro",
    "Ausência do medidor/sistema de medição": "faturamento",
    "Avaria/Defeito medidor/sistema de medição": "faturamento", "Lacre": "faturamento",
    "Impedimento de acesso": "faturamento", "Erro de leitura": "faturamento",
    "Variação de consumo (Leitura / Faturamento / Fatura)": "faturamento",
    "Demais grandezas faturadas": "faturamento", "Tarifas aplicadas": "faturamento",
    "Classificação / Subsídios tarifários": "faturamento",
    "Faturamento por estimativa / média": "faturamento",
    "Faturamento pelo custo de disponibilidade": "faturamento",
    "Compensação / Devolução não realizada / incorreta": "faturamento",
    "Bandeiras Tarifárias": "faturamento", "Tributos": "faturamento",
    "Contribuição para o Custeio dos Serviços de Iluminação Pública - COSIP": "faturamento",
    "Apresentação / Entrega da fatura": "faturamento", "Qualidade da impressão da fatura": "faturamento",
    "Acréscimos moratórios - Multas e juros": "faturamento",
    "Cobranças de períodos anteriores": "faturamento", "Parcelamento de débito": "faturamento",
    "Serviços cobráveis": "faturamento", "Atividades acessórias": "faturamento",
    "Valores Cobrados": "faturamento", "Deficiência na caracterização da irregularidade": "faturamento",
    "Não recebimento do TOI - Termo de Ocorrência e Inspeção": "faturamento",
    "Responsabilidade sobre a Irregularidade": "faturamento",
    "Cobrança decorrente de religação à revelia": "faturamento",
    "Fatura paga e não baixada": "suspensao",
    "Indisponibilidade / Inexistência de posto de arrecadação no Município": "suspensao",
    "Suspensão indevida": "suspensao", "Religação não realizada / fora do prazo": "suspensao",
    "Inscrição em Cadastro de Negativação": "suspensao", "Atuação de empresa de cobrança": "suspensao",
    "Conduta de empregado ou prestador de serviço": "atendimento",
    "Atendimento Presencial / Falta de agência / posto de atendimento": "atendimento",
    "Atendimento Telefônico": "atendimento", "Atendimento pela Internet": "atendimento",
    "Demais canais de acesso": "atendimento", "Prazos (não previstos nas tipologias anteriores)": "atendimento",
    "Prazos (ligação sem obras)": "atendimento", "Prazos (ligação com obras)": "atendimento",
    "Interrupção no Fornecimento - Falta de energia": "interrupcao",
    "Interrupção Frequente do Fornecimento": "interrupcao", "Interrupção Programada": "interrupcao",
    "Tensão de Fornecimento": "qualidade", "Cabo partido": "qualidade", "Poste": "qualidade",
    "Transformador": "qualidade", "Objeto na rede": "qualidade", "Poda de árvore": "qualidade",
    "Entulhos / Galhos de árvores não recolhidos": "qualidade",
    "Danos em equipamentos": "danos", "Vistoria dos Equipamentos": "danos",
    "Laudo/orçamento": "danos", "Ressarcimento inferior ao devido": "danos",
    "Indeferimento total / parcial": "danos",
}

def number(value: str) -> float:
    try:
        return float((value or "").strip().replace(".", "").replace(",", "."))
    except ValueError:
        return 0.0

def category_for(year: str, description: str) -> str | None:
    return (OLD_MAP if year in {"2021", "2022"} else NEW_MAP).get(description)

def main(paths: list[str]) -> None:
    received, procedent, improcedent = Counter(), Counter(), Counter()
    avg_days_weighted, avg_days_weight = Counter(), Counter()
    municipalities, months, mapping_totals = Counter(), Counter(), Counter()
    duplicate_rows, excluded = Counter(), Counter()
    for raw_path in paths:
        with zipfile.ZipFile(Path(raw_path)) as archive:
            stream = io.TextIOWrapper(archive.open(archive.namelist()[0]), encoding="utf-8-sig", newline="")
            reader = csv.DictReader(stream, delimiter=";")
            previous = None
            for row in reader:
                year = row.get("AnoCompetencia", "")
                if year not in YEARS:
                    continue
                signature = tuple(row.get(field, "") for field in reader.fieldnames or ())
                if signature == previous:
                    duplicate_rows[year] += 1
                    continue
                previous = signature
                total = int(number(row.get("QtdManifestacoesRecebidas", "")))
                if total <= 0:
                    continue
                description = row.get("DscManifestacao", "").strip()
                category = category_for(year, description)
                if not category:
                    excluded[(year, description)] += total
                    continue
                mapping_totals[(year, description, category)] += total
                state, channel = row.get("SigUF", "").strip(), row.get("NomCanalManifestacao", "").strip()
                proc = int(number(row.get("QtdManifestacoesProcedentes", "")))
                improc = int(number(row.get("QtdManifestacoesImprocedentes", "")))
                days = number(row.get("NumPrazoMedioSolucao", ""))
                for scope in (["BR", "PI"] if state == "PI" else ["BR"]):
                    key = (scope, year, category, channel)
                    received[key] += total; procedent[key] += proc; improcedent[key] += improc
                    if proc > 0:
                        avg_days_weighted[key] += days * proc; avg_days_weight[key] += proc
                if state == "PI":
                    month = int(number(row.get("MesCompetencia", "")))
                    months[(year, month, category)] += total
                    municipality = row.get("NomMunicipio", "").strip()
                    if municipality: municipalities[(year, municipality, category)] += total
    annual = []
    for key in sorted(received):
        scope, year, category, channel = key; solved = procedent[key] + improcedent[key]
        annual.append({"scope": scope, "year": int(year), "category": category, "channel": channel,
            "received": received[key], "procedent": procedent[key], "improcedent": improcedent[key],
            "procedent_rate": round(100 * procedent[key] / solved, 1) if solved else None,
            "avg_solution_days": round(avg_days_weighted[key] / avg_days_weight[key], 1) if avg_days_weight[key] else None})
    output = {"meta": {"period": "2021–2025",
        "source": "ANEEL — Manifestações no 1º e 2º nível da Distribuidora",
        "source_url": "https://dadosabertos.aneel.gov.br/dataset/manifestacoes-no-1o-e-2o-niveis-da-distribuidora",
        "classification_url": "https://www2.aneel.gov.br/cedoc/reh20212992ti.pdf",
        "categories": CATEGORIES, "duplicate_consecutive_rows_removed": dict(sorted(duplicate_rows.items())),
        "method": "Somente tipologias de reclamação. Pedidos de informação, solicitações de serviço, denúncias, elogios, sugestões e categorias Outros foram excluídos."},
        "annual": annual,
        "piaui_monthly": [{"year": int(y), "month": m, "category": c, "received": n} for (y,m,c),n in sorted(months.items())],
        "piaui_municipal": [{"year": int(y), "municipality": u, "category": c, "received": n} for (y,u,c),n in sorted(municipalities.items())],
        "classification": [{"year": int(y), "description": d, "category": c, "received": n} for (y,d,c),n in sorted(mapping_totals.items())],
        "excluded_top": [{"year": int(y), "description": d, "received": n} for (y,d),n in sorted(excluded.items(), key=lambda item: -item[1])[:50]]}
    json.dump(output, sys.stdout, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main(sys.argv[1:])
