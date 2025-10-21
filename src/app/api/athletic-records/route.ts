import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockchainService, createAthleticHash } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')

    let whereClause: any = {}
    
    if (studentId) whereClause.studentId = studentId
    if (institutionId) whereClause.institutionId = institutionId

    const records = await db.athleticRecord.findMany({
      where: whereClause,
      include: {
        student: true,
        institution: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('Error fetching athletic records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch athletic records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentId,
      institutionId,
      sport,
      achievement,
      competition,
      date,
      position,
      record: athleticRecord
    } = body

    // Verify student exists
    const student = await db.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Create athletic record
    const record = await db.athleticRecord.create({
      data: {
        studentId,
        institutionId: institutionId || null,
        sport,
        achievement,
        competition: competition || null,
        date: new Date(date),
        position: position || null,
        record: athleticRecord || null
      },
      include: {
        student: true,
        institution: true
      }
    })

    // Generate blockchain hash
    const blockchainHash = createAthleticHash(record)
    
    // Add to blockchain
    const blockchainRecord = blockchainService.addRecord(
      record.id,
      'athletic',
      {
        type: 'athletic_record',
        record: record,
        timestamp: new Date().toISOString()
      }
    )

    // Update record with blockchain info
    const updatedRecord = await db.athleticRecord.update({
      where: { id: record.id },
      data: {
        blockchainHash,
        blockchainTx: blockchainService.generateTransactionHash(blockchainRecord)
      },
      include: {
        student: true,
        institution: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: updatedRecord 
    })
  } catch (error) {
    console.error('Error creating athletic record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create athletic record' },
      { status: 500 }
    )
  }
}