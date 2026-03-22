import { supabase } from '@/lib/supabase/client'

export const documentService = {
  async getTemplates(tenantId: string) {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .or(`tenant_id.eq.${tenantId},tenant_id.is.null`)
      .order('category')
      .order('name')
    if (error) throw error
    return data
  },
  async getDocuments(tenantId: string) {
    const { data, error } = await supabase
      .from('compliance_documents')
      .select('*, template:document_templates(name)')
      .eq('tenant_id', tenantId)
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data
  },
  async getDocument(docId: string) {
    const { data, error } = await supabase
      .from('compliance_documents')
      .select('*, template:document_templates(name)')
      .eq('id', docId)
      .single()
    if (error) throw error
    return data
  },
  async getVersions(docId: string) {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*, user:auth.users(email)')
      .eq('document_id', docId)
      .order('version_number', { ascending: false })
    if (error) throw error
    return data
  },
  async createDocument(payload: any) {
    const { data, error } = await supabase
      .from('compliance_documents')
      .insert([payload])
      .select()
      .single()
    if (error) throw error

    // Create first version automatically
    await supabase.from('document_versions').insert([
      {
        document_id: data.id,
        version_number: 1,
        content: payload.content,
        change_reason: 'Geração Inicial via IA',
      },
    ])

    return data
  },
  async updateDocument(docId: string, payload: any, changeReason?: string) {
    const { data: doc } = await supabase
      .from('compliance_documents')
      .select('version, content')
      .eq('id', docId)
      .single()

    let newVersion = doc?.version || 1
    if (changeReason && payload.content !== doc?.content) {
      newVersion += 1
      payload.version = newVersion

      await supabase.from('document_versions').insert([
        {
          document_id: docId,
          version_number: newVersion,
          content: payload.content,
          change_reason: changeReason,
        },
      ])
    }

    const { error } = await supabase
      .from('compliance_documents')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', docId)

    if (error) throw error
  },
}
