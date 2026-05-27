'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { LoaderCircle, X } from 'lucide-react'
import {
  resetPasswordRequestSchema,
  signInSchema,
  signUpSchema,
  STRONG_PASSWORD_MIN_LENGTH,
} from '@/features/auth'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

type AuthMode = 'login' | 'register' | 'reset'
type OAuthProvider = 'google' | 'facebook'
type FieldErrors = Partial<Record<'email' | 'password', string>>

function safePostAuthPath(): string {
  const params = new URLSearchParams(
    typeof window === 'undefined' ? '' : window.location.search,
  )
  const next = params.get('next')
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) {
    return next
  }
  return '/dashboard'
}

function extractMessage(value: unknown, fallback: string): string {
  if (value instanceof Error && value.message.trim()) {
    return value.message
  }
  return typeof value === 'string' && value.trim() ? value : fallback
}

function providerLabel(provider: OAuthProvider): string {
  return provider === 'google' ? 'Google' : 'Facebook'
}

function getOAuthErrorMessage(provider: OAuthProvider, message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('provider') && lower.includes('not enabled')) {
    return `${providerLabel(provider)} indisponível no momento.`
  }
  return message
}

function mapFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): FieldErrors {
  return {
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  }
}

function AuthTab({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative px-2 pb-3 text-[17px] font-bold transition-colors duration-200',
        active ? 'text-[#2b2520]' : 'text-[#958b7d] hover:text-[#5a524a]',
      ].join(' ')}
      aria-pressed={active}
    >
      {children}
      <span
        aria-hidden
        className={[
          'absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-200',
          active ? 'bg-[#2b2520] opacity-100' : 'bg-transparent opacity-0',
        ].join(' ')}
      />
    </button>
  )
}

