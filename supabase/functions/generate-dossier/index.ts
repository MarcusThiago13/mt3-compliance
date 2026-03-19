import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from 'shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { clauseId } = await req.json()

    // Simulate processing delay for Dossier generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return new Response(
      JSON.stringify({
        message: 'Dossier gerado com sucesso em formato PDF/A.',
        url: `https://example.com/dossier/export_${clauseId}_${Date.now()}.pdf`,
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
