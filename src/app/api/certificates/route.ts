import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockchainService, createCertificateHash } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')

    let whereClause: any = {}
    
    if (studentId) whereClause.studentId = studentId
    if (institutionId) whereClause.institutionId = institutionId

    const certificates = await db.certificate.findMany({
      where: whereClause,
      include: {
        student: true,
        institution: true
      },
      orderBy: {
        issueDate: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: certificates })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
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
      description,
      issueDate,
      expiryDate,
      fileUrl
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

    // Verify institution exists
    const institution = await db.institution.findUnique({
      where: { id: institutionId }
    })

    if (!institution) {
      return NextResponse.json(
        { success: false, error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        studentId,
        institutionId,
        title,
        description: description || null,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        fileUrl: fileUrl || null
      },
      include: {
        student: true,
        institution: true
      }
    })

    // Generate blockchain hash
    const blockchainHash = createCertificateHash(certificate)
    
    // Add to blockchain
    const blockchainRecord = blockchainService.addRecord(
      certificate.id,
      'certificate',
      {
        type: 'certificate',
        record: certificate,
        timestamp: new Date().toISOString()
      }
    )

    // Update certificate with blockchain info
    const updatedCertificate = await db.certificate.update({
      where: { id: certificate.id },
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
      data: updatedCertificate 
    })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}