/**
 * Checklist.tsx
 * Checklist Prevent Care com persistência otimista — mostra itens com progresso visual e toggle interativo.
 *
 * Conecta: importa toggleChecklistItem (actions), ChecklistItem (types) | importado por DashboardView
 * Camada: browser
 */

'use client'

import { useOptimistic, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import { toggleChecklistItem } from '@/features/dashboard/actions'
import type { ChecklistItem } from '@/features/dashboard/types'

interface ChecklistProps {
  initialItems: ChecklistItem[]
}

/**
 * Checklist Prevent Care com persistência otimista:
 *   - UI atualiza imediatamente via `useOptimistic`.
 *   - `toggleChecklistItem` (Server Action) grava no Supabase.
 *   - Em caso de erro, o `revalidatePath('/dashboard')` da action
 *     reconcilia o estado real.
 */
export function Checklist({ initialItems }: ChecklistProps) {
  const [optimisticItems, applyOptimistic] = useOptimistic(
    initialItems,
    (current, update: { key: string; done: boolean }) =>
      current.map((item) =>
        item.key === update.key ? { ...item, done: update.done } : item,
      ),
  )
  const [, startTransition] = useTransition()

  const sortedItems = [...optimisticItems].sort((a, b) => {
    if (a.done === b.done) return 0
    return a.done ? 1 : -1
  })

  const total = optimisticItems.length
  const doneCount = optimisticItems.filter((i) => i.done).length
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  function handleToggle(item: ChecklistItem) {
    const next = !item.done
    startTransition(async () => {
      applyOptimistic({ key: item.key, done: next })
      await toggleChecklistItem({ key: item.key, done: next })
    })
  }

  return (
    <div style={{
      background: 'var(--color-cream)', padding: 32, borderRadius: 16,
      border: '1px solid rgba(45,95,79,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', height: '100%', minHeight: 480,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)' }}>
          Checklist Prevent Care
        </h3>
        <span style={{ fontSize: 14.95, fontWeight: 700, color: 'var(--color-green)', background: 'var(--color-green-muted)', padding: '6px 12px', borderRadius: 20 }}>
          {progress}% Prontidão
        </span>
      </div>

      <div style={{ background: 'var(--color-cream-mid)', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 32 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, type: 'spring', damping: 20 }}
          style={{ background: 'var(--color-terracotta)', height: '100%', borderRadius: 3 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <AnimatePresence initial={false}>
          {sortedItems.map((item) => (
            <motion.div
              layout
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: item.done ? 0.45 : 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                background: item.done ? 'var(--color-cream)' : 'white', borderRadius: 12,
                border: '1px solid', borderColor: item.done ? 'transparent' : 'rgba(0,0,0,0.05)',
                cursor: 'pointer', boxShadow: item.done ? 'none' : '0 2px 8px rgba(0,0,0,0.02)',
              }}
              onClick={() => handleToggle(item)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{
                minWidth: 24, height: 24, borderRadius: 6, border: '2px solid',
                borderColor: item.done ? 'var(--color-terracotta)' : 'var(--color-green-light)',
                background: item.done ? 'var(--color-terracotta)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <AnimatePresence>
                  {item.done && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={14} color="white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span style={{
                 fontSize: 17.25, fontWeight: item.done ? 400 : 500, color: 'var(--color-ink)',
                 textDecoration: item.done ? 'line-through' : 'none', transition: 'all 0.3s',
              }}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {progress === 100 && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, padding: '16px 20px', background: 'var(--color-green-muted)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Info size={20} color="var(--color-green)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 14.95, color: 'var(--color-green-dark)', fontWeight: 600 }}>Caminho livre! Você tirou a carga da preocupação dos ombros.</p>
         </motion.div>
      )}
    </div>
  )
}
