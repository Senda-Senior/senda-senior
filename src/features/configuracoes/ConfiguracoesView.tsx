/**
 * ConfiguracoesView.tsx
 * Tela de Configurações (Conta & Segurança) — nome, email, senha e sessão.
 *
 * Conecta: updateProfileNameAction (server) | supabase browser client (email/senha) | signOutAction (dashboard)
 * Camada: browser (use client)
 */

'use client'

import { useMemo, useState, useTransition, type ReactNode } from 'react'
import { User as UserIcon, Mail, KeyRound, LogOut, Check, AlertTriangle } from 'lucide-react'
import { Button, Field } from '@/design'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { STRONG_PASSWORD_MIN_LENGTH, updatePasswordSchema } from '@/features/auth/schemas'
import { signOutAction } from '@/features/dashboard/actions'
import { deleteAccountAction, updateProfileNameAction } from './actions'
import { DELETE_ACCOUNT_CONFIRMATION } from './constants'

interface Props {
  initialDisplayName: string
  email: string
}

export function ConfiguracoesView({ initialDisplayName, email }: Props) {
  return (
    <div className="px-5 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[680px] space-y-5">
        <NameSection initialDisplayName={initialDisplayName} />
        <EmailSection currentEmail={email} />
        <PasswordSection />
        <SessionSection />
        <DangerZoneSection />
      </div>
    </div>
  )
}

/* ─── Nome ─────────────────────────────────────────────────────── */

function NameSection({ initialDisplayName }: { initialDisplayName: string }) {
  const [name, setName] = useState(initialDisplayName)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isPending, startTransition] = useTransition()

  const dirty = name.trim() !== initialDisplayName.trim()

  function handleSave() {
    setFeedback(null)
    const trimmed = name.trim()
    if (trimmed.length === 0) {
      setFeedback({ type: 'error', text: 'O nome não pode ficar vazio.' })
      return
    }
    startTransition(async () => {
      const result = await updateProfileNameAction(trimmed)
      if (result.ok) {
        setFeedback({ type: 'success', text: 'Nome atualizado.' })
      } else {
        setFeedback({ type: 'error', text: result.error })
      }
    })
  }

  return (
    <SettingsCard
      icon={<UserIcon size={18} strokeWidth={1.7} />}
      eyebrow="Perfil"
      title="Nome de exibição"
      description="É como você aparece no painel e no cabeçalho."
    >
      <Field
        id="config-name"
        name="display-name"
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={255}
        autoComplete="name"
      />
      <FeedbackLine feedback={feedback} />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={isPending || !dirty}>
          {isPending ? 'Salvando...' : 'Salvar nome'}
        </Button>
      </div>
    </SettingsCard>
  )
}

