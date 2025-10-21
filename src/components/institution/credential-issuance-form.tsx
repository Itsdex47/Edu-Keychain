'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap, 
  Trophy, 
  Award, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Upload,
  FileText
} from 'lucide-react'

interface CredentialIssuanceFormProps {
  institutionId: string
  onSuccess: () => void
}

export function CredentialIssuanceForm({ institutionId, onSuccess }: CredentialIssuanceFormProps) {
  const [credentialType, setCredentialType] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'issuing' | 'success' | 'error'>('idle')
  const [blockchainHash, setBlockchainHash] = useState<string>('')

  // Form state for different credential types
  const [academicData, setAcademicData] = useState({
    studentEmail: '',
    studentId: '',
    title: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    gpa: ''
  })

  const [athleticData, setAthleticData] = useState({
    studentEmail: '',
    studentId: '',
    sport: '',
    achievement: '',
    competition: '',
    date: '',
    position: '',
    record: ''
  })

  const [certificateData, setCertificateData] = useState({
    studentEmail: '',
    studentId: '',
    title: '',
    description: '',
    issueDate: '',
    expiryDate: ''
  })

  const simulateIssuance = async () => {
    setLoading(true)
    setStatus('issuing')
    setProgress(0)

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setProgress(i)
    }

    // Generate mock blockchain hash
    const hash = '0x' + Math.random().toString(16).substr(2, 64)
    setBlockchainHash(hash)

    setStatus('success')
    setLoading(false)
    onSuccess()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await simulateIssuance()
  }

  const resetForm = () => {
    setCredentialType('')
    setStatus('idle')
    setProgress(0)
    setBlockchainHash('')
    setAcademicData({
      studentEmail: '',
      studentId: '',
      title: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      gpa: ''
    })
    setAthleticData({
      studentEmail: '',
      studentId: '',
      sport: '',
      achievement: '',
      competition: '',
      date: '',
      position: '',
      record: ''
    })
    setCertificateData({
      studentEmail: '',
      studentId: '',
      title: '',
      description: '',
      issueDate: '',
      expiryDate: ''
    })
  }

  const renderAcademicForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentEmail">Student Email</Label>
          <Input
            id="studentEmail"
            type="email"
            value={academicData.studentEmail}
            onChange={(e) => setAcademicData({...academicData, studentEmail: e.target.value})}
            placeholder="student@university.edu"
          />
        </div>
        <div>
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={academicData.studentId}
            onChange={(e) => setAcademicData({...academicData, studentId: e.target.value})}
            placeholder="STU2024001"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Program/Title</Label>
        <Input
          id="title"
          value={academicData.title}
          onChange={(e) => setAcademicData({...academicData, title: e.target.value})}
          placeholder="Bachelor of Science in Computer Science"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="degree">Degree</Label>
          <Select value={academicData.degree} onValueChange={(value) => setAcademicData({...academicData, degree: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select degree" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="B.S.">Bachelor of Science</SelectItem>
              <SelectItem value="B.A.">Bachelor of Arts</SelectItem>
              <SelectItem value="M.S.">Master of Science</SelectItem>
              <SelectItem value="M.A.">Master of Arts</SelectItem>
              <SelectItem value="Ph.D.">Doctor of Philosophy</SelectItem>
              <SelectItem value="M.Eng.">Master of Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="field">Field of Study</Label>
          <Input
            id="field"
            value={academicData.field}
            onChange={(e) => setAcademicData({...academicData, field: e.target.value})}
            placeholder="Computer Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={academicData.startDate}
            onChange={(e) => setAcademicData({...academicData, startDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={academicData.endDate}
            onChange={(e) => setAcademicData({...academicData, endDate: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={academicData.grade}
            onChange={(e) => setAcademicData({...academicData, grade: e.target.value})}
            placeholder="A"
          />
        </div>
        <div>
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            type="number"
            step="0.01"
            value={academicData.gpa}
            onChange={(e) => setAcademicData({...academicData, gpa: e.target.value})}
            placeholder="3.9"
          />
        </div>
      </div>
    </div>
  )

  const renderAthleticForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentEmail">Student Email</Label>
          <Input
            id="studentEmail"
            type="email"
            value={athleticData.studentEmail}
            onChange={(e) => setAthleticData({...athleticData, studentEmail: e.target.value})}
            placeholder="student@university.edu"
          />
        </div>
        <div>
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={athleticData.studentId}
            onChange={(e) => setAthleticData({...athleticData, studentId: e.target.value})}
            placeholder="STU2024001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sport">Sport</Label>
          <Select value={athleticData.sport} onValueChange={(value) => setAthleticData({...athleticData, sport: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Swimming">Swimming</SelectItem>
              <SelectItem value="Track and Field">Track and Field</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Tennis">Tennis</SelectItem>
              <SelectItem value="Soccer">Soccer</SelectItem>
              <SelectItem value="Baseball">Baseball</SelectItem>
              <SelectItem value="Volleyball">Volleyball</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="achievement">Achievement</Label>
          <Input
            id="achievement"
            value={athleticData.achievement}
            onChange={(e) => setAthleticData({...athleticData, achievement: e.target.value})}
            placeholder="Gold Medal - 100m Freestyle"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="competition">Competition</Label>
        <Input
          id="competition"
          value={athleticData.competition}
          onChange={(e) => setAthleticData({...athleticData, competition: e.target.value})}
          placeholder="National Collegiate Swimming Championship"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={athleticData.date}
            onChange={(e) => setAthleticData({...athleticData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={athleticData.position}
            onChange={(e) => setAthleticData({...athleticData, position: e.target.value})}
            placeholder="1st"
          />
        </div>
        <div>
          <Label htmlFor="record">Record</Label>
          <Input
            id="record"
            value={athleticData.record}
            onChange={(e) => setAthleticData({...athleticData, record: e.target.value})}
            placeholder="52.3 seconds"
          />
        </div>
      </div>
    </div>
  )

  const renderCertificateForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentEmail">Student Email</Label>
          <Input
            id="studentEmail"
            type="email"
            value={certificateData.studentEmail}
            onChange={(e) => setCertificateData({...certificateData, studentEmail: e.target.value})}
            placeholder="student@university.edu"
          />
        </div>
        <div>
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={certificateData.studentId}
            onChange={(e) => setCertificateData({...certificateData, studentId: e.target.value})}
            placeholder="STU2024001"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Certificate Title</Label>
        <Input
          id="title"
          value={certificateData.title}
          onChange={(e) => setCertificateData({...certificateData, title: e.target.value})}
          placeholder="Dean's List - Academic Excellence"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={certificateData.description}
          onChange={(e) => setCertificateData({...certificateData, description: e.target.value})}
          placeholder="Awarded for outstanding academic performance in Fall 2023"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={certificateData.issueDate}
            onChange={(e) => setCertificateData({...certificateData, issueDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            value={certificateData.expiryDate}
            onChange={(e) => setCertificateData({...certificateData, expiryDate: e.target.value})}
          />
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Issue New Credential
        </CardTitle>
        <CardDescription>
          Create a blockchain-verified credential that will be permanently recorded and instantly verifiable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credential Type Selection */}
        {!credentialType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => setCredentialType('academic')}
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Academic Record</span>
              <span className="text-xs text-gray-500">Degrees, courses, grades</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => setCredentialType('athletic')}
            >
              <Trophy className="h-8 w-8 text-green-600" />
              <span className="font-medium">Athletic Record</span>
              <span className="text-xs text-gray-500">Sports achievements</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => setCredentialType('certificate')}
            >
              <Award className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Certificate</span>
              <span className="text-xs text-gray-500">Awards, honors</span>
            </Button>
          </div>
        )}

        {/* Credential Forms */}
        {credentialType && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {credentialType === 'academic' && <GraduationCap className="h-5 w-5 text-blue-600" />}
                {credentialType === 'athletic' && <Trophy className="h-5 w-5 text-green-600" />}
                {credentialType === 'certificate' && <Award className="h-5 w-5 text-purple-600" />}
                <Badge variant="outline" className="capitalize">
                  {credentialType} Credential
                </Badge>
              </div>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Change Type
              </Button>
            </div>

            {/* Dynamic Form Content */}
            {credentialType === 'academic' && renderAcademicForm()}
            {credentialType === 'athletic' && renderAthleticForm()}
            {credentialType === 'certificate' && renderCertificateForm()}

            {/* Issuance Progress */}
            {status === 'issuing' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="font-medium text-blue-900">Issuing Credential on Blockchain...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-blue-700 mt-2">Creating immutable record: {progress}%</p>
                </CardContent>
              </Card>
            )}

            {/* Success State */}
            {status === 'success' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Credential Successfully Issued!</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">The credential has been permanently recorded on the blockchain.</p>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <p className="text-xs font-mono text-gray-600 break-all">
                        Transaction Hash: {blockchainHash}
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={resetForm}
                    className="mt-4"
                  >
                    Issue Another Credential
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {status === 'error' && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">Issuance Failed</span>
                  </div>
                  <p className="text-sm text-red-700 mt-2">
                    There was an error issuing the credential. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {status === 'idle' && (
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Issue Credential on Blockchain
                  </>
                )}
              </Button>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}