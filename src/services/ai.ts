export const aiService = {
  chat: async (
    userMessage: string,
    contextType: string,
    contextId?: string,
  ): Promise<{ message: string }> => {
    // Simulando um delay de rede para a resposta da IA
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      message: `Recebi sua mensagem: "${userMessage}". Como este é um ambiente de demonstração e simulação, atuo como um placeholder para o motor RAG (Retrieval-Augmented Generation) de compliance. Recomendo verificar os requisitos diretamente nos painéis da ISO 37301 ou MROSC.`,
    }
  },
}
