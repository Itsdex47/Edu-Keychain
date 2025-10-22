import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockchainService, createAcademicHash, createAthleticHash, createCertificateHash } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const email = searchParams.get('email')

    let students
    
    if (studentId) {
      students = await db.student.findUnique({
        where: { studentId },
        include: {
          academicRecords: {
            include: { institution: true }
          },
          athleticRecords: {
            include: { institution: true }
          },
          certificates: {
            include: { institution: true }
          },
          verifications: {
            include: { verifier: true }
          }
        }
      })
    } else if (email) {
      students = await db.student.findUnique({
        where: { email },
        include: {
          academicRecords: {
            include: { institution: true }
          },
          athleticRecords: {
            include: { institution: true }
          },
          certificates: {
            include: { institution: true }
          },
          verifications: {
            include: { verifier: true }
          }
        }
      })
    } else {
      students = await db.student.findMany({
        include: {
          academicRecords: {
            include: { institution: true }
          },
          athleticRecords: {
            include: { institution: true }
          },
          certificates: {
            include: { institution: true }
          },
          verifications: {
            include: { verifier: true }
          }
        }
      })
    }

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, dateOfBirth, studentId, blockchainAddress } = body

    // Check if student already exists
    const existingStudent = await db.student.findFirst({
      where: {
        OR: [
          { email },
          { studentId }
        ]
      }
    })

    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student with this email or student ID already exists' },
        { status: 400 }
      )
    }

    // Generate blockchain address if not provided
    const address = blockchainAddress || `0x${Math.random().toString(16).substr(2, 40)}`

    const student = await db.student.create({
      data: {
        name,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        studentId,
        blockchainAddress: address
      }
    })

    // Add to blockchain
    const blockchainRecord = blockchainService.addRecord(
      student.id,
      'academic',
      {
        type: 'student_creation',
        studentId: student.id,
        name: student.name,
        email: student.email,
        studentIdCode: student.studentId,
        blockchainAddress: student.blockchainAddress,
        timestamp: new Date().toISOString()
      }
    )

    return NextResponse.json({ 
      success: true, 
      data: {
        ...student,
        blockchainHash: blockchainRecord.hash,
        blockchainTx: blockchainService.generateTransactionHash(blockchainRecord)
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    )
  }
}