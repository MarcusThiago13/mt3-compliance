import { supabase } from '@/lib/supabase/client'

export const aiService = {
  chat: async (
    userMessage: string,
    history: any[],
    contextData: any,
  ): Promise<{ message: string; actions?: any[] }> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { userMessage, history, contextData },
      })
      if (error) throw error
      if (data && data.message) return data
      throw new Error('Invalid response format from AI function')
    } catch (err: any) {
      console.warn('Edge function chat failed, using fallback agentic mock.', err.message)

      // Intelligent fallback logic directly in the client if Edge Function fails or lacks API Key
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const isMrosc = contextData?.path?.includes('/osc')
      const isReport = contextData?.path?.includes('/report')
      const isStatus = contextData?.path?.includes('/status')
      const persona = contextData?.persona || 'Geral'

      let msg = `Recebi sua mensagem: "${userMessage}".\n\n[Modo Simulado - Persona: ${persona}]\nComo a chave da API não está configurada ou houve falha de rede, compreendo que você está na tela \`${contextData?.path || '/'}\`.`

      if (persona === 'Auditor') {
        msg += `\n\n**Visão de Auditor:** Identifiquei que é crucial manter a trilha de evidências intacta nesta tela. Preste muita atenção em potenciais descompassos físico-financeiros e verifique o lastro documental de cada lançamento para evitar glosas.`
      } else if (persona === 'DPO') {
        msg += `\n\n**Visão de DPO / LGPD:** Lembre-se de revisar os controles de privacidade e garantir a anonimização de dados pessoais sensíveis (como CPFs e informações de assistidos) antes de gerar qualquer relatório público a partir daqui.`
      } else if (persona === 'Consultor') {
        msg += `\n\n**Visão de Consultor:** Para otimizar o planejamento, assegure que as metas do plano de trabalho sejam SMART (Específicas, Mensuráveis, Alcançáveis, Relevantes e Temporais). Recomendo revisar a coerência das rubricas.`
      } else if (persona === 'Compliance') {
        msg += `\n\n**Visão de Compliance Officer:** Em conformidade com a ISO 37301 e 37001, certifique-se de que os riscos associados a esta etapa estejam mapeados na matriz de riscos e que haja evidências de controles mitigatórios aplicados.`
      } else {
        if (isMrosc) {
          msg += `\n\nNesta área do MROSC, as regras de prestação de contas exigem rigor na comprovação de despesas. O Demonstrativo Integral de Despesas (DID) deve estar alinhado com o extrato bancário específico da parceria.`
        } else if (isReport || isStatus) {
          msg += `\n\nVocê está acessando o Canal Seguro. Este ambiente garante criptografia de ponta a ponta e anonimato garantido pela lei de proteção ao denunciante.`
        } else {
          msg += `\n\nNo mt3 Compliance, focamos na ISO 37301. Se precisar gerar um dossiê, basta acessar o módulo de Inteligência.`
        }
      }

      let actions = []
      const lowerMsg = userMessage.toLowerCase()

      // Simulating Claude's ability to trigger actions from intent
      if (
        lowerMsg.includes('ir para') ||
        lowerMsg.includes('navegar') ||
        lowerMsg.includes('prestaç') ||
        lowerMsg.includes('dashboard')
      ) {
        const targetPath =
          lowerMsg.includes('prestaç') && contextData?.tenantId
            ? `/${contextData.tenantId}/osc/prestacao-contas`
            : lowerMsg.includes('usuário')
              ? '/admin/users'
              : '/tenants'

        actions.push({ action: 'NAVIGATE', path: targetPath })
        msg += `\n\nEntendido. Executei o redirecionamento solicitado pelo sistema para você!`
      }

      return { message: msg, actions }
    }
  },
}
