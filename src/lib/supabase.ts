import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Mode = 'down' | 'up'

export interface JournalEntry {
  id: string
  content: string
  mode: Mode
  created_at: string
}

export type GalleryItemType = 'random' | 'sport' | 'film' | 'tv' | 'music' | 'people'

export interface GalleryItem {
  id: string
  url: string
  title?: string
  type: GalleryItemType
  context_name?: string
  mode_preference: 'down' | 'up' | 'both'
  created_at: string
}

export interface Quote {
  id: string
  text: string
  author?: string
  mode: 'down' | 'up' | 'both'
  created_at: string
}

export type FilmItemType = 'still' | 'poster'

export interface FilmItem {
  id: string
  url: string
  name: string
  type: FilmItemType
  mode_preference: 'down' | 'up' | 'both'
  created_at: string
}

export interface AudioResource {
  id: string
  title: string
  url?: string
  description?: string
  type: 'playlist' | 'score' | 'ambient' | 'album'
  mode: 'down' | 'up' | 'both'
  created_at: string
}
