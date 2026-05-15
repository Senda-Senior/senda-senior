'use client'

import type { ReactNode } from 'react'
import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            padding: '32px 24px',
            borderRadius: 16,
            background: 'rgba(185,28,28,0.03)',
            border: '1.5px solid rgba(185,28,28,0.15)',
          }}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <div
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(185,28,28,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} color="#B91C1C" strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#7F1D1D',
                  marginBottom: 8,
                }}
              >
                Algo deu errado
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: '#991B1B',
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                Encontramos um erro inesperado. Tente recarregar a página.
              </p>
              <details
                style={{
                  marginTop: 12,
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.03)',
                  fontSize: 14,
                  color: 'var(--color-ink-muted)',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 600, cursor: 'pointer' }}>Detalhes técnicos</summary>
                <pre
                  style={{
                    marginTop: 8,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: 12,
                  }}
                >
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
