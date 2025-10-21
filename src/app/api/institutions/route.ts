import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    let institutions
    
    if (id) {
      institutions = await db.institution.findUnique({
        where: { id }
      })
    } else if (name) {
      institutions = await db.institution.findFirst({
        where: { name }
      })
    } else if (type) {
      institutions = await db.institution.findMany({
        where: { type }
      })
    } else {
      institutions = await db.institution.findMany({
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({ success: true, data: institutions })
  } catch (error) {
    console.error('Error fetching institutions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institutions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, address, blockchainAddress } = body

    // Check if institution already exists
    const existingInstitution = await db.institution.findFirst({
      where: { name }
    })

    if (existingInstitution) {
      return NextResponse.json(
        { success: false, error: 'Institution with this name already exists' },
        { status: 400 }
      )
    }

    // Generate blockchain address if not provided
    const generatedAddress = blockchainAddress || `0x${Math.random().toString(16).substr(2, 40)}`

    const institution = await db.institution.create({
      data: {
        name,
        type,
        address,
        blockchainAddress: generatedAddress,
        verified: false // Will be verified manually
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: institution
    })
  } catch (error) {
    console.error('Error creating institution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create institution' },
      { status: 500 }
    )
  }
}