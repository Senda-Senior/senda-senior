'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { AuthBrandPanel, AuthFormPanel } from '@/features/auth'
import {
  STRONG_PASSWORD_MIN_LENGTH,
  updatePasswordSchema,
} from '@/features/auth/schemas'
import { Button, Field } from '@/design'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const redirectTimeoutRef = useRef<number | null>(null)
  const supabase = useMemo(() => createBrowserClient(), [])
  const passwordChecks = [
    {
      label: `Pelo menos ${STRONG_PASSWORD_MIN_LENGTH} caracteres`,
      passed: password.length >= STRONG_PASSWORD_MIN_LENGTH,
    },
    {
      label: 'Uma letra maiúscula',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Uma letra minúscula',
      passed: /[a-z]/.test(password),
    },
    {
      label: 'Um número',
      passed: /[0-9]/.test(password),
    },
    {
      label: 'Um símbolo',
      passed: /[^A-Za-z0-9\s]/.test(password),
    },
    {
      label: 'Sem espaços',
      passed: !/\s/.test(password) && password.length > 0,
    },
  ]
  const showPasswordChecklist = password.length > 0 || confirm.length > 0
  const passwordsMatch = confirm.length > 0 && password === confirm

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const parsed = updatePasswordSchema.safeParse({ password, confirm })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError('Não foi possível atualizar a senha. Tente novamente.')
      setLoading(false)
    } else {
      setSuccess(true)
      redirectTimeoutRef.current = window.setTimeout(() => {
        window.location.assign('/dashboard')
      }, 2000)
    }
  }

  return (
    <div className="auth-wrapper flex min-h-screen bg-cream">
      <AuthBrandPanel
        photoSrc="/brand/card-elder-window.png"
        objectPosition="28% 38%"
      >
        <Link href="/" className="mb-12 inline-block no-underline">
          <NextImage
            src="/brand/logo-14.png"
            alt="Senda Sênior"
            width={280}
            height={98}
            priority
            className="h-11 w-auto object-contain [filter:brightness(0)_invert(1)]"
          />
        </Link>

        <h2 className="mb-6 font-serif text-[clamp(32px,3.5vw,48px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
          Sua segurança
          <br />
          é prioridade.
        </h2>
        <p className="max-w-[340px] text-base leading-[1.7] text-white/70">
          Use uma senha forte e única com pelo menos {STRONG_PASSWORD_MIN_LENGTH}
          {' '}caracteres, combinando letras, números e símbolos.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          {[
            {
              icon: <Lock size={16} strokeWidth={1.8} />,
              text: 'Criptografia ponta a ponta',
            },
            {
              icon: <ShieldCheck size={16} strokeWidth={1.8} />,
              text: 'Conformidade com LGPD',
            },
            {
              icon: <KeyRound size={16} strokeWidth={1.8} />,
              text: 'Seus dados, suas regras',
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 rounded-[10px] border border-white/8 bg-white/8 px-4 py-3"
            >
              <span className="text-base text-white/55">{item.icon}</span>
              <span className="text-[15px] font-medium text-white/80">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </AuthBrandPanel>

      <AuthFormPanel>
        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-muted text-green-dark">
              <CheckCircle size={28} strokeWidth={2} />
            </div>
            <h1 className="mb-3 font-serif text-[28px] font-semibold text-ink">
              Senha atualizada!
            </h1>
            <p className="text-[15px] leading-[1.6] text-terracotta-light">
              Redirecionando para o painel...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-green-muted text-green-dark">
              <KeyRound size={24} strokeWidth={1.5} />
            </div>
            <h1 className="mb-2 font-serif text-[clamp(28px,3vw,38px)] font-semibold tracking-[-0.02em] text-ink">
              Nova senha
            </h1>
            <p className="mb-10 text-base font-medium leading-[1.6] text-terracotta-light">
              Escolha uma senha forte com {STRONG_PASSWORD_MIN_LENGTH}+ caracteres,
              letras maiúsculas e minúsculas, número e símbolo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                placeholder={`Mínimo ${STRONG_PASSWORD_MIN_LENGTH} caracteres`}
                label="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={STRONG_PASSWORD_MIN_LENGTH}
              />

              <Field
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Repita a senha"
                label="Confirmar senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={STRONG_PASSWORD_MIN_LENGTH}
                className="mb-2"
              />

              {showPasswordChecklist && (
                <div className="rounded-[10px] border border-terracotta-light/20 bg-cream/70 px-4 py-3">
                  <p className="mb-2 text-[14px] font-semibold text-ink">
                    Sua senha precisa ter:
                  </p>
                  <ul className="space-y-1 text-[14px] leading-[1.5] text-terracotta-light">
                    {passwordChecks.map((item) => (
                      <li
                        key={item.label}
                        className={item.passed ? 'text-green-dark' : 'text-terracotta-light'}
                      >
                        {item.passed ? 'OK' : '•'} {item.label}
                      </li>
                    ))}
                    <li className={passwordsMatch ? 'text-green-dark' : 'text-terracotta-light'}>
                      {passwordsMatch ? 'OK' : '•'} As duas senhas precisam coincidir
                    </li>
                  </ul>
                </div>
              )}

              {error && (
                <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[15px] leading-[1.5] text-[#B91C1C]">
                  {error}
                </div>
              )}

              <Button
                id="update-password-submit"
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Aguarde...' : 'Atualizar senha'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-[15px] font-semibold text-terracotta underline underline-offset-2"
              >
                ← Voltar para o login
              </Link>
            </div>
          </>
        )}
      </AuthFormPanel>
    </div>
  )
}
