import { NextRequest, NextResponse } from 'next/server'

// Fallback for Socket.IO on Vercel (serverless doesn't support WebSockets)
// This provides a REST API alternative for real-time features
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO is not available in serverless deployment',
    note: 'WebSocket features require a custom server deployment',
    alternative: 'Use polling-based updates or deploy to a platform that supports WebSockets'
  }, { status: 503 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Echo response for development compatibility
    return NextResponse.json({
      text: `Echo: ${body.text || 'No message'}`,
      senderId: 'system',
      timestamp: new Date().toISOString(),
      note: 'This is a fallback response - Socket.IO not available on Vercel'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
