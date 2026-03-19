import { supabase } from '@/lib/supabase/client'

export async function uploadDocument(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from('tenant_documents').upload(fileName, file)

    if (error) {
      console.error('Upload error', error)
      return null
    }
    return data.path
  } catch (err) {
    console.error(err)
    return null
  }
}
