import { RecordVerifier } from '@/components/verification/record-verifier'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Record Verification</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Verify the authenticity and integrity of educational records using our blockchain-based verification system.
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Secure Hashing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Each record is cryptographically hashed and stored on the blockchain, ensuring tamper-proof verification.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Instant Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Verify records instantly using the blockchain hash or transaction ID. No third-party verification needed.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Permanent Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Once recorded on the blockchain, educational achievements become permanent and universally accessible.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Verification Tool */}
        <RecordVerifier />

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Features
            </CardTitle>
            <CardDescription>
              Our blockchain verification system provides multiple layers of security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Cryptographic Security</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• SHA-256 hashing for all records</li>
                  <li>• Immutable blockchain storage</li>
                  <li>• Digital signatures for institutions</li>
                  <li>• Merkle tree verification</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Verification Process</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Real-time hash validation</li>
                  <li>• Blockchain integrity checks</li>
                  <li>• Institution verification</li>
                  <li>• Timestamp verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}