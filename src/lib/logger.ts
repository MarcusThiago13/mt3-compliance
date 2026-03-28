import { supabase } from '@/lib/supabase/client'

export const logError = async (message: string, stack?: string, context?: any) => {
  console.error('Bug Scanner Log:', message, stack, context)
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const user_id = sessionData?.session?.user?.id || null

    // Ensure context is safely stringifiable to avoid JSON circular reference errors during system crashes
    let safeContext = context
    try {
      if (context) JSON.stringify(context)
    } catch {
      safeContext = { note: 'Unserializable context provided', rawType: typeof context }
    }

    await supabase.from('system_errors' as any).insert({
      error_message: message || 'Exceção não tratada capturada',
      error_stack: stack || null,
      context: safeContext,
      user_id,
    })
  } catch (e: any) {
    console.error('Falha crítica ao gravar log de sistema na base de dados', e.message)
  }
}
