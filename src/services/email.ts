import { supabase } from '@/lib/supabase/client'

export const emailService = {
  async sendEmail(to: string, subject: string, body: string, tenantId?: string) {
    // Wrap the plain text body in a professional HTML template
    const formattedBody = body.replace(/\n/g, '<br/>')
    const html = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f1f5f9;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px;">mt3 Compliance</h2>
        </div>
        <div style="color: #334155; font-size: 16px; line-height: 1.6; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
          ${formattedBody}
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Este é um e-mail automático enviado de forma segura pelo sistema mt3 Compliance.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">
            Por favor, não responda diretamente a este e-mail.
          </p>
        </div>
      </div>
    `

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, log_body: body, tenant_id: tenantId },
    })

    if (error) throw new Error(error.message)
    if (data?.error) throw new Error(data.error)
    return data
  },
}
