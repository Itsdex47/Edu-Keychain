import { createClient } from '@libsql/client'

async function testConnection(databaseUrl: string, authToken?: string) {
  console.log('🔍 Testing Turso database connection...')
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
    // Test basic connection
    console.log('🔌 Testing basic connection...')
    await client.execute('SELECT 1 as test')
    console.log('✅ Basic connection successful')

    // Test table existence
    console.log('📋 Checking tables...')
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('📊 Tables found:', tables.rows.map(row => row.name))

    // Test data existence
    console.log('📊 Checking data...')
    
    const institutions = await client.execute('SELECT COUNT(*) as count FROM institutions')
    console.log(`🏫 Institutions: ${institutions.rows[0].count}`)
    
    const students = await client.execute('SELECT COUNT(*) as count FROM students')
    console.log(`👨‍🎓 Students: ${students.rows[0].count}`)
    
    const academicRecords = await client.execute('SELECT COUNT(*) as count FROM academic_records')
    console.log(`📚 Academic Records: ${academicRecords.rows[0].count}`)
    
    const athleticRecords = await client.execute('SELECT COUNT(*) as count FROM athletic_records')
    console.log(`🏆 Athletic Records: ${athleticRecords.rows[0].count}`)
    
    const certificates = await client.execute('SELECT COUNT(*) as count FROM certificates')
    console.log(`🏅 Certificates: ${certificates.rows[0].count}`)
    
    const verifications = await client.execute('SELECT COUNT(*) as count FROM verifications')
    console.log(`🔍 Verifications: ${verifications.rows[0].count}`)

    // Test sample data
    console.log('🔍 Testing sample queries...')
    
    const sampleInstitution = await client.execute('SELECT name, type FROM institutions LIMIT 1')
    if (sampleInstitution.rows.length > 0) {
      console.log(`✅ Sample Institution: ${sampleInstitution.rows[0].name} (${sampleInstitution.rows[0].type})`)
    }
    
    const sampleStudent = await client.execute('SELECT name, email FROM students LIMIT 1')
    if (sampleStudent.rows.length > 0) {
      console.log(`✅ Sample Student: ${sampleStudent.rows[0].name} (${sampleStudent.rows[0].email})`)
    }

    console.log('\n🎉 Database connection test completed successfully!')
    console.log('✅ Your Turso database is properly configured and has data')
    console.log('🌐 Your Vercel app should now display the demo data')

    return true

  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check if your DATABASE_URL is correct')
    console.log('2. Verify your auth token is valid')
    console.log('3. Ensure your Turso database is accessible')
    console.log('4. Check your internet connection')
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
    console.log('Usage: tsx test-connection.ts <DATABASE_URL> [AUTH_TOKEN]')
    console.log('Example: tsx test-connection.ts "libsql://your-db.turso.io" "your-auth-token"')
    process.exit(1)
  }

  try {
    await testConnection(databaseUrl, authToken)
    process.exit(0)
  } catch (error) {
    console.error('\n💥 Connection test failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { testConnection }
