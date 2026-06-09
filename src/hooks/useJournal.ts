import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { JournalEntry, Mode } from '../lib/supabase'

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const saveEntry = useCallback(async (content: string, mode: Mode) => {
    if (!content.trim()) return false
    setSaving(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ content: content.trim(), mode })
      .select()
      .single()
    setSaving(false)
    if (error || !data) return false
    setEntries(prev => [data, ...prev])
    return true
  }, [])

  return { entries, loading, saving, saveEntry, refetch: fetchEntries }
}
