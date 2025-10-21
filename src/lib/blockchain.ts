import crypto from 'crypto'

export interface BlockchainRecord {
  id: string
  type: 'academic' | 'athletic' | 'certificate'
  data: any
  timestamp: number
  previousHash?: string
  hash: string
  nonce: number
}

export interface BlockchainTransaction {
  txHash: string
  blockNumber: number
  timestamp: number
  from: string
  to: string
  data: string
  signature: string
}

class BlockchainService {
  private chain: BlockchainRecord[] = []
  private difficulty: number = 4
  private pendingRecords: BlockchainRecord[] = []

  constructor() {
    this.createGenesisBlock()
  }

  private createGenesisBlock(): void {
    const genesisBlock: BlockchainRecord = {
      id: 'genesis',
      type: 'academic',
      data: { message: 'Genesis Block - Educational Passport System' },
      timestamp: Date.now(),
      hash: this.calculateHash({
        id: 'genesis',
        type: 'academic',
        data: { message: 'Genesis Block - Educational Passport System' },
        timestamp: Date.now(),
        nonce: 0
      }),
      nonce: 0
    }
    this.chain.push(genesisBlock)
  }

  private calculateHash(record: Omit<BlockchainRecord, 'hash'>): string {
    return crypto
      .createHash('sha256')
      .update(
        JSON.stringify({
          id: record.id,
          type: record.type,
          data: record.data,
          timestamp: record.timestamp,
          previousHash: record.previousHash || '',
          nonce: record.nonce
        })
      )
      .digest('hex')
  }

  private mineBlock(record: Omit<BlockchainRecord, 'hash' | 'nonce'>): BlockchainRecord {
    let nonce = 0
    let hash: string
    const previousHash = this.chain[this.chain.length - 1]?.hash

    do {
      nonce++
      hash = this.calculateHash({
        ...record,
        previousHash,
        nonce
      })
    } while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0'))

    return {
      ...record,
      previousHash,
      hash,
      nonce
    }
  }

  public addRecord(
    id: string,
    type: 'academic' | 'athletic' | 'certificate',
    data: any
  ): BlockchainRecord {
    const record: Omit<BlockchainRecord, 'hash' | 'nonce'> = {
      id,
      type,
      data,
      timestamp: Date.now()
    }

    const minedBlock = this.mineBlock(record)
    this.chain.push(minedBlock)
    return minedBlock
  }

  public verifyRecord(recordId: string): boolean {
    const record = this.chain.find(r => r.id === recordId)
    if (!record) return false

    const recalculatedHash = this.calculateHash({
      id: record.id,
      type: record.type,
      data: record.data,
      timestamp: record.timestamp,
      previousHash: record.previousHash || '',
      nonce: record.nonce
    })

    return recalculatedHash === record.hash
  }

  public getRecord(recordId: string): BlockchainRecord | null {
    return this.chain.find(r => r.id === recordId) || null
  }

  public getAllRecords(): BlockchainRecord[] {
    return [...this.chain]
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentRecord = this.chain[i]
      const previousRecord = this.chain[i - 1]

      // Verify current record's hash
      const recalculatedHash = this.calculateHash({
        id: currentRecord.id,
        type: currentRecord.type,
        data: currentRecord.data,
        timestamp: currentRecord.timestamp,
        previousHash: currentRecord.previousHash || '',
        nonce: currentRecord.nonce
      })

      if (recalculatedHash !== currentRecord.hash) {
        return false
      }

      // Verify chain linkage
      if (currentRecord.previousHash !== previousRecord.hash) {
        return false
      }
    }
    return true
  }

  public generateTransactionHash(data: any): string {
    const timestamp = Date.now()
    const randomNonce = Math.floor(Math.random() * 1000000)
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify({ data, timestamp, randomNonce }))
      .digest('hex')
  }

  public createDigitalSignature(data: any, privateKey: string): string {
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(JSON.stringify(data))
    return sign.sign(privateKey, 'hex')
  }

  public verifyDigitalSignature(data: any, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(JSON.stringify(data))
    return verify.verify(publicKey, signature, 'hex')
  }

  public generateMerkleRoot(records: string[]): string {
    if (records.length === 0) return ''
    if (records.length === 1) return records[0]

    const nextLevel: string[] = []
    for (let i = 0; i < records.length; i += 2) {
      const left = records[i]
      const right = records[i + 1] || left
      const combined = left + right
      nextLevel.push(crypto.createHash('sha256').update(combined).digest('hex'))
    }

    return this.generateMerkleRoot(nextLevel)
  }

  public getChainStats() {
    return {
      totalBlocks: this.chain.length,
      isValid: this.isChainValid(),
      lastBlock: this.chain[this.chain.length - 1],
      difficulty: this.difficulty
    }
  }
}

// Singleton instance
export const blockchainService = new BlockchainService()

// Helper functions for educational records
export const createAcademicHash = (record: any): string => {
  const data = {
    studentId: record.studentId,
    institution: record.institution,
    title: record.title,
    degree: record.degree,
    field: record.field,
    startDate: record.startDate,
    endDate: record.endDate,
    grade: record.grade,
    gpa: record.gpa
  }
  
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export const createAthleticHash = (record: any): string => {
  const data = {
    studentId: record.studentId,
    sport: record.sport,
    achievement: record.achievement,
    competition: record.competition,
    date: record.date,
    position: record.position,
    record: record.record
  }
  
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export const createCertificateHash = (record: any): string => {
  const data = {
    studentId: record.studentId,
    institution: record.institution,
    title: record.title,
    description: record.description,
    issueDate: record.issueDate,
    expiryDate: record.expiryDate
  }
  
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

// Verification functions
export const verifyAcademicRecord = (record: any, blockchainHash: string): boolean => {
  const calculatedHash = createAcademicHash(record)
  return calculatedHash === blockchainHash
}

export const verifyAthleticRecord = (record: any, blockchainHash: string): boolean => {
  const calculatedHash = createAthleticHash(record)
  return calculatedHash === blockchainHash
}

export const verifyCertificate = (record: any, blockchainHash: string): boolean => {
  const calculatedHash = createCertificateHash(record)
  return calculatedHash === blockchainHash
}