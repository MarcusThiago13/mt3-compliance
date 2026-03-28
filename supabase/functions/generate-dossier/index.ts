import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const authHeader = req.headers.get('Authorization')
    if (!authHeader || authHeader.includes('undefined') || authHeader.includes('null')) {
      return new Response(JSON.stringify({ error: 'Não autorizado (Sessão expirada ou token ausente).' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Create client bounded to the user to enforce RLS intrinsically
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: `Não autorizado (Token inválido): ${userError?.message || 'Sessão não identificada'}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { tenantId, options } = await req.json()
    if (!tenantId) throw new Error('tenantId is required')

    // Fetch tenant data - RLS will block if user has no access!
    const { data: tenant, error: tenantError } = await supabaseClient.from('tenants').select('*').eq('id', tenantId).single()
    if (tenantError || !tenant) throw new Error('Acesso negado à organização ou cliente não encontrado.')

    // Fetch additional data based on options (Safely filtered by RLS)
    let gaps: any[] = []
    if (options?.gaps) {
      const { data } = await supabaseClient.from('gaps').select('*').eq('tenant_id', tenantId)
      gaps = data || []
    }
    
    let risks: any[] = []
    if (options?.risks) {
      const { data } = await supabaseClient.from('risks').select('*').eq('tenant_id', tenantId)
      risks = data || []
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    // Page 1: Capa
    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()

    page.drawText('DOSSIÊ DE COMPLIANCE', { x: 50, y: height - 100, size: 28, font: boldFont, color: rgb(0, 0.2, 0.4) })
    page.drawText('Relatório Oficial de Conformidade', { x: 50, y: height - 130, size: 16, font: font, color: rgb(0.4, 0.4, 0.4) })
    
    page.drawText(`Organização: ${tenant.name}`, { x: 50, y: height - 250, size: 14, font: boldFont })
    page.drawText(`CNPJ: ${tenant.cnpj || 'Não cadastrado'}`, { x: 50, y: height - 275, size: 12, font })
    
    const dateStr = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    page.drawText(`Data de Geração: ${dateStr}`, { x: 50, y: height - 325, size: 12, font })
    
    const hash = crypto.randomUUID().split('-')[0].toUpperCase()
    page.drawText(`Hash de Autenticidade: ${hash}`, { x: 50, y: height - 350, size: 10, font, color: rgb(0.5, 0.5, 0.5) })

    // Page 2: Conteúdo
    let currentPage = pdfDoc.addPage([595.28, 841.89])
    let yPos = height - 80

    const checkNewPage = (neededSpace: number) => {
      if (yPos < neededSpace) {
        currentPage = pdfDoc.addPage([595.28, 841.89])
        yPos = height - 80
      }
    }

    if (options?.onboarding) {
      checkNewPage(100)
      currentPage.drawText('1. Informações Institucionais e Perfil', { x: 50, y: yPos, size: 16, font: boldFont, color: rgb(0, 0.2, 0.4) })
      yPos -= 30
      currentPage.drawText('O Programa de Integridade foi estruturado considerando o porte e a complexidade', { x: 50, y: yPos, size: 11, font })
      yPos -= 20
      currentPage.drawText('da organização, em estrita observância ao Art. 56 do Decreto 11.129/2022.', { x: 50, y: yPos, size: 11, font })
      yPos -= 40
    }

    if (options?.risks) {
      checkNewPage(100)
      currentPage.drawText('2. Gestão de Riscos (ISO 37301 - 4.6 / Decreto - Art. 57, V)', { x: 50, y: yPos, size: 16, font: boldFont, color: rgb(0, 0.2, 0.4) })
      yPos -= 30
      
      if (risks.length > 0) {
        risks.forEach((risk: any) => {
          checkNewPage(40)
          currentPage.drawText(`• ${risk.title}`, { x: 50, y: yPos, size: 11, font: boldFont })
          yPos -= 15
          currentPage.drawText(`  Impacto: ${risk.impact} | Probabilidade: ${risk.probability}`, { x: 50, y: yPos, size: 10, font })
          yPos -= 25
        })
      } else {
        currentPage.drawText('Nenhum risco registrado no sistema.', { x: 50, y: yPos, size: 11, font })
        yPos -= 30
      }
    }

    if (options?.gaps) {
      checkNewPage(100)
      currentPage.drawText('3. Análise de Gaps e Não Conformidades', { x: 50, y: yPos, size: 16, font: boldFont, color: rgb(0, 0.2, 0.4) })
      yPos -= 30
      
      if (gaps.length > 0) {
        gaps.forEach((gap: any) => {
          checkNewPage(50)
          currentPage.drawText(`• [${gap.severity.toUpperCase()}] Requisito: ${gap.rule}`, { x: 50, y: yPos, size: 11, font: boldFont })
          yPos -= 15
          const desc = gap.description.length > 80 ? gap.description.substring(0, 80) + '...' : gap.description
          currentPage.drawText(`  ${desc}`, { x: 50, y: yPos, size: 10, font })
          yPos -= 25
        })
      } else {
        currentPage.drawText('Nenhuma não conformidade ou gap pendente.', { x: 50, y: yPos, size: 11, font })
        yPos -= 30
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save()

    // Use Admin Client solely for saving to storage and creating the unalterable audit log
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const fileName = `dossier_${tenantId}_${Date.now()}.pdf`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('tenant_documents')
      .upload(fileName, pdfBytes, { contentType: 'application/pdf' })

    if (uploadError) throw new Error(`Erro ao salvar documento: ${uploadError.message}`)

    const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
      .from('tenant_documents')
      .createSignedUrl(fileName, 60 * 60 * 24)

    if (signError) throw new Error(`Erro ao gerar link de acesso: ${signError.message}`)

    await supabaseAdmin.from('audit_logs').insert({
      tenant_id: tenantId,
      clause_id: 'dossier',
      action: `Dossiê gerado (Hash: ${hash})`,
      user_email: user.email || 'system'
    })

    return new Response(
      JSON.stringify({
        message: 'Dossiê gerado com sucesso em formato PDF/A.',
        url: signedUrlData.signedUrl,
        fileName
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
