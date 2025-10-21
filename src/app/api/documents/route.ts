import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'
import { blockchainService, createCertificateHash } from '@/lib/blockchain'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const studentId = formData.get('studentId') as string
    const institutionId = formData.get('institutionId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const documentType = formData.get('documentType') as string

    if (!file || !studentId || !institutionId || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create document record in database
    const document = await db.certificate.create({
      data: {
        studentId,
        institutionId,
        title,
        description: description || null,
        issueDate: new Date(),
        fileUrl: `/api/uploads/${filename}`,
        status: 'pending'
      },
      include: {
        student: true,
        institution: true
      }
    })

    // Generate blockchain hash for the document
    const blockchainHash = createCertificateHash({
      ...document,
      fileUrl: `/api/uploads/${filename}`,
      fileSize: file.size,
      fileType: file.type
    })

    // Add to blockchain
    const blockchainRecord = blockchainService.addRecord(
      document.id,
      'certificate',
      {
        type: 'document_upload',
        document: {
          ...document,
          fileUrl: `/api/uploads/${filename}`,
          fileSize: file.size,
          fileType: file.type
        },
        timestamp: new Date().toISOString()
      }
    )

    // Update document with blockchain info
    const updatedDocument = await db.certificate.update({
      where: { id: document.id },
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
      data: {
        ...updatedDocument,
        fileUrl: `/api/uploads/${filename}`,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')

    let whereClause: any = {}
    
    if (studentId) whereClause.studentId = studentId
    if (institutionId) whereClause.institutionId = institutionId

    const documents = await db.certificate.findMany({
      where: whereClause,
      include: {
        student: true,
        institution: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}