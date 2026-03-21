import { supabase } from '@/lib/supabase/client'

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadDocument(
  file: File,
  tenantId: string,
): Promise<{ path: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''

    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return {
        path: null,
        error: 'Formato de arquivo não suportado. Apenas PDF, DOCX e Imagens.',
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { path: null, error: 'Arquivo excede o tamanho máximo de 10MB.' }
    }

    const fileName = `${tenantId}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from('tenant_documents').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      console.error('Upload error', error)
      return { path: null, error: error.message }
    }
    return { path: data.path, error: null }
  } catch (err: any) {
    console.error(err)
    return { path: null, error: err.message || 'Erro interno ao realizar upload.' }
  }
}

export async function getDocumentUrl(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('tenant_documents')
      .createSignedUrl(path, 60 * 60) // 1 hora de validade
    if (error) {
      console.error('Error generating signed URL', error)
      return null
    }
    return data?.signedUrl || null
  } catch (error) {
    console.error('Unexpected error generating signed URL', error)
    return null
  }
}
