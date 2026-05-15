export type AppError =
  | AuthError
  | NetworkError
  | ValidationError
  | StorageError

export interface AuthError {
  type: 'auth'
  code: 'unauthorized' | 'forbidden' | 'session_expired'
  message: string
}

export interface NetworkError {
  type: 'network'
  code: 'timeout' | 'offline' | 'connection_failed'
  message: string
}

export interface ValidationError {
  type: 'validation'
  code: 'invalid_input' | 'missing_field'
  message: string
  field?: string
}

export interface StorageError {
  type: 'storage'
  code: 'quota_exceeded' | 'not_found' | 'access_denied'
  message: string
}

export function createAuthError(
  code: AuthError['code'],
  message: string,
): AuthError {
  return { type: 'auth', code, message }
}

export function createNetworkError(
  code: NetworkError['code'],
  message: string,
): NetworkError {
  return { type: 'network', code, message }
}

export function createValidationError(
  code: ValidationError['code'],
  message: string,
  field?: string,
): ValidationError {
  return { type: 'validation', code, message, field }
}

export function createStorageError(
  code: StorageError['code'],
  message: string,
): StorageError {
  return { type: 'storage', code, message }
}

export function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null && 'type' in error && (error as AuthError).type === 'auth'
}

export function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === 'object' && error !== null && 'type' in error && (error as NetworkError).type === 'network'
}

export function isValidationError(error: unknown): error is ValidationError {
  return typeof error === 'object' && error !== null && 'type' in error && (error as ValidationError).type === 'validation'
}

export function isStorageError(error: unknown): error is StorageError {
  return typeof error === 'object' && error !== null && 'type' in error && (error as StorageError).type === 'storage'
}

export function isAppError(error: unknown): error is AppError {
  return isAuthError(error) || isNetworkError(error) || isValidationError(error) || isStorageError(error)
}