/* ─── Email ────────────────────────────────────────────────────── */

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const supabase = useMemo(() => createBrowserClient(), [])
  const [editing, setEditing] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setFeedback(null)
    const trimmed = newEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFeedback({ type: 'error', text: 'Email inválido.' })
      return
    }
    if (trimmed === currentEmail.toLowerCase()) {
      setFeedback({ type: 'error', text: 'Este já é o seu email atual.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ email: trimmed })
    setLoading(false)
    if (error) {
      setFeedback({ type: 'error', text: 'Não foi possível alterar o email agora.' })
      return
    }
    setFeedback({
      type: 'success',
      text: 'Enviamos um link de confirmação para o novo email. A troca só vale após confirmar.',
    })
    setEditing(false)
    setNewEmail('')
  }

  return (
    <SettingsCard
      icon={<Mail size={18} strokeWidth={1.7} />}
      eyebrow="Conta"
      title="Email"
      description="Usado para login e recuperação de acesso."
    >
      <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[rgba(45,95,79,0.04)] px-4 py-3">
        <span className="truncate font-sans text-[14px] font-medium text-[var(--color-ink-sub)]">
          {currentEmail}
        </span>
        {!editing && (
          <button
            onClick={() => { setEditing(true); setFeedback(null) }}
            className="flex-shrink-0 font-sans text-[13px] font-semibold text-[var(--color-terracotta)] hover:underline"
          >
            Alterar
          </button>
        )}
      </div>

      {editing && (
        <>
          <Field
            id="config-email"
            name="new-email"
            type="email"
            label="Novo email"
            placeholder="voce@exemplo.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setEditing(false); setNewEmail(''); setFeedback(null) }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Enviando...' : 'Confirmar troca'}
            </Button>
          </div>
        </>
      )}
      <FeedbackLine feedback={feedback} />
    </SettingsCard>
  )
}

/* ─── Senha ────────────────────────────────────────────────────── */

function PasswordSection() {
  const supabase = useMemo(() => createBrowserClient(), [])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [loading, setLoading] = useState(false)

  const checks = [
    { label: `Mínimo ${STRONG_PASSWORD_MIN_LENGTH} caracteres`, passed: password.length >= STRONG_PASSWORD_MIN_LENGTH },
    { label: 'Uma letra maiúscula', passed: /[A-Z]/.test(password) },
    { label: 'Uma letra minúscula', passed: /[a-z]/.test(password) },
    { label: 'Um número', passed: /[0-9]/.test(password) },
    { label: 'Um símbolo', passed: /[^A-Za-z0-9\s]/.test(password) },
    { label: 'Sem espaços', passed: password.length > 0 && !/\s/.test(password) },
  ]
  const show = password.length > 0 || confirm.length > 0
  const match = confirm.length > 0 && password === confirm

  async function handleSubmit() {
    setFeedback(null)
    const parsed = updatePasswordSchema.safeParse({ password, confirm })
    if (!parsed.success) {
      setFeedback({ type: 'error', text: parsed.error.issues[0]?.message ?? 'Dados inválidos.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setFeedback({ type: 'error', text: 'Não foi possível atualizar a senha. Tente novamente.' })
      return
    }
    setFeedback({ type: 'success', text: 'Senha atualizada com sucesso.' })
    setPassword('')
    setConfirm('')
  }

  return (
    <SettingsCard
      icon={<KeyRound size={18} strokeWidth={1.7} />}
      eyebrow="Segurança"
      title="Senha"
      description="Escolha uma senha forte e única."
    >
      <Field
        id="config-password"
        name="new-password"
        type="password"
        label="Nova senha"
        placeholder={`Mínimo ${STRONG_PASSWORD_MIN_LENGTH} caracteres`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <Field
        id="config-password-confirm"
        name="confirm-password"
        type="password"
        label="Confirmar nova senha"
        placeholder="Repita a senha"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
      />

      {show && (
        <ul className="space-y-1 rounded-[10px] bg-[rgba(45,95,79,0.04)] px-4 py-3 font-sans text-[13px] leading-[1.5]">
          {checks.map((c) => (
            <li key={c.label} className={c.passed ? 'text-[var(--color-green)]' : 'text-[var(--color-ink-muted)]'}>
              {c.passed ? '✓' : '•'} {c.label}
            </li>
          ))}
          <li className={match ? 'text-[var(--color-green)]' : 'text-[var(--color-ink-muted)]'}>
            {match ? '✓' : '•'} As duas senhas precisam coincidir
          </li>
        </ul>
      )}
      <FeedbackLine feedback={feedback} />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar senha'}
        </Button>
      </div>
    </SettingsCard>
  )
}

/* ─── Sessão ───────────────────────────────────────────────────── */

function SessionSection() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try { await signOutAction() } catch { setLoading(false) }
  }

  return (
    <SettingsCard
      icon={<LogOut size={18} strokeWidth={1.7} />}
      eyebrow="Sessão"
      title="Encerrar sessão"
      description="Você sairá em todos os dispositivos conectados."
    >
      <div className="flex justify-end">
        <Button size="sm" variant="danger" onClick={handleLogout} disabled={loading}>
          {loading ? 'Saindo...' : 'Sair da conta'}
        </Button>
      </div>
    </SettingsCard>
  )
}

/* ─── Zona de perigo (excluir conta) ───────────────────────────── */

function DangerZoneSection() {
  const [confirmText, setConfirmText] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isPending, startTransition] = useTransition()

  const canDelete = confirmText.trim().toUpperCase() === DELETE_ACCOUNT_CONFIRMATION

  function handleDelete() {
    if (!canDelete) return
    setFeedback(null)
    startTransition(async () => {
      // Em sucesso a action redireciona no servidor (não retorna). Só chega aqui em erro.
      const result = await deleteAccountAction(confirmText)
      if (result && !result.ok) {
        setFeedback({ type: 'error', text: result.error })
      }
    })
  }

  return (
    <section className="rounded-[18px] border border-[#F3C0C0] bg-[#FEF6F5] p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-[#FBE3E1] text-[#B91C1C]">
          <AlertTriangle size={18} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#B91C1C]">
            Zona de perigo
          </p>
          <h2 className="font-serif text-[18px] font-semibold leading-[1.2] text-[var(--color-ink)]">
            Excluir conta
          </h2>
          <p className="mt-0.5 font-sans text-[13px] leading-[1.5] text-[var(--color-ink-sub)]">
            Apaga permanentemente sua conta, perfil, documentos do cofre e todo o histórico.
            Esta ação não pode ser desfeita.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Field
          id="config-delete-confirm"
          name="delete-confirm"
          label={`Para confirmar, digite ${DELETE_ACCOUNT_CONFIRMATION}`}
          placeholder={DELETE_ACCOUNT_CONFIRMATION}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          autoComplete="off"
        />
        <FeedbackLine feedback={feedback} />
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            disabled={!canDelete || isPending}
          >
            {isPending ? 'Excluindo...' : 'Excluir minha conta'}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Primitivos locais ────────────────────────────────────────── */

type Feedback = { type: 'success' | 'error'; text: string } | null

function SettingsCard({
  icon, eyebrow, title, description, children,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-green-muted)] text-[var(--color-green)]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
            {eyebrow}
          </p>
          <h2 className="font-serif text-[18px] font-semibold leading-[1.2] text-[var(--color-ink)]">
            {title}
          </h2>
          <p className="mt-0.5 font-sans text-[13px] leading-[1.5] text-[var(--color-ink-sub)]">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function FeedbackLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  if (feedback.type === 'success') {
    return (
      <p className="flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-[var(--color-green)]">
        <Check size={15} strokeWidth={2.2} />
        {feedback.text}
      </p>
    )
  }
  return (
    <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5 font-sans text-[13.5px] leading-[1.5] text-[#B91C1C]">
      {feedback.text}
    </p>
  )
}
