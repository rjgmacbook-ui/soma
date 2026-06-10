import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { FilmItem, Mode } from '../lib/supabase'

export function useFilm(mode: Mode) {
  const [items, setItems] = useState<FilmItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('film_items')
      .select('*')
      .in('mode_preference', [mode, 'both'])
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }, [mode])

  useEffect(() => { fetchItems() }, [fetchItems])

  return { items, loading }
}