function PremiumField({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
  minLength,
}: {
  id: string
  label: string
  type: string
  autoComplete?: string
  placeholder: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  minLength?: number
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-bold text-[#2b2520]" style={{ marginBottom: '12px' }}>
        {label}
      </span>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        minLength={minLength}
        style={{ paddingLeft: '16px', paddingRight: '16px' }}
        className={[
          'h-10 w-full rounded-[4px] border bg-black/5 text-sm text-ink outline-none transition-all duration-200',
          'placeholder:text-[#9e9486] focus:border-[#807463] focus:bg-white/20',
          error ? 'border-red-600' : 'border-[#c4b9a9]',
        ].join(' ')}
      />
      {error ? (
        <span id={errorId} className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  )
}

function SocialButton({
  provider,
  mode,
  loading,
  onClick,
}: {
  provider: OAuthProvider
  mode: Exclude<AuthMode, 'reset'>
  loading: boolean
  onClick: () => void
}) {
  const label = providerLabel(provider)
  const verb = mode === 'login' ? 'Entrar' : 'Cadastrar'
  const tone =
    provider === 'facebook'
      ? 'bg-[#c59664] hover:bg-[#b08557]'
      : 'bg-[#a86545] hover:bg-[#92563a]'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{ borderRadius: '20px' }}
      className={[
        'relative flex h-12 w-full items-center justify-center rounded-[12px] px-4 text-sm font-bold text-white transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-60',
        tone,
      ].join(' ')}
    >
      <span className="absolute left-4 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/50 text-[11px] font-bold uppercase">
        {provider === 'google' ? 'G' : 'f'}
      </span>
      <span>{`${verb} com ${label}`}</span>
    </button>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [mode, setMode] = useState<AuthMode>(() => {
    if (typeof window === 'undefined') return 'login'
    const p = new URLSearchParams(window.location.search).get('mode')
    return p === 'register' || p === 'reset' ? p : 'login'
  })
  const modeResetTimeoutRef = useRef<number | null>(null)
  const supabase = useMemo(() => createBrowserClient(), [])

  const authCallbackUrl = (nextPath: string) => {
    if (typeof window === 'undefined') return ''
    const next = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
  }

  const postAuthPath = useMemo(() => {
    if (typeof window === 'undefined') return '/dashboard'
    return safePostAuthPath()
  }, [])

  function clearFeedback() {
    setError('')
    setSuccess('')
    setFieldErrors({})
  }

  function clearModeResetTimeout() {
    if (!modeResetTimeoutRef.current) return
    window.clearTimeout(modeResetTimeoutRef.current)
    modeResetTimeoutRef.current = null
  }

  function switchMode(nextMode: AuthMode) {
    clearModeResetTimeout()
    clearFeedback()
    setMode(nextMode)
    if (nextMode === 'reset') {
      setPassword('')
    }
    if (nextMode !== 'register') {
      setMarketingConsent(false)
    }
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }))
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }))
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error')

    if (errorParam) {
      const oauthError = decodeURIComponent(errorParam).replaceAll('+', ' ')
      params.delete('error')

      const search = params.toString()
      window.history.replaceState(null, '', search ? `/login?${search}` : '/login')
      const timeout = window.setTimeout(() => setError(oauthError), 0)
      return () => {
        window.clearTimeout(timeout)
        clearModeResetTimeout()
      }
    }

    return clearModeResetTimeout
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const parsed =
      mode === 'login'
        ? signInSchema.safeParse({ email, password })
        : mode === 'register'
          ? signUpSchema.safeParse({ email, password })
          : resetPasswordRequestSchema.safeParse({ email })

    if (!parsed.success) {
      setFieldErrors(mapFieldErrors(parsed.error.flatten().fieldErrors))
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError('Email ou senha incorretos.')
          return
        }

        window.location.assign(postAuthPath)
        return
      }

      if (mode === 'reset') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: authCallbackUrl('/update-password'),
          },
        )

        if (resetError) {
          setError('Não foi possível enviar o link agora. Tente novamente.')
          return
        }

        setSuccess('Enviamos um link de recuperação para o seu e-mail.')
        clearModeResetTimeout()
        modeResetTimeoutRef.current = window.setTimeout(() => switchMode('login'), 2600)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: authCallbackUrl(postAuthPath),
          data: {
            marketing_consent: marketingConsent,
          },
        },
      })

      if (signUpError) {
        setError('Não foi possível criar a conta agora. Tente novamente.')
        return
      }

      if (data.session) {
        window.location.assign(postAuthPath)
        return
      }

      setSuccess('Conta criada. Confirme seu e-mail para concluir o acesso.')
      clearModeResetTimeout()
      modeResetTimeoutRef.current = window.setTimeout(() => switchMode('login'), 2800)
    } catch (caughtError) {
      setError(extractMessage(caughtError, 'Não foi possível concluir agora.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuth(provider: OAuthProvider) {
    clearFeedback()
    setLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: authCallbackUrl(postAuthPath),
        },
      })

      if (oauthError) {
        setError(getOAuthErrorMessage(provider, oauthError.message))
      }
    } catch (caughtError) {
      setError(extractMessage(caughtError, 'Falha ao iniciar autenticação social.'))
    } finally {
      setLoading(false)
    }
  }

  const isReset = mode === 'reset'
  const isRegister = mode === 'register'
  const ctaLabel = loading
    ? 'Aguarde...'
    : isReset
      ? 'Enviar link'
      : isRegister
        ? 'Juntar-se à Senda'
        : 'Entrar na Senda'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1d1713] text-ink">
      <NextImage
        aria-hidden
        src="/brand/photos/care.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,17,0.5)_0%,rgba(24,21,17,0.7)_100%)]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="relative w-full max-w-[440px]">
          <div className="relative mx-auto flex min-h-[600px] w-full max-w-[440px] flex-col justify-center rounded-[16px] bg-[#EAE5DB] px-8 py-12 shadow-[0_24px_90px_rgba(0,0,0,0.36)] sm:px-10 sm:py-14">
            <div className="absolute right-5 top-5">
              <Link
                href="/"
                aria-label="Fechar modal de autenticação"
                className="inline-flex h-8 w-8 items-center justify-center text-[#958b7d] transition-colors hover:text-[#2b2520]"
              >
                <X size={24} strokeWidth={2} />
              </Link>
            </div>

            <div className="mx-auto w-full max-w-[320px] self-center">
              <div className="flex items-center justify-center gap-10" style={{ marginTop: '-1px', marginBottom: '20px' }}>
                <AuthTab active={mode === 'login'} onClick={() => switchMode('login')}>
                  Entrar
                </AuthTab>
                <AuthTab
                  active={mode === 'register'}
                  onClick={() => switchMode('register')}
                >
                  Cadastrar
                </AuthTab>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <PremiumField
                  id="auth-email"
                  label="E-mail"
                  type="email"
                  autoComplete="email"
                  placeholder="Endereço de e-mail"
                  value={email}
                  onChange={handleEmailChange}
                  error={fieldErrors.email}
                />

                {!isReset ? (
                  <PremiumField
                    id="auth-password"
                    label="Senha"
                    type="password"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    placeholder={
                      isRegister
                        ? `Senha (mín. ${STRONG_PASSWORD_MIN_LENGTH} caracteres)`
                        : 'Sua senha'
                    }
                    value={password}
                    onChange={handlePasswordChange}
                    error={fieldErrors.password}
                    minLength={isRegister ? STRONG_PASSWORD_MIN_LENGTH : undefined}
                  />
                ) : null}

                {isRegister ? (
                  <label className="flex items-center gap-2 pt-1 text-xs font-medium text-[#4a423b]">
                    <input
                      type="checkbox"
                      aria-label="Concordo em receber conteÃºdos e novidades da Senda SÃªnior"
                      checked={marketingConsent}
                      onChange={(event) => setMarketingConsent(event.target.checked)}
                      className="h-4 w-4 rounded-[3px] border border-[#b7ab9b] bg-transparent text-ink focus:ring-0"
                    />
                    <span>Concordo em receber conteúdos e novidades da Senda Sênior por e-mail.</span>
                  </label>
                ) : null}

                {mode === 'login' ? (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-xs font-bold text-terracotta transition-colors hover:text-terracotta-dark"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                ) : null}

                {mode === 'reset' ? (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-xs font-bold text-terracotta transition-colors hover:text-terracotta-dark"
                    >
                      Voltar para entrar
                    </button>
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[8px] border border-[#e7b0b0] bg-[#fff3f1] px-4 py-3 text-xs font-medium text-[#8a2e2e]">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-[8px] border border-[#c8d4c0] bg-[#eef3eb] px-4 py-3 text-xs font-medium text-green-dark">
                    {success}
                  </div>
                ) : null}

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  style={{ borderRadius: '20px' }}
                  className={[
                    'mt-4 flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2a2420] px-4 text-[15px] font-bold text-white transition-all duration-200',
                    'hover:bg-[#1a1613] disabled:cursor-not-allowed disabled:opacity-60',
                  ].join(' ')}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle size={16} className="animate-spin" />
                      <span>{ctaLabel}</span>
                    </span>
                  ) : (
                    ctaLabel
                  )}
                </button>
              </form>

              {!isReset ? (
                <>
                  <div className="my-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#8f8375]">
                    <span className="h-[1px] flex-1 bg-[#d2c9bc]" />
                    <span>ou</span>
                    <span className="h-[1px] flex-1 bg-[#d2c9bc]" />
                  </div>

                  <div className="flex flex-col gap-6">
                    <SocialButton
                      provider="google"
                      mode={mode}
                      loading={loading}
                      onClick={() => handleOAuth('google')}
                    />
                    <SocialButton
                      provider="facebook"
                      mode={mode}
                      loading={loading}
                      onClick={() => handleOAuth('facebook')}
                    />
                  </div>
                </>
              ) : null}

              <p className="text-center text-xs leading-relaxed text-[#7f7468]" style={{ marginTop: '30px' }}>
                Ao prosseguir, você estará concordando com os
                <br />
                <span className="font-bold text-[#2a2420]">
                  <Link
                    href="/termos-de-servico"
                    className="underline underline-offset-2 transition-colors hover:text-[#a86545]"
                  >
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    href="/politica-de-privacidade"
                    className="underline underline-offset-2 transition-colors hover:text-[#a86545]"
                  >
                    Política de Privacidade
                  </Link>{' '}
                  da Senda Sênior.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
