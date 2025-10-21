'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertCircle, Search } from 'lucide-react'

interface VerificationResult {
  isValid: boolean
  isBlockchainValid: boolean
  record: any
  recordType: string
  verificationTimestamp: string
}

export function RecordVerifier() {
  const [hash, setHash] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!hash && !transactionId) {
      setError('Please enter a hash or transaction ID')
      return
    }

    setVerifying(true)
    setError(null)
    setResult(null)

    try {
      const params = new URLSearchParams()
      if (hash) params.append('hash', hash)
      if (transactionId) params.append('tx', transactionId)

      const response = await fetch(`/api/verify?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('Failed to verify record')
    } finally {
      setVerifying(false)
    }
  }

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (isValid: boolean) => {
    return (
      <Badge className={isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {isValid ? 'Valid' : 'Invalid'}
      </Badge>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Record Verification
          </CardTitle>
          <CardDescription>
            Verify the authenticity of educational records using blockchain hash or transaction ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hash">Blockchain Hash</Label>
              <Input
                id="hash"
                placeholder="0xabc123..."
                value={hash}
                onChange={(e) => setHash(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction">Transaction ID</Label>
              <Input
                id="transaction"
                placeholder="0xdef456..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleVerify} 
            disabled={verifying || (!hash && !transactionId)}
            className="w-full md:w-auto"
          >
            {verifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Verify Record
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.isValid)}
                Verification Results
              </CardTitle>
              {getStatusBadge(result.isValid)}
            </div>
            <CardDescription>
              Verification completed at {new Date(result.verificationTimestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Record Validity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Data Integrity</span>
                    {getStatusIcon(result.isValid)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Blockchain Valid</span>
                    {getStatusIcon(result.isBlockchainValid)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Record Type</span>
                    <Badge variant="outline">{result.recordType}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Record Details</h4>
                <div className="space-y-2 text-sm">
                  {result.recordType === 'academic' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Title</span>
                        <span className="font-medium">{result.record.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Institution</span>
                        <span className="font-medium">{result.record.institution?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Field</span>
                        <span className="font-medium">{result.record.field || 'N/A'}</span>
                      </div>
                    </>
                  )}
                  
                  {result.recordType === 'athletic' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sport</span>
                        <span className="font-medium">{result.record.sport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Achievement</span>
                        <span className="font-medium">{result.record.achievement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date</span>
                        <span className="font-medium">
                          {new Date(result.record.date).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {result.recordType === 'certificate' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Title</span>
                        <span className="font-medium">{result.record.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Institution</span>
                        <span className="font-medium">{result.record.institution?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Issue Date</span>
                        <span className="font-medium">
                          {new Date(result.record.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-900 mb-3">Blockchain Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Hash:</span>
                  <p className="font-mono text-xs bg-slate-100 p-2 rounded mt-1 break-all">
                    {result.record.blockchainHash}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Transaction:</span>
                  <p className="font-mono text-xs bg-slate-100 p-2 rounded mt-1 break-all">
                    {result.record.blockchainTx}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-900 mb-3">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Name</span>
                  <p className="font-medium">{result.record.student?.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Student ID</span>
                  <p className="font-medium">{result.record.student?.studentId}</p>
                </div>
                <div>
                  <span className="text-slate-600">Email</span>
                  <p className="font-medium">{result.record.student?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}