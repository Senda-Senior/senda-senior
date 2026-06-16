/**
 * constants.ts
 * Constantes compartilhadas de Configurações (cliente + servidor).
 *
 * Vive fora de actions.ts porque um módulo `'use server'` só pode exportar
 * funções async — não constantes.
 */

/** Texto que o usuário precisa digitar para confirmar a exclusão de conta. */
export const DELETE_ACCOUNT_CONFIRMATION = 'EXCLUIR'
