import { createClient } from '@libsql/client'

async function createSchema(databaseUrl: string, authToken?: string) {
  console.log('🏗️ Creating database schema...')
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

    // Create tables
    console.log('📋 Creating tables...')

    // Institutions table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS institutions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        address TEXT,
        blockchainAddress TEXT,
        verified INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `)

    // Students table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        dateOfBirth TEXT,
        studentId TEXT UNIQUE NOT NULL,
        blockchainAddress TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `)

    // Academic Records table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS academic_records (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        institutionId TEXT,
        title TEXT NOT NULL,
        degree TEXT,
        field TEXT,
        startDate TEXT NOT NULL,
        endDate TEXT,
        grade TEXT,
        gpa REAL,
        blockchainHash TEXT,
        blockchainTx TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (institutionId) REFERENCES institutions(id)
      )
    `)

    // Athletic Records table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS athletic_records (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        institutionId TEXT,
        sport TEXT NOT NULL,
        achievement TEXT NOT NULL,
        competition TEXT,
        date TEXT NOT NULL,
        position TEXT,
        record TEXT,
        blockchainHash TEXT,
        blockchainTx TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (institutionId) REFERENCES institutions(id)
      )
    `)

    // Certificates table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        institutionId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        issueDate TEXT NOT NULL,
        expiryDate TEXT,
        blockchainHash TEXT,
        blockchainTx TEXT,
        fileUrl TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (institutionId) REFERENCES institutions(id)
      )
    `)

    // Verifications table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        recordId TEXT NOT NULL,
        recordType TEXT NOT NULL,
        verifierId TEXT NOT NULL,
        verifierType TEXT NOT NULL,
        studentId TEXT NOT NULL,
        blockchainHash TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        comments TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (verifierId) REFERENCES institutions(id)
      )
    `)

    console.log('✅ All tables created successfully!')

    // Verify tables exist
    console.log('🔍 Verifying tables...')
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('📋 Tables found:', tables.rows.map(row => row.name))

    return true

  } catch (error) {
    console.error('❌ Error creating schema:', error)
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
    console.log('Usage: tsx create-schema.ts <DATABASE_URL> [AUTH_TOKEN]')
    console.log('Example: tsx create-schema.ts "libsql://your-db.turso.io" "your-auth-token"')
    process.exit(1)
  }

  try {
    await createSchema(databaseUrl, authToken)
    console.log('\n🎉 Schema creation completed successfully!')
    console.log('🚀 You can now run the seeding script')
    process.exit(0)
  } catch (error) {
    console.error('\n💥 Schema creation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { createSchema }
