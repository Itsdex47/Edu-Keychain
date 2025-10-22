import { createClient } from '@libsql/client'
import * as fs from 'fs'

async function pushSchema() {
  const databaseUrl = process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!databaseUrl || !authToken) {
    console.error('❌ Missing DATABASE_URL or TURSO_AUTH_TOKEN in .env')
    process.exit(1)
  }

  console.log('🔄 Connecting to Turso database...')

  const client = createClient({
    url: databaseUrl,
    authToken: authToken
  })

  // Read the schema from Prisma
  const schema = `
-- CreateTable
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "studentId" TEXT NOT NULL UNIQUE,
    "phoneNumber" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "graduationDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "blockchainAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "website" TEXT,
    "address" TEXT,
    "contactPerson" TEXT,
    "phoneNumber" TEXT,
    "accreditation" TEXT,
    "blockchainAddress" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AcademicRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "degree" TEXT,
    "field" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "grade" TEXT,
    "gpa" REAL,
    "credits" INTEGER,
    "honors" TEXT,
    "transcriptHash" TEXT,
    "blockchainHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AcademicRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AcademicRecord_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AthleticRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "competition" TEXT,
    "date" DATETIME NOT NULL,
    "position" TEXT,
    "record" TEXT,
    "certificateHash" TEXT,
    "blockchainHash" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AthleticRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AthleticRecord_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issueDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "certificateNumber" TEXT,
    "certificateHash" TEXT,
    "blockchainHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "verifierId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "transactionHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Institution_email_key" ON "Institution"("email");
`

  console.log('📝 Creating tables in Turso database...')

  try {
    // Split and execute each statement
    const statements = schema.split(';').filter(s => s.trim().length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        await client.execute(statement.trim())
      }
    }

    console.log('✅ Database schema pushed successfully!')
    console.log('🎉 Your Turso database is ready!')

  } catch (error) {
    console.error('❌ Error pushing schema:', error)
    process.exit(1)
  }
}

pushSchema()
