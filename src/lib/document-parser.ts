/**
 * Utilitário para extração de texto de documentos.
 * Em um ambiente de produção real, integraria com Edge Functions rodando pdf-parse ou similar.
 * Para fins de demonstração, simulamos a extração de conteúdo baseando-se no nome do arquivo,
 * preparando-o para o consumo seguro pela IA.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Simula tempo de processamento/OCR
    setTimeout(() => {
      const isPdf = file.name.toLowerCase().endsWith('.pdf')
      const docTypeStr = isPdf ? 'Documento PDF' : 'Documento de Texto'

      resolve(`[Metadados: ${docTypeStr} | Arquivo: ${file.name} | Tamanho: ${(file.size / 1024).toFixed(2)} KB]
--- CONTEÚDO EXTRAÍDO VIA OCR/PARSER ---
A organização, através de sua Alta Direção, estabelece este documento como diretriz oficial de compliance.
Art. 1º: Todos os colaboradores e parceiros de negócios devem atuar em conformidade irrestrita com a Lei Anticorrupção (Lei nº 12.846/2013) e o Decreto 11.129/2022.
Art. 2º: É estritamente proibida a oferta, promessa ou recebimento de vantagens indevidas a agentes públicos ou privados.
Art. 3º: Quaisquer não conformidades identificadas na execução das atividades operacionais deverão ser comunicadas imediatamente através do Canal de Denúncias, sendo garantida a proteção contra retaliações.
Data de Validade/Aprovação: Em vigor a partir da data de upload no SGC.
--- FIM DO CONTEÚDO ---`)
    }, 1200)
  })
}
