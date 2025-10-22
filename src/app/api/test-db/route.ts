import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const testQuery = await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Basic connection successful')

    // Test table existence and data
    const institutions = await db.institution.count()
    const students = await db.student.count()
    const academicRecords = await db.academicRecord.count()
    const athleticRecords = await db.athleticRecord.count()
    const certificates = await db.certificate.count()
    const verifications = await db.verification.count()

    // Get sample data
    const sampleInstitution = await db.institution.findFirst()
    const sampleStudent = await db.student.findFirst()

    const result = {
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        tables: {
          institutions,
          students,
          academicRecords,
          athleticRecords,
          certificates,
          verifications
        },
        sample: {
          institution: sampleInstitution ? {
            name: sampleInstitution.name,
            type: sampleInstitution.type
          } : null,
          student: sampleStudent ? {
            name: sampleStudent.name,
            email: sampleStudent.email
          } : null
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
        }
      }
    }

    console.log('📊 Database stats:', result.data.tables)
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Database connection failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    }, { status: 500 })
  }
}
