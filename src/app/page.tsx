'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AcademicRecordForm } from '@/components/forms/academic-record-form'
import { DocumentUpload } from '@/components/documents/document-upload'
import { 
  GraduationCap, 
  Trophy, 
  Award, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Share2,
  Download,
  Eye,
  Upload
} from 'lucide-react'

interface Student {
  id: string
  name: string
  studentId: string
  email: string
  blockchainAddress: string
  createdAt: string
  updatedAt: string
}

interface AcademicRecord {
  id: string
  title: string
  degree?: string
  field?: string
  startDate: string
  endDate?: string
  grade?: string
  gpa?: number
  status: string
  blockchainHash?: string
  blockchainTx?: string
  institution?: {
    name: string
  }
}

interface AthleticRecord {
  id: string
  sport: string
  achievement: string
  competition?: string
  date: string
  position?: string
  record?: string
  status: string
  blockchainHash?: string
  blockchainTx?: string
  institution?: {
    name: string
  }
}

interface Certificate {
  id: string
  title: string
  issueDate: string
  status: string
  blockchainHash?: string
  blockchainTx?: string
  fileUrl?: string
  institution: {
    name: string
  }
}

export default function EducationalPassport() {
  const [student, setStudent] = useState<Student | null>(null)
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([])
  const [athleticRecords, setAthleticRecords] = useState<AthleticRecord[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])

  // Load mock data immediately
  useEffect(() => {
    console.log('Component mounted, loading mock data')
    loadMockData()
  }, [])

  const loadMockData = () => {
    console.log('Loading mock data for student portal')
    const mockStudent: Student = {
      id: 'demo-student-001',
      name: "Alexandra Chen",
      studentId: "STU2024001",
      email: "alexandra.chen@university.edu",
      blockchainAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
      createdAt: "2020-09-01T00:00:00.000Z",
      updatedAt: "2024-01-15T00:00:00.000Z"
    }

    const mockAcademicRecords: AcademicRecord[] = [
      {
        id: '1',
        title: 'Bachelor of Science in Computer Science',
        degree: 'B.Sc. Computer Science',
        field: 'Computer Science',
        startDate: '2020-09-01',
        endDate: '2024-05-30',
        grade: 'A',
        gpa: 3.8,
        status: 'verified',
        blockchainHash: '0x1234567890abcdef',
        blockchainTx: '0xabcdef1234567890',
        institution: {
          name: 'Stanford University'
        }
      },
      {
        id: '2',
        title: 'Introduction to Artificial Intelligence',
        degree: 'Course Certificate',
        field: 'Artificial Intelligence',
        startDate: '2023-01-15',
        endDate: '2023-05-15',
        grade: 'A+',
        gpa: 4.0,
        status: 'verified',
        blockchainHash: '0x2345678901bcdef',
        blockchainTx: '0xbcdef12345678901',
        institution: {
          name: 'Stanford University'
        }
      }
    ]

    const mockAthleticRecords: AthleticRecord[] = [
      {
        id: '1',
        sport: 'Swimming',
        achievement: 'Gold Medal - 100m Freestyle',
        competition: 'NCAA Championships',
        date: '2023-03-15',
        position: '1st',
        record: '47.82 seconds',
        status: 'verified',
        blockchainHash: '0x3456789012cdefg',
        blockchainTx: '0xcdefg123456789012',
        institution: {
          name: 'Stanford University'
        }
      },
      {
        id: '2',
        sport: 'Swimming',
        achievement: 'Silver Medal - 200m Freestyle',
        competition: 'Pac-12 Championships',
        date: '2023-02-20',
        position: '2nd',
        record: '1:42.15 minutes',
        status: 'verified',
        blockchainHash: '0x4567890123defgh',
        blockchainTx: '0xdefgh1234567890123',
        institution: {
          name: 'Stanford University'
        }
      }
    ]

    const mockCertificates: Certificate[] = [
      {
        id: '1',
        title: 'Dean\'s List - Academic Excellence',
        issueDate: '2023-12-15',
        status: 'verified',
        blockchainHash: '0x5678901234efghi',
        blockchainTx: '0xefghi12345678901234',
        fileUrl: '/files/dean-list.pdf',
        institution: {
          name: 'Stanford University'
        }
      },
      {
        id: '2',
        title: 'Research Publication - Machine Learning',
        issueDate: '2023-10-20',
        status: 'verified',
        blockchainHash: '0x6789012345fghij',
        blockchainTx: '0xfghij123456789012345',
        fileUrl: '/files/research-ml.pdf',
        institution: {
          name: 'Stanford University'
        }
      }
    ]

    console.log('Setting mock student:', mockStudent)
    console.log('Setting mock academic records:', mockAcademicRecords.length)
    console.log('Setting mock athletic records:', mockAthleticRecords.length)
    console.log('Setting mock certificates:', mockCertificates.length)

    setStudent(mockStudent)
    setAcademicRecords(mockAcademicRecords)
    setAthleticRecords(mockAthleticRecords)
    setCertificates(mockCertificates)
    
    console.log('Mock data loaded successfully')
  }

  const createDemoStudent = async () => {
    try {
      const demoStudent = {
        name: "Alexandra Chen",
        email: "alexandra.chen@university.edu",
        studentId: "STU2024001",
        dateOfBirth: "2002-05-15"
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoStudent)
      })

      const result = await response.json()
      
      if (result.success) {
        setStudent(result.data)
      }
    } catch (error) {
      console.error('Error creating demo student:', error)
    }
  }

  const handleAcademicRecordAdded = (document?: any) => {
    loadMockData()
  }

  const handleShareProfile = () => {
    if (student) {
      const shareUrl = `${window.location.origin}?student=${student.studentId}`
      if (navigator.share) {
        navigator.share({
          title: `${student.name}'s Educational Passport`,
          text: `View ${student.name}'s verified educational records and achievements.`,
          url: shareUrl
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Profile link copied to clipboard!')
        })
      }
    }
  }

  const handleExportPDF = () => {
    if (student) {
      // Create a comprehensive report for PDF export
      const report = {
        student: {
          name: student.name,
          studentId: student.studentId,
          email: student.email,
          blockchainAddress: student.blockchainAddress,
          verificationScore: verificationScore
        },
        academicRecords: academicRecords,
        athleticRecords: athleticRecords,
        certificates: certificates,
        generatedAt: new Date().toLocaleString()
      }
      
      // Create and download JSON file (in real app, this would generate PDF)
      const dataStr = JSON.stringify(report, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `${student.name.replace(/\s+/g, '_')}_Educational_Passport_${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800", 
      rejected: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const calculateVerificationScore = () => {
    if (!student) return 0
    
    const totalRecords = academicRecords.length + athleticRecords.length + certificates.length
    if (totalRecords === 0) return 0
    
    const verifiedRecords = 
      academicRecords.filter(r => r.status === 'verified').length +
      athleticRecords.filter(r => r.status === 'verified').length +
      certificates.filter(r => r.status === 'verified').length
    
    // Base score from verified records (70% of total)
    const baseScore = Math.round((verifiedRecords / totalRecords) * 70)
    
    // Bonus points for having blockchain address (20% of total)
    const blockchainBonus = student.blockchainAddress ? 20 : 0
    
    // Bonus points for having diverse record types (10% of total)
    const hasAcademic = academicRecords.length > 0
    const hasAthletic = athleticRecords.length > 0
    const hasCertificates = certificates.length > 0
    const diversityCount = [hasAcademic, hasAthletic, hasCertificates].filter(Boolean).length
    const diversityBonus = Math.round((diversityCount / 3) * 10)
    
    return Math.min(100, baseScore + blockchainBonus + diversityBonus)
  }

  const verificationScore = calculateVerificationScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                  {student?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{student?.name || 'Student Name'}</h1>
                <p className="text-slate-600">Student ID: {student?.studentId || 'N/A'}</p>
                <p className="text-sm text-slate-500">{student?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Verification Score</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={verificationScore} className="w-24" />
                <span className="text-lg font-bold text-slate-900">{verificationScore}%</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Wallet:</span>
              <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                {student?.blockchainAddress ? 
                  `${student.blockchainAddress.slice(0, 6)}...${student.blockchainAddress.slice(-4)}` : 
                  'Not assigned'
                }
              </code>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleShareProfile}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="athletic" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Athletic
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Award className="h-4 w-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{academicRecords.length}</div>
                  <p className="text-blue-700 text-sm mt-1">Verified achievements</p>
                  <div className="mt-4 space-y-2">
                    {academicRecords.slice(0, 2).map((record) => (
                      <div key={record.id} className="flex items-center justify-between text-sm">
                        <span className="text-blue-800 truncate">{record.title}</span>
                        {getStatusIcon(record.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Athletic Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{athleticRecords.length}</div>
                  <p className="text-green-700 text-sm mt-1">Sports achievements</p>
                  <div className="mt-4 space-y-2">
                    {athleticRecords.slice(0, 2).map((record) => (
                      <div key={record.id} className="flex items-center justify-between text-sm">
                        <span className="text-green-800 truncate">{record.sport}</span>
                        {getStatusIcon(record.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-900 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{certificates.length}</div>
                  <p className="text-purple-700 text-sm mt-1">Official certificates</p>
                  <div className="mt-4 space-y-2">
                    {certificates.slice(0, 2).map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between text-sm">
                        <span className="text-purple-800 truncate">{cert.title}</span>
                        {getStatusIcon(cert.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates to your educational passport</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Welcome to Educational Passport System</p>
                      <p className="text-sm text-slate-600">System • Just now</p>
                    </div>
                    <Badge variant="outline">System</Badge>
                  </div>
                  {academicRecords.length === 0 && athleticRecords.length === 0 && certificates.length === 0 && (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No records yet. Start adding your achievements!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Academic Records</h2>
              {student && <AcademicRecordForm studentId={student.id} onSuccess={handleAcademicRecordAdded} />}
            </div>
            
            <div className="grid gap-4">
              {academicRecords.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Academic Records Yet</h3>
                    <p className="text-slate-600 mb-4">Start building your educational passport by adding your academic achievements.</p>
                    {student && <AcademicRecordForm studentId={student.id} onSuccess={handleAcademicRecordAdded} />}
                  </CardContent>
                </Card>
              ) : (
                academicRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{record.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <GraduationCap className="h-4 w-4" />
                            {record.institution?.name || 'Institution'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(record.status)}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Field of Study</p>
                          <p className="text-slate-900">{record.field || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Duration</p>
                          <p className="text-slate-900">
                            {new Date(record.startDate).toLocaleDateString()} - 
                            {record.endDate ? new Date(record.endDate).toLocaleDateString() : 'Present'}
                          </p>
                        </div>
                        {record.gpa && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">GPA</p>
                            <p className="text-slate-900 font-semibold">{record.gpa}/4.0</p>
                          </div>
                        )}
                        {record.grade && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">Grade</p>
                            <p className="text-slate-900 font-semibold">{record.grade}</p>
                          </div>
                        )}
                      </div>
                      
                      {record.blockchainHash && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Blockchain Verified</span>
                          </div>
                          <div className="mt-2 text-xs text-green-700">
                            <p>Hash: {record.blockchainHash.slice(0, 10)}...</p>
                            <p>Transaction: {record.blockchainTx?.slice(0, 10)}...</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="athletic" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Athletic Records</h2>
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add Record (Coming Soon)
              </Button>
            </div>
            
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Athletic Records Coming Soon</h3>
                <p className="text-slate-600">Track your athletic achievements and sports participation.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Certificates & Documents</h2>
              {student && (
                <div className="flex gap-2">
                  <DocumentUpload 
                    studentId={student.id} 
                    institutionId="demo-institution-001"
                    onUploadComplete={handleAcademicRecordAdded}
                  />
                  <Button disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certificate (Coming Soon)
                  </Button>
                </div>
              )}
            </div>
            
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Your Documents</h3>
                <p className="text-slate-600 mb-4">Upload certificates, transcripts, and other important documents to secure them on the blockchain.</p>
                {student && (
                  <DocumentUpload 
                    studentId={student.id} 
                    institutionId="demo-institution-001"
                    onUploadComplete={handleAcademicRecordAdded}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Document Upload & Management</h2>
                <p className="text-slate-600">Upload and secure your important documents on the blockchain</p>
              </div>
            </div>
            
            {student ? (
              <DocumentUpload 
                studentId={student.id} 
                institutionId="cmgsgi50s0000t4aqp3fmc343" 
                onUploadComplete={handleAcademicRecordAdded} 
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Upload className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Student Data</h3>
                  <p className="text-slate-600">Please wait while we load your profile...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}