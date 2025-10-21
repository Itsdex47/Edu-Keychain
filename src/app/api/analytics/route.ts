import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')
    const timeframe = searchParams.get('timeframe') || 'all'

    let whereClause: any = {}
    
    if (studentId) {
      whereClause.studentId = studentId
    }

    // Get student statistics
    const studentStats = await db.student.findMany({
      where: studentId ? { id: studentId } : {},
      include: {
        academicRecords: true,
        athleticRecords: true,
        certificates: true,
        verifications: true
      }
    })

    // Get overall statistics
    const totalStudents = await db.student.count()
    const totalAcademicRecords = await db.academicRecord.count()
    const totalAthleticRecords = await db.athleticRecord.count()
    const totalCertificates = await db.certificate.count()
    const totalVerifications = await db.verification.count()

    // Get verification statistics
    const verificationStats = await db.verification.groupBy({
      by: ['status'],
      _count: true
    })

    // Get institution statistics
    const institutionStats = await db.institution.findMany({
      include: {
        certificates: {
          include: { student: true }
        },
        academicRecords: {
          include: { student: true }
        },
        athleticRecords: {
          include: { student: true }
        }
      }
    })

    // Get record type distribution
    const recordDistribution = {
      academic: totalAcademicRecords,
      athletic: totalAthleticRecords,
      certificates: totalCertificates
    }

    // Calculate verification success rate
    const verifiedCount = verificationStats.find(s => s.status === 'verified')?._count || 0
    const pendingCount = verificationStats.find(s => s.status === 'pending')?._count || 0
    const rejectedCount = verificationStats.find(s => s.status === 'rejected')?._count || 0
    const totalVerifCount = verifiedCount + pendingCount + rejectedCount

    const verificationSuccessRate = totalVerifCount > 0 ? (verifiedCount / totalVerifCount) * 100 : 0

    // Get top institutions by records
    const topInstitutions = institutionStats
      .map(inst => ({
        id: inst.id,
        name: inst.name,
        type: inst.type,
        totalRecords: inst.certificates.length + inst.academicRecords.length + inst.athleticRecords.length,
        verified: inst.verified
      }))
      .sort((a, b) => b.totalRecords - a.totalRecords)
      .slice(0, 10)

    // Get blockchain statistics
    const blockchainStats = {
      totalBlocks: totalAcademicRecords + totalAthleticRecords + totalCertificates,
      verifiedRecords: verifiedCount,
      pendingRecords: pendingCount,
      averageVerificationTime: '2.5 seconds'
    }

    const analytics = {
      overview: {
        totalStudents,
        totalRecords: totalAcademicRecords + totalAthleticRecords + totalCertificates,
        totalVerifications,
        verificationSuccessRate: Math.round(verificationSuccessRate * 100) / 100
      },
      recordDistribution,
      verificationStats: {
        verified: verifiedCount,
        pending: pendingCount,
        rejected: rejectedCount,
        successRate: Math.round(verificationSuccessRate * 100) / 100
      },
      blockchainStats,
      topInstitutions,
      monthlyTrends: [],
      studentStats: studentStats.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        verificationScore: calculateVerificationScore(student),
        recordCounts: {
          academic: student.academicRecords.length,
          athletic: student.athleticRecords.length,
          certificates: student.certificates.length
        }
      }))
    }

    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function calculateVerificationScore(student: any): number {
  const totalRecords = student.academicRecords.length + student.athleticRecords.length + student.certificates.length
  if (totalRecords === 0) return 0

  const verifiedRecords = [
    ...student.academicRecords.filter((r: any) => r.status === 'verified'),
    ...student.athleticRecords.filter((r: any) => r.status === 'verified'),
    ...student.certificates.filter((r: any) => r.status === 'verified')
  ].length

  return Math.round((verifiedRecords / totalRecords) * 100)
}