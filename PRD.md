# Product Requirements Document
## Somatic Regulation Web App

**Version:** 1.0  
**Date:** 2026-06-09  
**Status:** Draft

---

## 1. Overview

A personal, single-user web application designed as a somatic regulation tool — a beautiful, calm digital space to return to when the nervous system is dysregulated. The app supports two directions of regulation:

- **Down-Regulating** — for moments of overwhelm, anxiety, or hyper-arousal
- **Up-Regulating** — for moments of shutdown, numbness, or hypo-arousal

---

## 2. Goals

- Provide an immediately accessible, visually calming interface that itself promotes regulation
- Give the user multiple modalities to self-regulate: breath, visual, audio, writing, reading
- Persist personal content (journal entries, custom resources) across sessions via Supabase
- Work smoothly on mobile (primary use case) and desktop

---

## 3. Non-Goals

- Multi-user / authentication system (single personal user, no login required)
- Real-time collaboration or social features
- Guided meditation audio playback (links to external resources only, no in-app player in v1)
- AI-generated content

---

## 4. Users

Single user: the app owner. No sign-up, no accounts. Data stored in a private Supabase instance with open anon policies.

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Animation | Framer Motion + CSS keyframes |
| Database | Supabase (Postgres) |
| Styling | CSS custom properties (no CSS-in-JS) |
| Hosting | (User's choice — Vercel / Netlify recommended) |

---

## 6. Design Principles

1. **Minimalist** — card-based layout, intentional whitespace, no visual noise
2. **Mode-aware** — every visual element responds to the current regulation mode
3. **Mobile-first** — designed for a phone in a moment of distress
4. **Calming by default** — no jarring animations, no harsh colors, no busy layouts
5. **Accessible** — sufficient contrast ratios, readable type sizes, clear touch targets

---

## 7. Color Themes

### Down-Regulating — Forest Floor

| Token | Value |
|-------|-------|
| Background | `#111a14` |
| Card surface | `#1c2b1e` |
| Accent | `#7ab08a` |
| Body text | `#cddfc5` |
| Highlight | `#a8c4a0` |
| Muted text | `#6a8870` |

### Up-Regulating — Golden Hour

| Token | Value |
|-------|-------|
| Background | `#1a1208` |
| Card surface | `#2a1e0e` |
| Accent | `#e8a030` |
| Body text | `#f0e0c0` |
| Highlight | `#d06820` |
| Muted text | `#a87830` |

Themes applied via `data-mode="down" | "up"` on `<html>`, cascading through CSS custom properties.

---

## 8. Modes

### Mode Toggle
- Persistent pill toggle, always accessible (top-right desktop / bottom-center mobile)
- State persisted to `localStorage` and synced to `user_preferences` in Supabase
- Switching mode transitions the entire visual system smoothly (600ms / 300ms)

### Behavioral Differences by Mode

| Aspect | Down-Regulating | Up-Regulating |
|--------|----------------|---------------|
| Animation speed | Slow (4–8s) | Medium (1.5–3s) |
| Card gap | 32px | 20px |
| Default breathing technique | 4-7-8 | Box (4-4-4-4) |
| Prominent page | Breathing, Gallery | Journal, Audio |
| Card hover scale | 1.02 | 1.04 |
| Transition duration | 600ms | 300ms |

---

## 9. Pages & Features

### 9.1 Home
- Featured quote (rotates every 20s, filtered by current mode)
- Mode toggle (most prominent element)
- Quick-access cards linking to each section
- Minimal, spacious layout — first thing seen on open

### 9.2 Gallery
- Masonry grid (desktop) / single column (mobile)
- Content types: wallpapers, album art, movie posters, sport photos, athlete images
- Items stored in Supabase `gallery_items`, filtered by `mode_preference`
- Click/tap opens full-screen lightbox
- Placeholder gradient cards when gallery is empty

### 9.3 Breathing Techniques
- Central animated breathing circle (SVG, CSS keyframes)
- Three techniques available:
  - **4-7-8** — Inhale 4s, Hold 7s, Exhale 8s (default down-reg)
  - **Box Breathing** — Inhale 4s, Hold 4s, Exhale 4s, Hold 4s (default up-reg)
  - **Physiological Sigh** — Double inhale + long exhale
- Text cues overlay synced to animation phase
- Technique selector (tap to switch)

### 9.4 Journal
- Full-page textarea, auto-focused on load
- "Save" button submits entry to Supabase with timestamp + current mode tag
- Previous entries displayed below in reverse chronological order
- Entries are private, never deleted automatically
- Mode tag shown as a small pill on each entry

### 9.5 Resources (Audio)
- Curated list of external links: playlists, movie scores, ambient music, albums
- Cards show title, type icon, and short description
- Filtered or visually differentiated by mode
- Placeholder "add resource" cards for future expansion

### 9.6 Placeholder / Flexible Cards
- Empty content cards on any page that invite the user to add future content types
- Visually match the design system with a soft "+" affordance

---

## 10. Navigation

- **Mobile**: Fixed bottom navigation bar with 5 icon tabs (Home, Gallery, Breathing, Journal, Resources)
- **Desktop**: Left sidebar or top nav with text labels + icons
- Active state clearly indicated
- No page reload — client-side routing throughout

---

## 11. Data Model (Supabase)

### `journal_entries`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| content | text | Required |
| mode | text | `'down'` or `'up'` |
| created_at | timestamptz | Auto |

### `gallery_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| url | text | Image URL |
| title | text | Optional |
| type | text | `'wallpaper'`, `'album'`, `'poster'`, `'sport'`, `'athlete'` |
| mode_preference | text | `'down'`, `'up'`, `'both'` |
| created_at | timestamptz | Auto |

### `quotes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| text | text | Required |
| author | text | Optional |
| mode | text | `'down'`, `'up'`, `'both'` |
| created_at | timestamptz | Auto |

### `audio_resources`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | Required |
| url | text | External link |
| description | text | Optional |
| type | text | `'playlist'`, `'score'`, `'ambient'`, `'album'` |
| mode | text | `'down'`, `'up'`, `'both'` |
| created_at | timestamptz | Auto |

### `user_preferences`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Single row |
| current_mode | text | `'down'` (default) |
| updated_at | timestamptz | Auto |

---

## 12. Animations

| Name | Description | Duration |
|------|-------------|----------|
| `breathe` | Breathing circle expand/contract | 8s (down) / 4s (up) |
| `float` | Gentle vertical float on cards | 6s loop |
| `fade-in` | Page/card entrance | 400ms |
| `quote-fade` | Quote crossfade | 1s |
| Page transitions | Framer Motion AnimatePresence | 300ms |
| Card hover | Scale transform | 200ms ease |

---

## 13. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px (mobile) | Single column, bottom nav, full-width cards |
| 640–1024px (tablet) | 2-column grid, bottom nav |
| > 1024px (desktop) | 3-column masonry, side/top nav, wider cards |

---

## 14. Implementation Order (MVP)

1. Scaffold Vite + React + TypeScript project
2. Create Supabase project, run schema SQL
3. Global CSS (custom properties, reset, fonts, both mode classes)
4. `ModeContext` + `ModeToggle` component
5. `AppShell` + navigation (mobile bottom bar + desktop nav)
6. Home page
7. Breathing page
8. Gallery page + lightbox
9. Journal page (Supabase read/write)
10. Resources page
11. Seed data (quotes, gallery items, audio resources)
12. Polish: page transitions, hover states, mobile QA

---

## 15. Success Criteria

- [ ] Mode toggle transitions the full visual theme without flicker
- [ ] Journal entries persist and display across page refreshes
- [ ] Breathing animation is smooth and synced to text cues
- [ ] Gallery renders responsively; lightbox opens/closes cleanly
- [ ] App is usable one-handed on a phone screen
- [ ] No jarring animations — every motion feels intentional and calming
- [ ] Pages load without layout shift

---

## 16. Bugs & Enhancements

### Bugs
[x] The icon and title. Make sure they are center aligned. Right now it looks like the title is at bottom.
[x] The icon, title, the main section heading and the calm/energize switch are all not properly aligned. Make sure there is uniformity.

### Enhancements
<!-- Add enhancements here -->

