import { createClient } from '@libsql/client'

// Simple blockchain service mock
const blockchainService = {
  records: new Map(),
  addRecord: (id: string, type: string, data: any) => {
    const record = {
      id,
      type,
      data,
      hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      timestamp: new Date().toISOString()
    }
    blockchainService.records.set(id, record)
    return record
  },
  generateTransactionHash: (record: any) => `tx_${Math.random().toString(16).substr(2, 16)}`,
  getAllRecords: () => Array.from(blockchainService.records.values())
}

// Hash creation functions
function createAcademicHash(record: any) {
  return `academic_${record.id}_${Date.now()}`
}

function createAthleticHash(record: any) {
  return `athletic_${record.id}_${Date.now()}`
}

function createCertificateHash(record: any) {
  return `certificate_${record.id}_${Date.now()}`
}

async function seedDatabase(databaseUrl: string, authToken?: string) {
  console.log('🌱 Starting database seeding...')
  console.log('📡 Database URL:', databaseUrl.replace(/\/\/.*@/, '//***@'))

  // Create libSQL client directly
  const clientConfig: any = {
    url: databaseUrl
  }
  
  if (authToken) {
    clientConfig.authToken = authToken
  }
  
  const client = createClient(clientConfig)

  try {
    // Test connection
    console.log('🔍 Testing database connection...')
    await client.execute('SELECT 1 as test')
    console.log('✅ Connected to database')

    // Clean existing data
    console.log('🗑️ Clearing existing data...')
    await client.execute('DELETE FROM verifications')
    await client.execute('DELETE FROM certificates')
    await client.execute('DELETE FROM athletic_records')
    await client.execute('DELETE FROM academic_records')
    await client.execute('DELETE FROM students')
    await client.execute('DELETE FROM institutions')
    console.log('✅ Cleared existing data')

    // Create Institutions
    console.log('🏫 Creating institutions...')
    const institutions: any[] = []
    
    const institutionData = [
      {
        name: 'Stanford University',
        type: 'university',
        address: '450 Serra Mall, Stanford, CA 94305',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      },
      {
        name: 'Massachusetts Institute of Technology',
        type: 'university',
        address: '77 Massachusetts Ave, Cambridge, MA 02139',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      },
      {
        name: 'Harvard University',
        type: 'university',
        address: 'Cambridge, MA 02138',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      },
      {
        name: 'Olympic Committee',
        type: 'sports_organization',
        address: 'Château de Vidy, 1007 Lausanne, Switzerland',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      },
      {
        name: 'TechCorp Inc.',
        type: 'employer',
        address: '1 Tech Way, San Francisco, CA 94105',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    ]

    for (const inst of institutionData) {
      const id = `inst_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO institutions (id, name, type, address, blockchainAddress, verified, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          inst.name,
          inst.type,
          inst.address,
          inst.blockchainAddress,
          inst.verified ? 1 : 0,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
      institutions.push({ id, ...inst })
    }
    console.log(`✅ Created ${institutions.length} institutions`)

    // Create Students
    console.log('👨‍🎓 Creating students...')
    const students: any[] = []
    
    const studentData = [
      {
        name: 'Alexandra Chen',
        email: 'alexandra.chen@stanford.edu',
        studentId: 'STU2024001',
        dateOfBirth: '2002-05-15',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus.johnson@mit.edu',
        studentId: 'STU2024002',
        dateOfBirth: '2001-09-22',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      },
      {
        name: 'Sofia Rodriguez',
        email: 'sofia.rodriguez@harvard.edu',
        studentId: 'STU2024003',
        dateOfBirth: '2003-01-10',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      },
      {
        name: 'David Kim',
        email: 'david.kim@stanford.edu',
        studentId: 'STU2024004',
        dateOfBirth: '2002-11-28',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      },
      {
        name: 'Emma Thompson',
        email: 'emma.thompson@mit.edu',
        studentId: 'STU2024005',
        dateOfBirth: '2001-07-08',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    ]

    for (const student of studentData) {
      const id = `stu_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO students (id, name, email, studentId, dateOfBirth, blockchainAddress, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          student.name,
          student.email,
          student.studentId,
          student.dateOfBirth,
          student.blockchainAddress,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
      students.push({ id, ...student })
    }
    console.log(`✅ Created ${students.length} students`)

    // Create Academic Records
    console.log('📚 Creating academic records...')
    const academicRecords: any[] = []
    
    const academicData = [
      {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Bachelor of Science in Computer Science',
        degree: 'B.S.',
        field: 'Computer Science',
        startDate: '2020-09-01',
        endDate: '2024-06-15',
        grade: 'A',
        gpa: 3.9,
        status: 'verified'
      },
      {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Introduction to Artificial Intelligence',
        degree: null,
        field: 'Computer Science',
        startDate: '2023-09-01',
        endDate: '2023-12-15',
        grade: 'A+',
        gpa: null,
        status: 'verified'
      },
      {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Master of Engineering in Electrical Engineering',
        degree: 'M.Eng.',
        field: 'Electrical Engineering',
        startDate: '2022-09-01',
        endDate: '2024-06-15',
        grade: 'A-',
        gpa: 3.8,
        status: 'verified'
      },
      {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Quantum Computing Fundamentals',
        degree: null,
        field: 'Physics',
        startDate: '2023-01-15',
        endDate: '2023-05-15',
        grade: 'A',
        gpa: null,
        status: 'verified'
      },
      {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        title: 'Bachelor of Arts in Economics',
        degree: 'B.A.',
        field: 'Economics',
        startDate: '2020-09-01',
        endDate: '2024-06-15',
        grade: 'A',
        gpa: 3.95,
        status: 'verified'
      },
      {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        title: 'Bachelor of Science in Biology',
        degree: 'B.S.',
        field: 'Biology',
        startDate: '2020-09-01',
        endDate: '2024-06-15',
        grade: 'A-',
        gpa: 3.7,
        status: 'verified'
      },
      {
        studentId: students[4].id,
        institutionId: institutions[1].id,
        title: 'Bachelor of Science in Mathematics',
        degree: 'B.S.',
        field: 'Mathematics',
        startDate: '2020-09-01',
        endDate: '2024-06-15',
        grade: 'A',
        gpa: 3.85,
        status: 'verified'
      }
    ]

    for (const record of academicData) {
      const id = `acad_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO academic_records (id, studentId, institutionId, title, degree, field, startDate, endDate, grade, gpa, status, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          record.studentId,
          record.institutionId,
          record.title,
          record.degree,
          record.field,
          record.startDate,
          record.endDate,
          record.grade,
          record.gpa,
          record.status,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
      academicRecords.push({ id, ...record })
    }
    console.log(`✅ Created ${academicRecords.length} academic records`)

    // Create Athletic Records
    console.log('🏆 Creating athletic records...')
    const athleticRecords: any[] = []
    
    const athleticData = [
      {
        studentId: students[0].id,
        institutionId: institutions[3].id,
        sport: 'Swimming',
        achievement: 'Gold Medal - 100m Freestyle',
        competition: 'National Collegiate Swimming Championship',
        date: '2023-03-15',
        position: '1st',
        record: '52.3 seconds',
        status: 'verified'
      },
      {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        sport: 'Swimming',
        achievement: 'Team Captain',
        competition: 'Stanford Swimming Team',
        date: '2023-09-01',
        position: 'Captain',
        record: null,
        status: 'verified'
      },
      {
        studentId: students[1].id,
        institutionId: institutions[3].id,
        sport: 'Track and Field',
        achievement: 'Silver Medal - 400m Hurdles',
        competition: 'NCAA Track & Field Championship',
        date: '2023-05-20',
        position: '2nd',
        record: '51.2 seconds',
        status: 'verified'
      },
      {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        sport: 'Tennis',
        achievement: 'Ivy League Champion - Singles',
        competition: 'Ivy League Tennis Tournament',
        date: '2023-10-10',
        position: '1st',
        record: null,
        status: 'verified'
      },
      {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        sport: 'Basketball',
        achievement: 'Pac-12 Championship Team',
        competition: 'Pac-12 Basketball Tournament',
        date: '2023-03-25',
        position: 'Team Member',
        record: null,
        status: 'verified'
      }
    ]

    for (const record of athleticData) {
      const id = `athl_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO athletic_records (id, studentId, institutionId, sport, achievement, competition, date, position, record, status, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          record.studentId,
          record.institutionId,
          record.sport,
          record.achievement,
          record.competition,
          record.date,
          record.position,
          record.record,
          record.status,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
      athleticRecords.push({ id, ...record })
    }
    console.log(`✅ Created ${athleticRecords.length} athletic records`)

    // Create Certificates
    console.log('🏅 Creating certificates...')
    const certificates: any[] = []
    
    const certificateData = [
      {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Dean\'s List - Academic Excellence',
        description: 'Awarded for outstanding academic performance in Fall 2023',
        issueDate: '2024-01-15',
        expiryDate: null,
        fileUrl: '/certificates/dean-list-alexandra.pdf',
        status: 'verified'
      },
      {
        studentId: students[0].id,
        institutionId: institutions[3].id,
        title: 'Olympic Trials Qualifier',
        description: 'Qualified for US Olympic Swimming Trials',
        issueDate: '2023-06-01',
        expiryDate: '2024-06-01',
        fileUrl: '/certificates/olympic-trials-alexandra.pdf',
        status: 'verified'
      },
      {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Research Excellence Award',
        description: 'Outstanding contribution to quantum computing research',
        issueDate: '2023-12-10',
        expiryDate: null,
        fileUrl: '/certificates/research-award-marcus.pdf',
        status: 'verified'
      },
      {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Teaching Assistant Certification',
        description: 'Certified TA for Electrical Engineering courses',
        issueDate: '2023-09-01',
        expiryDate: '2024-09-01',
        fileUrl: '/certificates/ta-cert-marcus.pdf',
        status: 'verified'
      },
      {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        title: 'Summa Cum Laude',
        description: 'Graduated with highest honors',
        issueDate: '2024-06-15',
        expiryDate: null,
        fileUrl: '/certificates/summa-sonia.pdf',
        status: 'verified'
      },
      {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        title: 'Research Publication',
        description: 'Published in Nature Biology journal',
        issueDate: '2024-02-20',
        expiryDate: null,
        fileUrl: '/certificates/nature-pub-david.pdf',
        status: 'verified'
      },
      {
        studentId: students[4].id,
        institutionId: institutions[1].id,
        title: 'Mathematics Competition Winner',
        description: 'First place in MIT Mathematics Competition',
        issueDate: '2023-11-15',
        expiryDate: null,
        fileUrl: '/certificates/math-comp-emma.pdf',
        status: 'verified'
      }
    ]

    for (const cert of certificateData) {
      const id = `cert_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO certificates (id, studentId, institutionId, title, description, issueDate, expiryDate, fileUrl, status, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          cert.studentId,
          cert.institutionId,
          cert.title,
          cert.description,
          cert.issueDate,
          cert.expiryDate,
          cert.fileUrl,
          cert.status,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
      certificates.push({ id, ...cert })
    }
    console.log(`✅ Created ${certificates.length} certificates`)

    // Add blockchain hashes to all records
    console.log('🔗 Adding blockchain hashes...')
    for (const record of academicRecords) {
      const hash = createAcademicHash(record)
      const blockchainRecord = blockchainService.addRecord(
        record.id,
        'academic',
        { record, timestamp: new Date().toISOString() }
      )
      
      await client.execute({
        sql: 'UPDATE academic_records SET blockchainHash = ?, blockchainTx = ? WHERE id = ?',
        args: [hash, blockchainService.generateTransactionHash(blockchainRecord), record.id]
      })
    }

    for (const record of athleticRecords) {
      const hash = createAthleticHash(record)
      const blockchainRecord = blockchainService.addRecord(
        record.id,
        'athletic',
        { record, timestamp: new Date().toISOString() }
      )
      
      await client.execute({
        sql: 'UPDATE athletic_records SET blockchainHash = ?, blockchainTx = ? WHERE id = ?',
        args: [hash, blockchainService.generateTransactionHash(blockchainRecord), record.id]
      })
    }

    for (const record of certificates) {
      const hash = createCertificateHash(record)
      const blockchainRecord = blockchainService.addRecord(
        record.id,
        'certificate',
        { record, timestamp: new Date().toISOString() }
      )
      
      await client.execute({
        sql: 'UPDATE certificates SET blockchainHash = ?, blockchainTx = ? WHERE id = ?',
        args: [hash, blockchainService.generateTransactionHash(blockchainRecord), record.id]
      })
    }

    // Create some verifications
    console.log('🔍 Creating verifications...')
    const verificationData = [
      {
        recordId: academicRecords[0].id,
        recordType: 'academic',
        verifierId: institutions[4].id,
        verifierType: 'employer',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Credentials verified for employment application'
      },
      {
        recordId: certificates[0].id,
        recordType: 'certificate',
        verifierId: institutions[4].id,
        verifierType: 'employer',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Dean\'s List confirmed'
      },
      {
        recordId: athleticRecords[0].id,
        recordType: 'athletic',
        verifierId: institutions[3].id,
        verifierType: 'institution',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Olympic trial performance verified'
      }
    ]

    for (const verification of verificationData) {
      const id = `ver_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
      await client.execute({
        sql: `INSERT INTO verifications (id, recordId, recordType, verifierId, verifierType, studentId, status, comments, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          verification.recordId,
          verification.recordType,
          verification.verifierId,
          verification.verifierType,
          verification.studentId,
          verification.status,
          verification.comments,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      })
    }

    console.log('🔗 Added blockchain hashes and verifications')
    console.log('✅ Database seeding completed successfully!')
    
    // Print summary
    console.log('\n📊 Seeding Summary:')
    console.log(`- Institutions: ${institutions.length}`)
    console.log(`- Students: ${students.length}`)
    console.log(`- Academic Records: ${academicRecords.length}`)
    console.log(`- Athletic Records: ${athleticRecords.length}`)
    console.log(`- Certificates: ${certificates.length}`)
    console.log(`- Blockchain Records: ${blockchainService.getAllRecords().length}`)

    return {
      success: true,
      summary: {
        institutions: institutions.length,
        students: students.length,
        academicRecords: academicRecords.length,
        athleticRecords: athleticRecords.length,
        certificates: certificates.length,
        blockchainRecords: blockchainService.getAllRecords().length
      }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    client.close()
  }
}

// Main execution
async function main() {
  const databaseUrl = process.argv[2]
  const authToken = process.argv[3]

  if (!databaseUrl) {
    console.error('❌ Error: Database URL is required')
    console.log('Usage: tsx seed-turso-direct.ts <DATABASE_URL> [AUTH_TOKEN]')
    console.log('Example: tsx seed-turso-direct.ts "libsql://your-db.turso.io" "your-auth-token"')
    process.exit(1)
  }

  try {
    const result = await seedDatabase(databaseUrl, authToken)
    console.log('\n🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { seedDatabase }
