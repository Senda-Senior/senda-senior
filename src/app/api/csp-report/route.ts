import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.warn('[csp-violation]', JSON.stringify(body))
  } catch {
    // ignore malformed
  }
  return new NextResponse(null, { status: 204 })
}
