import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Quote, Mode } from '../lib/supabase'

export function useQuotes(mode: Mode) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('quotes')
      .select('*')
      .in('mode', [mode, 'both'])
    if (data) setQuotes(data)
    setLoading(false)
  }, [mode])

  useEffect(() => { fetchQuotes() }, [fetchQuotes])

  return { quotes, loading }
}

export function useAudioResources(mode: Mode) {
  const [resources, setResources] = useState<import('../lib/supabase').AudioResource[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('audio_resources')
      .select('*')
      .in('mode', [mode, 'both'])
      .order('created_at', { ascending: false })
    if (data) setResources(data)
    setLoading(false)
  }, [mode])

  useEffect(() => { fetchResources() }, [fetchResources])

  return { resources, loading }
}
