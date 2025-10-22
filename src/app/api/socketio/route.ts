import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Socket.IO is disabled for Vercel deployment
  // In a serverless environment, consider using:
  // - Pusher
  // - Ably
  // - Server-Sent Events
  // - WebSocket API routes with external WebSocket services

  return new NextResponse('Socket.IO is not available in serverless deployment', {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function POST(req: NextRequest) {
  return new NextResponse('Socket.IO is not available in serverless deployment', {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}