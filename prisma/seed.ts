import { PrismaClient } from '@prisma/client'
import { blockchainService, createAcademicHash, createAthleticHash, createCertificateHash } from '../src/lib/blockchain'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  await prisma.verification.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.athleticRecord.deleteMany()
  await prisma.academicRecord.deleteMany()
  await prisma.student.deleteMany()
  await prisma.institution.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create Institutions
  const institutions = await Promise.all([
    prisma.institution.create({
      data: {
        name: 'Stanford University',
        type: 'university',
        address: '450 Serra Mall, Stanford, CA 94305',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    }),
    prisma.institution.create({
      data: {
        name: 'Massachusetts Institute of Technology',
        type: 'university',
        address: '77 Massachusetts Ave, Cambridge, MA 02139',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    }),
    prisma.institution.create({
      data: {
        name: 'Harvard University',
        type: 'university',
        address: 'Cambridge, MA 02138',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    }),
    prisma.institution.create({
      data: {
        name: 'Olympic Committee',
        type: 'sports_organization',
        address: 'Château de Vidy, 1007 Lausanne, Switzerland',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    }),
    prisma.institution.create({
      data: {
        name: 'TechCorp Inc.',
        type: 'employer',
        address: '1 Tech Way, San Francisco, CA 94105',
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      }
    })
  ])

  console.log('🏫 Created institutions:', institutions.length)

  // Create Students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: 'Alexandra Chen',
        email: 'alexandra.chen@stanford.edu',
        studentId: 'STU2024001',
        dateOfBirth: new Date('2002-05-15'),
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    }),
    prisma.student.create({
      data: {
        name: 'Marcus Johnson',
        email: 'marcus.johnson@mit.edu',
        studentId: 'STU2024002',
        dateOfBirth: new Date('2001-09-22'),
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    }),
    prisma.student.create({
      data: {
        name: 'Sofia Rodriguez',
        email: 'sofia.rodriguez@harvard.edu',
        studentId: 'STU2024003',
        dateOfBirth: new Date('2003-01-10'),
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    }),
    prisma.student.create({
      data: {
        name: 'David Kim',
        email: 'david.kim@stanford.edu',
        studentId: 'STU2024004',
        dateOfBirth: new Date('2002-11-28'),
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    }),
    prisma.student.create({
      data: {
        name: 'Emma Thompson',
        email: 'emma.thompson@mit.edu',
        studentId: 'STU2024005',
        dateOfBirth: new Date('2001-07-08'),
        blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40)
      }
    })
  ])

  console.log('👨‍🎓 Created students:', students.length)

  // Create Academic Records
  const academicRecords = await Promise.all([
    // Alexandra's records
    prisma.academicRecord.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Bachelor of Science in Computer Science',
        degree: 'B.S.',
        field: 'Computer Science',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-15'),
        grade: 'A',
        gpa: 3.9,
        status: 'verified'
      }
    }),
    prisma.academicRecord.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Introduction to Artificial Intelligence',
        degree: null,
        field: 'Computer Science',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-15'),
        grade: 'A+',
        gpa: null,
        status: 'verified'
      }
    }),
    
    // Marcus's records
    prisma.academicRecord.create({
      data: {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Master of Engineering in Electrical Engineering',
        degree: 'M.Eng.',
        field: 'Electrical Engineering',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2024-06-15'),
        grade: 'A-',
        gpa: 3.8,
        status: 'verified'
      }
    }),
    prisma.academicRecord.create({
      data: {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Quantum Computing Fundamentals',
        degree: null,
        field: 'Physics',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-05-15'),
        grade: 'A',
        gpa: null,
        status: 'verified'
      }
    }),

    // Sofia's records
    prisma.academicRecord.create({
      data: {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        title: 'Bachelor of Arts in Economics',
        degree: 'B.A.',
        field: 'Economics',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-15'),
        grade: 'A',
        gpa: 3.95,
        status: 'verified'
      }
    }),

    // David's records
    prisma.academicRecord.create({
      data: {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        title: 'Bachelor of Science in Biology',
        degree: 'B.S.',
        field: 'Biology',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-15'),
        grade: 'A-',
        gpa: 3.7,
        status: 'verified'
      }
    }),

    // Emma's records
    prisma.academicRecord.create({
      data: {
        studentId: students[4].id,
        institutionId: institutions[1].id,
        title: 'Bachelor of Science in Mathematics',
        degree: 'B.S.',
        field: 'Mathematics',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-15'),
        grade: 'A',
        gpa: 3.85,
        status: 'verified'
      }
    })
  ])

  console.log('📚 Created academic records:', academicRecords.length)

  // Create Athletic Records
  const athleticRecords = await Promise.all([
    // Alexandra's athletic achievements
    prisma.athleticRecord.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[3].id,
        sport: 'Swimming',
        achievement: 'Gold Medal - 100m Freestyle',
        competition: 'National Collegiate Swimming Championship',
        date: new Date('2023-03-15'),
        position: '1st',
        record: '52.3 seconds',
        status: 'verified'
      }
    }),
    prisma.athleticRecord.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        sport: 'Swimming',
        achievement: 'Team Captain',
        competition: 'Stanford Swimming Team',
        date: new Date('2023-09-01'),
        position: 'Captain',
        record: null,
        status: 'verified'
      }
    }),

    // Marcus's athletic achievements
    prisma.athleticRecord.create({
      data: {
        studentId: students[1].id,
        institutionId: institutions[3].id,
        sport: 'Track and Field',
        achievement: 'Silver Medal - 400m Hurdles',
        competition: 'NCAA Track & Field Championship',
        date: new Date('2023-05-20'),
        position: '2nd',
        record: '51.2 seconds',
        status: 'verified'
      }
    }),

    // Sofia's athletic achievements
    prisma.athleticRecord.create({
      data: {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        sport: 'Tennis',
        achievement: 'Ivy League Champion - Singles',
        competition: 'Ivy League Tennis Tournament',
        date: new Date('2023-10-10'),
        position: '1st',
        record: null,
        status: 'verified'
      }
    }),

    // David's athletic achievements
    prisma.athleticRecord.create({
      data: {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        sport: 'Basketball',
        achievement: 'Pac-12 Championship Team',
        competition: 'Pac-12 Basketball Tournament',
        date: new Date('2023-03-25'),
        position: 'Team Member',
        record: null,
        status: 'verified'
      }
    })
  ])

  console.log('🏆 Created athletic records:', athleticRecords.length)

  // Create Certificates
  const certificates = await Promise.all([
    // Alexandra's certificates
    prisma.certificate.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[0].id,
        title: 'Dean\'s List - Academic Excellence',
        description: 'Awarded for outstanding academic performance in Fall 2023',
        issueDate: new Date('2024-01-15'),
        expiryDate: null,
        fileUrl: '/certificates/dean-list-alexandra.pdf',
        status: 'verified'
      }
    }),
    prisma.certificate.create({
      data: {
        studentId: students[0].id,
        institutionId: institutions[3].id,
        title: 'Olympic Trials Qualifier',
        description: 'Qualified for US Olympic Swimming Trials',
        issueDate: new Date('2023-06-01'),
        expiryDate: new Date('2024-06-01'),
        fileUrl: '/certificates/olympic-trials-alexandra.pdf',
        status: 'verified'
      }
    }),

    // Marcus's certificates
    prisma.certificate.create({
      data: {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Research Excellence Award',
        description: 'Outstanding contribution to quantum computing research',
        issueDate: new Date('2023-12-10'),
        expiryDate: null,
        fileUrl: '/certificates/research-award-marcus.pdf',
        status: 'verified'
      }
    }),
    prisma.certificate.create({
      data: {
        studentId: students[1].id,
        institutionId: institutions[1].id,
        title: 'Teaching Assistant Certification',
        description: 'Certified TA for Electrical Engineering courses',
        issueDate: new Date('2023-09-01'),
        expiryDate: new Date('2024-09-01'),
        fileUrl: '/certificates/ta-cert-marcus.pdf',
        status: 'verified'
      }
    }),

    // Sofia's certificates
    prisma.certificate.create({
      data: {
        studentId: students[2].id,
        institutionId: institutions[2].id,
        title: 'Summa Cum Laude',
        description: 'Graduated with highest honors',
        issueDate: new Date('2024-06-15'),
        expiryDate: null,
        fileUrl: '/certificates/summa-sonia.pdf',
        status: 'verified'
      }
    }),

    // David's certificates
    prisma.certificate.create({
      data: {
        studentId: students[3].id,
        institutionId: institutions[0].id,
        title: 'Research Publication',
        description: 'Published in Nature Biology journal',
        issueDate: new Date('2024-02-20'),
        expiryDate: null,
        fileUrl: '/certificates/nature-pub-david.pdf',
        status: 'verified'
      }
    }),

    // Emma's certificates
    prisma.certificate.create({
      data: {
        studentId: students[4].id,
        institutionId: institutions[1].id,
        title: 'Mathematics Competition Winner',
        description: 'First place in MIT Mathematics Competition',
        issueDate: new Date('2023-11-15'),
        expiryDate: null,
        fileUrl: '/certificates/math-comp-emma.pdf',
        status: 'verified'
      }
    })
  ])

  console.log('🏅 Created certificates:', certificates.length)

  // Add blockchain hashes to all records
  for (const record of academicRecords) {
    const hash = createAcademicHash(record)
    const blockchainRecord = blockchainService.addRecord(
      record.id,
      'academic',
      { record, timestamp: new Date().toISOString() }
    )
    
    await prisma.academicRecord.update({
      where: { id: record.id },
      data: {
        blockchainHash: hash,
        blockchainTx: blockchainService.generateTransactionHash(blockchainRecord)
      }
    })
  }

  for (const record of athleticRecords) {
    const hash = createAthleticHash(record)
    const blockchainRecord = blockchainService.addRecord(
      record.id,
      'athletic',
      { record, timestamp: new Date().toISOString() }
    )
    
    await prisma.athleticRecord.update({
      where: { id: record.id },
      data: {
        blockchainHash: hash,
        blockchainTx: blockchainService.generateTransactionHash(blockchainRecord)
      }
    })
  }

  for (const record of certificates) {
    const hash = createCertificateHash(record)
    const blockchainRecord = blockchainService.addRecord(
      record.id,
      'certificate',
      { record, timestamp: new Date().toISOString() }
    )
    
    await prisma.certificate.update({
      where: { id: record.id },
      data: {
        blockchainHash: hash,
        blockchainTx: blockchainService.generateTransactionHash(blockchainRecord)
      }
    })
  }

  // Create some verifications
  await Promise.all([
    prisma.verification.create({
      data: {
        recordId: academicRecords[0].id,
        recordType: 'academic',
        verifierId: institutions[4].id,
        verifierType: 'employer',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Credentials verified for employment application'
      }
    }),
    prisma.verification.create({
      data: {
        recordId: certificates[0].id,
        recordType: 'certificate',
        verifierId: institutions[4].id,
        verifierType: 'employer',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Dean\'s List confirmed'
      }
    }),
    prisma.verification.create({
      data: {
        recordId: athleticRecords[0].id,
        recordType: 'athletic',
        verifierId: institutions[3].id,
        verifierType: 'institution',
        studentId: students[0].id,
        status: 'verified',
        comments: 'Olympic trial performance verified'
      }
    })
  ])

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
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })