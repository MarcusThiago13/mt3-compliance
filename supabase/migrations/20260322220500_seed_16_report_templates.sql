-- Migration to seed the 16 standard Compliance Report Templates

DO $$ 
BEGIN
  -- Remove existing global templates to insert the clean structured 16 models
  DELETE FROM public.document_templates WHERE tenant_id IS NULL;

  -- 1. Relatório técnico anual do Sistema de Compliance
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('1. Relatório técnico anual do Sistema de Compliance', 'Estruturais e Anuais', 'Consolida em um único documento técnico o estado do sistema de compliance no período, cobrindo governança, riscos, denúncias e métricas.', 
'# Relatório Técnico Anual do Sistema de Compliance

## 1. Sumário Executivo
[Resumo geral do estado do sistema no período analisado]

## 2. Contexto Organizacional e Escopo
[Descrever o perfil da organização e o alcance do programa]

## 3. Estrutura de Governança e Responsabilidades
[Detalhamento da liderança e atuação do compliance]

## 4. Identificação e Avaliação de Riscos
[Lista e avaliação dos principais riscos mapeados]

## 5. Controles Internos
[Controles implementados e seu status]

## 6. Canal de Denúncias e Investigações
[Dados de denúncias, respeitando sigilo, e resoluções]

## 7. Due Diligence e Auditorias
[Resumo das diligências e apontamentos de auditoria]

## 8. Gaps, Ações Corretivas e Indicadores
[Não conformidades abertas e métricas gerais]

## 9. Conclusão e Melhoria Contínua
[Ações futuras]',
'Aja como Chief Compliance Officer. Gere um relatório técnico extenso e formal, extraindo absolutamente todos os dados estruturais do contexto fornecido (riscos, gaps, controles, due diligence, denúncias). Indique "[Informação não disponível no sistema]" se faltarem dados correspondentes à seção.');

  -- 2. Relatório de conformidade do Programa de Integridade
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('2. Relatório de conformidade do Programa de Integridade', 'Avaliação e Monitoramento', 'Documento evidencial focado em demonstrar o desenho, aplicação e efetividade do programa (inspirado na Lei Anticorrupção).', 
'# Relatório de Conformidade do Programa de Integridade

## 1. Escopo e Objetivo da Avaliação
[Descrição dos parâmetros analisados]

## 2. Desenho do Programa de Integridade
[Políticas, códigos e procedimentos identificados]

## 3. Evidências de Aplicação Prática
[Como o programa opera no dia a dia com base em dados]

## 4. Avaliação de Efetividade (Prevenção e Resposta)
[Como os riscos e gaps são prevenidos e tratados]

## 5. Indicadores de Cumprimento Legal
[Conformidade com métricas]

## 6. Plano de Aprimoramento e Recomendações
[Gaps a corrigir]',
'Foque em evidenciar a EFETIVIDADE do programa. Utilize as informações de Gaps, Histórico de Conformidade e Ações de Auditoria para comprovar que o sistema não está apenas no papel, mas é monitorado. Seja técnico e objetivo.');

  -- 3. Relatório de monitoramento do Programa ou Plano de Integridade
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('3. Relatório de monitoramento do Programa ou Plano de Integridade', 'Avaliação e Monitoramento', 'Acompanha a implementação de metas, desvios e percentuais de execução do plano.', 
'# Relatório de Monitoramento do Plano de Integridade

## 1. Visão Geral das Metas
[Metas previstas no período]

## 2. Status de Execução das Ações
[Análise das ações corretivas e gaps pendentes]

## 3. Desvios Identificados e Justificativas
[Relato de atrasos ou problemas]

## 4. Próximas Etapas
[Passos futuros]',
'Gere um relatório focado puramente em ACOMPANHAMENTO. Foque nos "Gaps e Melhorias" (Não Conformidades) extraídos do contexto. Destaque quais regras estão com desvios abertos e precisam de atenção imediata.');

  -- 4. Relatório de gestão de riscos de compliance
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('4. Relatório de gestão de riscos de compliance', 'Gestão de Riscos', 'Documenta a avaliação periódica de riscos, listando níveis inerentes, residuais e tratamentos propostos.', 
'# Relatório de Gestão de Riscos de Compliance

## 1. Metodologia e Universo Analisado
[Metodologia adotada]

## 2. Inventário de Riscos e Níveis Inerentes
[Listagem detalhada dos riscos (impacto vs probabilidade)]

## 3. Avaliação de Controles Existentes
[Controles mapeados que mitigam os riscos]

## 4. Riscos Críticos e Planos de Tratamento
[Riscos mais altos e recomendações]

## 5. Tendências e Conclusões
[Visão global do ambiente de riscos]',
'Aja como Especialista de Risco. Analise e extraia todos os riscos fornecidos no RAG. Cruze esses riscos com a lista de Controles Internos disponíveis e aponte se os controles cobrem os riscos mais severos.');

  -- 5. Relatório de controles internos de compliance
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('5. Relatório de controles internos de compliance', 'Gestão de Riscos', 'Descreve desenho, operação e testes dos controles chave financeiros e não financeiros.', 
'# Relatório de Controles Internos

## 1. Escopo da Avaliação
[Contexto da avaliação de controles]

## 2. Inventário de Controles
[Listagem dos controles cadastrados e status]

## 3. Testes, Avaliação de Operação e Efetividade
[Análise de como os controles se comportam frente aos gaps]

## 4. Deficiências e Falhas
[Apontamento de lacunas baseado nos gaps e histórico]

## 5. Recomendações Corretivas
[Medidas mitigadoras]',
'Use os dados da entidade "controles_internos". Liste todos os controles e relacione possíveis ineficiências usando a lista de "gaps_identificados" fornecida no contexto.');

  -- 6. Relatório do canal de denúncias e das investigações internas
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('6. Relatório do canal de denúncias e das investigações internas', 'Investigações e Incidentes', 'Apresenta volume de relatos, tipologias, tempos médios e medidas adotadas (mantendo o sigilo).', 
'# Relatório do Canal de Denúncias

## 1. Volume de Relatos do Período
[Estatísticas globais]

## 2. Tipologia e Severidade
[Classificação por categoria e gravidade]

## 3. Status das Investigações
[Progresso dos casos]

## 4. Temas Recorrentes e Análise de Risco
[Correlação com vulnerabilidades]

## 5. Medidas Adotadas e Lições Aprendidas
[Correções no ambiente]',
'Aja como Gestor do Canal de Denúncias. Extraia os dados da entidade "denuncias_registradas". OBRIGATÓRIO: Aja de forma analítica e NÃO exponha nenhum dado pessoal ou detalhes que possam identificar denunciantes.');

  -- 7. Relatório de ações corretivas, remediação e melhoria contínua
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('7. Relatório de ações corretivas, remediação e melhoria contínua', 'Operacional e Correção', 'Documenta planos de ação e monitora eficácia, impacto em riscos e remediação.', 
'# Relatório de Remediação e Melhoria Contínua

## 1. Origem das Ações Corretivas
[Descrição das fontes geradoras de gaps]

## 2. Não Conformidades e Deficiências
[Lista de gaps identificados]

## 3. Planos de Remediação e Status
[Ações necessárias para cada gap]

## 4. Impacto no Ambiente de Risco
[Como a remediação reduz os riscos]

## 5. Conclusões
[Visão da melhoria contínua]',
'Concentre a redação na entidade "gaps_identificados" e nas últimas "atividades de auditoria". Proponha, baseando-se nas não conformidades reais do contexto, planos de remediação lógicos e factíveis.');

  -- 8. Relatório anual de auditoria interna / relatório de atividades de auditoria
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('8. Relatório anual de auditoria interna', 'Auditoria e Governança', 'Consolida as avaliações, achados e status de implementação originados na auditoria interna.', 
'# Relatório Anual de Auditoria Interna

## 1. Planejamento e Escopo
[Objetivos das avaliações do período]

## 2. Achados de Auditoria Identificados
[Gaps e desvios encontrados na operação]

## 3. Recomendações e Plano de Ação
[Sugestões para as áreas de negócio]

## 4. Status de Implementação e Acompanhamento
[Nível de fechamento das pendências]

## 5. Parecer e Conclusão
[Nível de conformidade geral da auditoria]',
'Aja como Auditor Interno Líder. Transforme os Gaps e Riscos severos do contexto em "Achados de Auditoria", usando tom imparcial e formal de reporte para a Alta Administração.');

  -- 9. Relatório de due diligence de terceiros e integridade na cadeia
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('9. Relatório de due diligence de terceiros e integridade na cadeia', 'Terceiros e Parceiros', 'Registra diligências de integridade realizadas (fornecedores, parceiros), com classificação de risco e decisões.', 
'# Relatório de Due Diligence de Terceiros

## 1. Universo de Terceiros Avaliados
[Tipos e categorias de alvos da diligência]

## 2. Classificação de Risco (Risk Assessment)
[Detalhamento de risco baixo, médio e alto]

## 3. Achados, Red Flags e Restrições
[Principais apontamentos identificados]

## 4. Decisões e Mitigações
[Status das aprovações]

## 5. Monitoramento Contínuo
[Conclusões e agenda futura]',
'Utilize rigorosamente os dados da entidade "due_diligence" extraídos do RAG. Consolide os status, liste a distribuição por níveis de risco e elabore conclusões focadas na integridade da cadeia de suprimentos/parceiros.');

  -- 10. Relatório de treinamentos, comunicação e cultura de integridade
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('10. Relatório de treinamentos, comunicação e cultura', 'Cultura e Treinamento', 'Reporta a realização de treinamentos, alcance, avaliação de eficácia e fortalecimento da cultura.', 
'# Relatório de Treinamentos e Cultura de Integridade

## 1. Visão Geral e Planejamento
[Objetivos de cultura para o período]

## 2. Treinamentos e Ações de Comunicação
[Conteúdos aplicados e público-alvo]

## 3. Avaliação de Participação e Efetividade
[Métricas e compreensão do código]

## 4. Gaps de Conscientização
[Desvios identificados]

## 5. Próximos Passos
[Recomendações]',
'Como os dados de treinamento específicos podem estar mesclados na governança (Step 2/4), leia o contexto do perfil e sugira os impactos da cultura nos Riscos identificados. Aponte se os riscos altos carecem de treinamentos específicos.');

  -- 11. Relatório de revisão pela direção
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('11. Relatório de revisão pela direção', 'Estruturais e Anuais', 'Compila resultados para a alta direção: evolução de riscos, adequação de recursos, desvios e decisões.', 
'# Relatório de Revisão pela Direção

## 1. Desempenho Global do Sistema
[Síntese do CMS e histórico de score]

## 2. Mudanças no Contexto e Riscos Emergentes
[Variações no ambiente de negócios e novos riscos]

## 3. Desvios e Ações de Auditoria
[Gaps relevantes e status]

## 4. Desempenho de Controles e Recursos
[Adequação atual e insuficiências]

## 5. Decisões Requeridas da Alta Direção
[Pautas para aprovação]',
'Direcione o texto exclusivamente para o Conselho de Administração e CEO. Seja executivo. Destaque os "gaps" de alta severidade e os "riscos" de maior impacto, pedindo atenção e recursos para tratá-los.');

  -- 12. Relatório de objetivos, metas e desempenho do compliance
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('12. Relatório de objetivos, metas e desempenho do compliance', 'Avaliação e Monitoramento', 'Monitora indicadores estratégicos, baseline, variação de conformidade e status de execução.', 
'# Relatório de Desempenho e Metas

## 1. Objetivos Estratégicos de Compliance
[Alinhamento com o perfil da empresa]

## 2. Resultados do Histórico de Conformidade
[Evolução do score e desvios mês a mês]

## 3. Análise de Variação e Desempenho
[Explicação para subidas ou quedas no score]

## 4. Status de Remediação
[Fechamento de gaps]

## 5. Recomendações Operacionais
[Próximos passos]',
'Baseie a redação fortemente na entidade "historico_conformidade" e "gaps_identificados". Descreva de forma objetiva como os indicadores de compliance se comportaram no período e o porquê das oscilações.');

  -- 13. Relatório executivo mensal ou trimestral para administração
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('13. Relatório executivo para administração/conselho', 'Avaliação e Monitoramento', 'Fornece visão rápida e visual sobre os principais riscos, incidentes e decisões pendentes (Executive Summary).', 
'# Relatório Executivo de Compliance (Dashboard Narrative)

## 1. Destaques do Período
[Bullet points com os principais acontecimentos]

## 2. Riscos e Incidentes Críticos
[Lista objetiva de top risks e denúncias graves]

## 3. Terceiros em Atenção (Due Diligence)
[Casos de alto risco na cadeia]

## 4. Status de Ações e Auditoria
[O que está pendente]

## 5. Pontos para Deliberação
[Decisões rápidas requeridas]',
'Formate o relatório inteiramente em TÓPICOS (bullet points) e parágrafos curtos. Não use blocos de texto longos. O público é diretoria (pouco tempo). Destaque apenas severidades ALTAS e métricas principais.');

  -- 14. Relatório público anual de integridade/compliance
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('14. Relatório público anual de integridade/compliance', 'Transparência Externa', 'Promove transparência institucional externa sem expor dados sensíveis. Apresenta a governança.', 
'# Relatório Público Anual de Integridade

## 1. Mensagem Institucional
[Visão e valores da organização focados em ética]

## 2. Governança e Programa de Integridade
[Estrutura do compliance]

## 3. Canais de Participação e Denúncia
[Como a sociedade e colaboradores podem agir de forma segura]

## 4. Iniciativas e Treinamentos
[Visão agregada de ações de conscientização]

## 5. Compromissos Futuros
[Mensagem de encerramento]',
'OBRIGATÓRIO: Este documento é PÚBLICO. NÃO inclua nenhum risco interno específico, NÃO mencione nomes de partes em due diligence e NÃO exponha detalhes de gaps ou vulnerabilidades operacionais. Mantenha um tom otimista, transparente e institucional.');

  -- 15. Relatório de prestação de contas integrado
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('15. Relatório de prestação de contas integrado', 'Transparência Externa', 'Atende exigências de órgãos de controle e auditoria externa, integrando governança, riscos e resoluções.', 
'# Relatório Integrado de Prestação de Contas

## 1. Governança Corporativa
[Estrutura, planejamento e gestão]

## 2. Gestão de Riscos e Controles
[Mapeamento macro e defesa do ambiente]

## 3. Atuação da Auditoria e Conformidade
[Atividades realizadas para garantir a lisura]

## 4. Tratamento de Incidentes e Providências
[Garantia de que desvios foram corrigidos]

## 5. Conclusão e Accountability
[Demonstração de controle]',
'Aja como Controller em prestação de contas para TCU/CGU ou grande investidor. O tom deve ser de "accountability" (justificando ações e provando que o ambiente está sob controle e monitorado constantemente).');

  -- 16. Relatório de privacidade, proteção de dados e conformidade correlata
  INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
  ('16. Relatório de privacidade e proteção de dados', 'Operacional e Específico', 'Compila conformidade focada em LGPD/GDPR, incidentes de dados e planos corretivos associados.', 
'# Relatório de Privacidade e Proteção de Dados (LGPD)

## 1. Governança de Dados e Estrutura
[Ambiente de privacidade e atuação do DPO]

## 2. Avaliação de Riscos de Privacidade
[Riscos mapeados que tangem vazamento ou proteção]

## 3. Incidentes e Violações de Dados
[Denúncias ou gaps associados a TI/Privacidade]

## 4. Treinamentos e Cultura de Proteção
[Conscientização em segurança da informação]

## 5. Planos de Adequação Contínua
[Melhorias e correções em andamento]',
'Filtre e extraia do RAG APENAS os riscos, controles e gaps que tiverem relação com "dados", "privacidade", "informação", "LGPD", "TI" ou "cibernético". Se o tenant não tiver mapeado riscos específicos de LGPD, aponte essa ausência como uma lacuna.');

END $$;
