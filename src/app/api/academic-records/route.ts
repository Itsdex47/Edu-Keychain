import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockchainService, createAcademicHash } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')

    let whereClause: any = {}
    
    if (studentId) whereClause.studentId = studentId
    if (institutionId) whereClause.institutionId = institutionId

    const records = await db.academicRecord.findMany({
      where: whereClause,
      include: {
        student: true,
        institution: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('Error fetching academic records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academic records' },
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
      title,
      degree,
      field,
      startDate,
      endDate,
      grade,
      gpa
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

    // Create academic record
    const academicRecord = await db.academicRecord.create({
      data: {
        studentId,
        institutionId: institutionId || null,
        title,
        degree: degree || null,
        field: field || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        grade: grade || null,
        gpa: gpa ? parseFloat(gpa) : null
      },
      include: {
        student: true,
        institution: true
      }
    })

    // Generate blockchain hash
    const blockchainHash = createAcademicHash(academicRecord)
    
    // Add to blockchain
    const blockchainRecord = blockchainService.addRecord(
      academicRecord.id,
      'academic',
      {
        type: 'academic_record',
        record: academicRecord,
        timestamp: new Date().toISOString()
      }
    )

    // Update record with blockchain info
    const updatedRecord = await db.academicRecord.update({
      where: { id: academicRecord.id },
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
    console.error('Error creating academic record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create academic record' },
      { status: 500 }
    )
  }
}