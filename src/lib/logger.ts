import { supabase } from '@/lib/supabase/client'

export const logError = async (message: string, stack?: string, context?: any) => {
  console.error('Bug Scanner Log:', message, stack, context)
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const user_id = sessionData?.session?.user?.id || null

    await supabase.from('system_errors' as any).insert({
      error_message: message,
      error_stack: stack,
      context,
      user_id,
    })
  } catch (e) {
    console.error('Failed to log error to DB', e)
  }
}
