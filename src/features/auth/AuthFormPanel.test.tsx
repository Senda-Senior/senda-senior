import { render, screen } from '@testing-library/react'

import { AuthFormPanel } from './AuthFormPanel'

describe('AuthFormPanel Component', () => {
  test('renders children inside the auth panel', () => {
    render(
      <AuthFormPanel>
        <form aria-label="Login form">
          <button type="submit">Entrar</button>
        </form>
      </AuthFormPanel>,
    )

    expect(screen.getByRole('form', { name: /login form/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  test('merges custom class names onto the content container', () => {
    render(
      <AuthFormPanel className="custom-panel">
        <span>Conteudo</span>
      </AuthFormPanel>,
    )

    expect(screen.getByText('Conteudo').parentElement).toHaveClass('custom-panel')
  })
})
