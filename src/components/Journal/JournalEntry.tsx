import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../../contexts/ModeContext'
import './JournalEntry.css'

interface Props {
  onSave: (content: string) => Promise<boolean>
  saving: boolean
}

export function JournalEntry({ onSave, saving }: Props) {
  const { mode } = useMode()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSave = async () => {
    if (!text.trim() || saving) return
    const ok = await onSave(text)
    if (ok) {
      setText('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave()
  }

  return (
    <motion.div
      className="journal-entry"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={`journal-entry__mode-badge mode--${mode}`}>
        {mode === 'down' ? '↓ calming' : '↑ energizing'}
      </div>

      <textarea
        ref={textareaRef}
        className="journal-entry__textarea"
        placeholder="What's present for you right now…"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={6}
      />

      <div className="journal-entry__footer">
        <span className="journal-entry__hint">⌘ + Enter to save</span>

        <button
          className={`btn btn-primary journal-entry__save ${saving ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving || !text.trim()}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </motion.div>
  )
}
