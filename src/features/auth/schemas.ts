import { z } from 'zod'

/**
 * ─── Schemas de autenticação ───────────────────────────────────────
 *
 * Toda entrada de formulário/Server Action de auth passa por aqui.
 * Mantemos as mensagens em PT-BR no próprio schema porque elas vão
 * direto para o usuário (única locale por enquanto).
 * ───────────────────────────────────────────────────────────────────
 */

export const emailSchema = z
  .string()
  .min(1, 'Informe seu email.')
  .email('Email inválido.')

export const passwordSchema = z
  .string()
  .min(1, 'Informe sua senha.')
  .max(128, 'Senha muito longa.')

export const STRONG_PASSWORD_MIN_LENGTH = 12

export const strongPasswordHints = [
  `Pelo menos ${STRONG_PASSWORD_MIN_LENGTH} caracteres.`,
  'Ao menos uma letra maiúscula.',
  'Ao menos uma letra minúscula.',
  'Ao menos um número.',
  'Ao menos um símbolo.',
  'Sem espaços em branco.',
] as const

export const strongPasswordSchema = z
  .string()
  .min(
    STRONG_PASSWORD_MIN_LENGTH,
    `A senha precisa de no mínimo ${STRONG_PASSWORD_MIN_LENGTH} caracteres.`,
  )
  .max(128, 'Senha muito longa.')
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Use pelo menos uma letra maiúscula.',
  })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Use pelo menos uma letra minúscula.',
  })
  .refine((value) => /[0-9]/.test(value), {
    message: 'Use pelo menos um número.',
  })
  .refine((value) => /[^A-Za-z0-9\s]/.test(value), {
    message: 'Use pelo menos um símbolo.',
  })
  .refine((value) => !/\s/.test(value), {
    message: 'A senha não pode conter espaços.',
  })

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
export type SignInInput = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Informe seu nome.')
    .max(80, 'Nome muito longo.'),
  lastName: z
    .string()
    .min(1, 'Informe seu sobrenome.')
    .max(80, 'Sobrenome muito longo.'),
  email: emailSchema,
  password: strongPasswordSchema,
})
export type SignUpInput = z.infer<typeof signUpSchema>

export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
})
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>

export const updatePasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirm: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'As senhas não coincidem.',
    path: ['confirm'],
  })
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
