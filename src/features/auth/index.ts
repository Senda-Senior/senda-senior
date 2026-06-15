/**
 * index.ts
 * Barril de exportação — expõe componentes de auth e schemas para o resto da aplicação.
 *
 * Conecta: importado por pages (auth pages), actions (server actions)
 * Camada: shared
 */

export { AuthBrandPanel } from './AuthBrandPanel'
export { AuthFormPanel } from './AuthFormPanel'
export {
  emailSchema,
  passwordSchema,
  STRONG_PASSWORD_MIN_LENGTH,
  signInSchema,
  signUpSchema,
  resetPasswordRequestSchema,
  strongPasswordHints,
  strongPasswordSchema,
  updatePasswordSchema,
} from './schemas'
export type {
  SignInInput,
  SignUpInput,
  ResetPasswordRequestInput,
  UpdatePasswordInput,
} from './schemas'
