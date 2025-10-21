import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockchainService, verifyAcademicRecord, verifyAthleticRecord, verifyCertificate } from '@/lib/blockchain'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recordId, recordType, blockchainHash } = body

    let isValid = false
    let record = null

    switch (recordType) {
      case 'academic':
        record = await db.academicRecord.findUnique({
          where: { id: recordId },
          include: {
            student: true,
            institution: true
          }
        })
        
        if (record && record.blockchainHash) {
          isValid = verifyAcademicRecord(record, blockchainHash || record.blockchainHash)
        }
        break

      case 'athletic':
        record = await db.athleticRecord.findUnique({
          where: { id: recordId },
          include: {
            student: true,
            institution: true
          }
        })
        
        if (record && record.blockchainHash) {
          isValid = verifyAthleticRecord(record, blockchainHash || record.blockchainHash)
        }
        break

      case 'certificate':
        record = await db.certificate.findUnique({
          where: { id: recordId },
          include: {
            student: true,
            institution: true
          }
        })
        
        if (record && record.blockchainHash) {
          isValid = verifyCertificate(record, blockchainHash || record.blockchainHash)
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid record type' },
          { status: 400 }
        )
    }

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      )
    }

    // Verify blockchain record exists
    const blockchainRecord = blockchainService.getRecord(recordId)
    const isBlockchainValid = blockchainRecord ? blockchainService.verifyRecord(recordId) : false

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        isBlockchainValid,
        record,
        blockchainHash: record.blockchainHash,
        blockchainTx: record.blockchainTx,
        verificationTimestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error verifying record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify record' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get('hash')
    const tx = searchParams.get('tx')

    if (!hash && !tx) {
      return NextResponse.json(
        { success: false, error: 'Hash or transaction ID required' },
        { status: 400 }
      )
    }

    let record = null
    let recordType = null

    // Search by hash
    if (hash) {
      const academicRecord = await db.academicRecord.findFirst({
        where: { blockchainHash: hash },
        include: {
          student: true,
          institution: true
        }
      })

      if (academicRecord) {
        record = academicRecord
        recordType = 'academic'
      } else {
        const athleticRecord = await db.athleticRecord.findFirst({
          where: { blockchainHash: hash },
          include: {
            student: true,
            institution: true
          }
        })

        if (athleticRecord) {
          record = athleticRecord
          recordType = 'athletic'
        } else {
          const certificate = await db.certificate.findFirst({
            where: { blockchainHash: hash },
            include: {
              student: true,
              institution: true
            }
          })

          if (certificate) {
            record = certificate
            recordType = 'certificate'
          }
        }
      }
    }

    // Search by transaction ID
    if (!record && tx) {
      const academicRecord = await db.academicRecord.findFirst({
        where: { blockchainTx: tx },
        include: {
          student: true,
          institution: true
        }
      })

      if (academicRecord) {
        record = academicRecord
        recordType = 'academic'
      } else {
        const athleticRecord = await db.athleticRecord.findFirst({
          where: { blockchainTx: tx },
          include: {
            student: true,
            institution: true
          }
        })

        if (athleticRecord) {
          record = athleticRecord
          recordType = 'athletic'
        } else {
          const certificate = await db.certificate.findFirst({
            where: { blockchainTx: tx },
            include: {
              student: true,
              institution: true
            }
          })

          if (certificate) {
            record = certificate
            recordType = 'certificate'
          }
        }
      }
    }

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      )
    }

    // Verify the record
    let isValid = false
    switch (recordType) {
      case 'academic':
        isValid = verifyAcademicRecord(record, record.blockchainHash)
        break
      case 'athletic':
        isValid = verifyAthleticRecord(record, record.blockchainHash)
        break
      case 'certificate':
        isValid = verifyCertificate(record, record.blockchainHash)
        break
    }

    // Verify blockchain record
    const blockchainRecord = blockchainService.getRecord(record.id)
    const isBlockchainValid = blockchainRecord ? blockchainService.verifyRecord(record.id) : false

    return NextResponse.json({
      success: true,
      data: {
        record,
        recordType,
        isValid,
        isBlockchainValid,
        verificationTimestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error verifying record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify record' },
      { status: 500 }
    )
  }
}