'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Eye, 
  Mail, 
  Calendar,
  GraduationCap,
  Trophy,
  Award,
  MoreHorizontal,
  Download,
  MessageSquare,
  Settings,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  blockchainAddress: string
  createdAt: string
  academicRecords: any[]
  athleticRecords: any[]
  certificates: any[]
}

interface StudentManagementProps {
  institutionId: string
}

export function StudentManagement({ institutionId }: StudentManagementProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [institutionId])

  const fetchStudents = async () => {
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Alexandra Chen',
          email: 'alexandra.chen@stanford.edu',
          studentId: 'STU2024001',
          blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
          createdAt: '2020-09-01',
          academicRecords: [
            { title: 'Bachelor of Science in Computer Science', status: 'verified' },
            { title: 'Introduction to Artificial Intelligence', status: 'verified' }
          ],
          athleticRecords: [
            { sport: 'Swimming', achievement: 'Gold Medal - 100m Freestyle', status: 'verified' }
          ],
          certificates: [
            { title: 'Dean\'s List - Academic Excellence', status: 'verified' }
          ]
        },
        {
          id: '2',
          name: 'David Kim',
          email: 'david.kim@stanford.edu',
          studentId: 'STU2024004',
          blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
          createdAt: '2020-09-01',
          academicRecords: [
            { title: 'Bachelor of Science in Biology', status: 'verified' }
          ],
          athleticRecords: [
            { sport: 'Basketball', achievement: 'Pac-12 Championship Team', status: 'verified' }
          ],
          certificates: [
            { title: 'Research Publication', status: 'verified' }
          ]
        }
      ]
      
      setStudents(mockStudents)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalCredentials = (student: Student) => {
    return student.academicRecords.length + student.athleticRecords.length + student.certificates.length
  }

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student)
  }

  const handleSendMessage = (student: Student) => {
    // Open email client with pre-filled information
    const subject = encodeURIComponent(`Regarding ${student.name}'s Educational Records`)
    const body = encodeURIComponent(`Dear ${student.name},\n\nI am writing to you regarding your educational records at our institution.\n\nBest regards,\nInstitution Administration`)
    window.open(`mailto:${student.email}?subject=${subject}&body=${body}`)
  }

  const handleDownloadRecords = (student: Student) => {
    // Create a comprehensive report of all student records
    const report = {
      student: {
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        blockchainAddress: student.blockchainAddress,
        enrollmentDate: student.createdAt
      },
      academicRecords: student.academicRecords,
      athleticRecords: student.athleticRecords,
      certificates: student.certificates,
      generatedAt: new Date().toISOString()
    }
    
    // Create and download JSON file
    const dataStr = JSON.stringify(report, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${student.name.replace(/\s+/g, '_')}_Educational_Records_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleViewTranscript = (student: Student) => {
    // Navigate to student's transcript view (or open in new tab)
    const transcriptUrl = `/?student=${student.studentId}&view=transcript`
    window.open(transcriptUrl, '_blank')
  }

  const handleOpenBlockchainExplorer = (student: Student) => {
    // Open blockchain explorer with student's address
    if (student.blockchainAddress) {
      // Using Etherscan as example explorer (replace with appropriate blockchain)
      const explorerUrl = `https://etherscan.io/address/${student.blockchainAddress}`
      window.open(explorerUrl, '_blank')
    } else {
      alert('No blockchain address assigned to this student')
    }
  }

  const handleStudentSettings = (student: Student) => {
    // Navigate to student settings page
    const settingsUrl = `/institution/students/${student.id}/settings`
    window.location.href = settingsUrl
  }

  const handleCopyAddress = async (address: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address)
        console.log('Address copied to clipboard')
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = address
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        console.log('Address copied to clipboard (fallback)')
      }
    } catch (err) {
      console.error('Failed to copy address:', err)
      // Optionally show a toast notification here
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Students List */}
      <div className="space-y-4">
        {students.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">
                No students are currently enrolled
              </p>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {student.studentId}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Since {new Date(student.createdAt).getFullYear()}
                        </div>
                      </div>

                      {/* Credential Summary */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-700">
                            {student.academicRecords.length} Academic
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">
                            {student.athleticRecords.length} Athletic
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-700">
                            {student.certificates.length} Certificates
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {getTotalCredentials(student)}
                      </div>
                      <div className="text-xs text-gray-500">Total Credentials</div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xl font-bold">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.studentId}</div>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            Complete student profile and credential overview
                          </DialogDescription>
                        </DialogHeader>
                        
                        <ScrollArea className="max-h-[calc(90vh-10rem)]">
                          <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{student.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Enrolled {new Date(student.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-sm font-mono">{student.blockchainAddress.slice(0, 10)}...{student.blockchainAddress.slice(-6)}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleCopyAddress(student.blockchainAddress)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Credential Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                      <div className="text-2xl font-bold text-blue-600">{student.academicRecords.length}</div>
                                      <div className="text-xs text-gray-600">Academic</div>
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold text-green-600">{student.athleticRecords.length}</div>
                                      <div className="text-xs text-gray-600">Athletic</div>
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold text-purple-600">{student.certificates.length}</div>
                                      <div className="text-xs text-gray-600">Certificates</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Academic Records */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <GraduationCap className="h-5 w-5 text-blue-500" />
                                  Academic Records
                                  <Badge variant="secondary">{student.academicRecords.length}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {student.academicRecords.map((record, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <div className="font-medium text-sm">{record.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">Academic Achievement</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(record.status)}
                                        <span className="text-xs text-gray-600 capitalize">{record.status}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Athletic Records */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Trophy className="h-5 w-5 text-green-500" />
                                  Athletic Records
                                  <Badge variant="secondary">{student.athleticRecords.length}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {student.athleticRecords.map((record, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <div className="font-medium text-sm">{record.achievement}</div>
                                        <div className="text-xs text-gray-500 mt-1">{record.sport}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(record.status)}
                                        <span className="text-xs text-gray-600 capitalize">{record.status}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Certificates */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Award className="h-5 w-5 text-purple-500" />
                                  Certificates
                                  <Badge variant="secondary">{student.certificates.length}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {student.certificates.map((cert, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <div className="font-medium text-sm">{cert.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">Certificate Achievement</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(cert.status)}
                                        <span className="text-xs text-gray-600 capitalize">{cert.status}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendMessage(student)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadRecords(student)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Records
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewTranscript(student)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Transcript
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenBlockchainExplorer(student)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Blockchain Explorer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStudentSettings(student)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Student Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Recent Credentials Preview */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Recent Credentials:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.academicRecords.slice(0, 2).map((record, idx) => (
                      <Badge key={`academic-${idx}`} variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {record.title}
                      </Badge>
                    ))}
                    {student.athleticRecords.slice(0, 1).map((record, idx) => (
                      <Badge key={`athletic-${idx}`} variant="secondary" className="text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        {record.achievement}
                      </Badge>
                    ))}
                    {student.certificates.slice(0, 1).map((cert, idx) => (
                      <Badge key={`cert-${idx}`} variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {students.reduce((sum, s) => sum + s.academicRecords.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Academic Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {students.reduce((sum, s) => sum + s.athleticRecords.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Athletic Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {students.reduce((sum, s) => sum + s.certificates.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}