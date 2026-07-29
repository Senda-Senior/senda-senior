/**
 * resolveHomeHash — aceita `#id` e `/#id` para o AnchorHandler do Lenis.
 */

import { describe, expect, it } from 'vitest'
import { resolveHomeHash } from '@/lib/utils/SmoothScroll'

const ORIGIN = 'https://sendasenior.com.br'

describe('resolveHomeHash', () => {
  it('aceita #id', () => {
    expect(resolveHomeHash('#sobre', ORIGIN)).toBe('#sobre')
    expect(resolveHomeHash('#manuais', ORIGIN)).toBe('#manuais')
  })

  it('aceita /#id (Header pós-vitrines)', () => {
    expect(resolveHomeHash('/#sobre', ORIGIN)).toBe('#sobre')
    expect(resolveHomeHash('/#por-quem-viveu', ORIGIN)).toBe('#por-quem-viveu')
  })

  it('aceita URL absoluta da home com hash', () => {
    expect(resolveHomeHash(`${ORIGIN}/#contato`, ORIGIN)).toBe('#contato')
  })

  it('rejeita rotas que não são a home', () => {
    expect(resolveHomeHash('/manuais/prevent-care', ORIGIN)).toBeNull()
    expect(resolveHomeHash('/manuais/care#x', ORIGIN)).toBeNull()
    expect(resolveHomeHash('#', ORIGIN)).toBeNull()
    expect(resolveHomeHash('', ORIGIN)).toBeNull()
  })
})
