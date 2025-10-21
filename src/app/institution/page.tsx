'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Users, 
  Award, 
  GraduationCap, 
  Trophy, 
  Shield, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  FileText
} from 'lucide-react'
import { CredentialIssuanceForm } from '@/components/institution/credential-issuance-form'
import { InstitutionAnalytics } from '@/components/institution/institution-analytics'
import { StudentManagement } from '@/components/institution/student-management'

interface Institution {
  id: string
  name: string
  type: string
  address: string
  blockchainAddress: string
  verified: boolean
  createdAt: string
  updatedAt: string
}

interface CredentialStats {
  total: number
  academic: number
  athletic: number
  certificates: number
  pending: number
  verified: number
}

export default function InstitutionDashboard() {
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [stats, setStats] = useState<CredentialStats>({
    total: 0,
    academic: 0,
    athletic: 0,
    certificates: 0,
    pending: 0,
    verified: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstitutionData()
  }, [])

  const fetchInstitutionData = async () => {
    try {
      // For demo, using Stanford University
      const institutionName = 'Stanford University'
      
      const response = await fetch(`/api/institutions?name=${encodeURIComponent(institutionName)}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setInstitution(result.data)
        await fetchStats(result.data.id)
      }
    } catch (error) {
      console.error('Error fetching institution data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (institutionId: string) => {
    try {
      const [academicRes, athleticRes, certificatesRes] = await Promise.all([
        fetch(`/api/academic-records?institutionId=${institutionId}`),
        fetch(`/api/athletic-records?institutionId=${institutionId}`),
        fetch(`/api/certificates?institutionId=${institutionId}`)
      ])

      const [academicData, athleticData, certificatesData] = await Promise.all([
        academicRes.json(),
        athleticRes.json(),
        certificatesRes.json()
      ])

      const academic = academicData.success ? academicData.data.length : 0
      const athletic = athleticData.success ? athleticData.data.length : 0
      const certificates = certificatesData.success ? certificatesData.data.length : 0
      const total = academic + athletic + certificates

      setStats({
        total,
        academic,
        athletic,
        certificates,
        pending: Math.floor(total * 0.1), // Mock pending count
        verified: Math.floor(total * 0.9) // Mock verified count
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCredentialIssued = () => {
    fetchStats(institution?.id || '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Institution Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                  {institution?.name?.split(' ').map(n => n[0]).join('') || 'IN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{institution?.name || 'Institution Name'}</h1>
                <p className="text-slate-600 capitalize">{institution?.type || 'Institution Type'}</p>
                <p className="text-sm text-slate-500">{institution?.address || 'Address'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Verified Institution</span>
              </div>
              <Badge className={institution?.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {institution?.verified ? 'Verified' : 'Pending'}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Blockchain:</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {institution?.blockchainAddress ? 
                    `${institution.blockchainAddress.slice(0, 6)}...${institution.blockchainAddress.slice(-4)}` : 
                    'Not assigned'
                  }
                </code>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Blockchain Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Member since:</span>
              <span className="font-medium">
                {institution?.createdAt ? new Date(institution.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Total Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-blue-700 text-sm mt-1">All issued credentials</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.academic}</div>
              <p className="text-green-700 text-sm mt-1">Degrees and courses</p>
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
              <div className="text-3xl font-bold text-purple-900">{stats.certificates}</div>
              <p className="text-purple-700 text-sm mt-1">Achievements and awards</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Athletic Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.athletic}</div>
              <p className="text-emerald-700 text-sm mt-1">Sports achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="issue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="issue" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Issue Credential
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issue" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Issue New Credential</h2>
                <p className="text-slate-600">Create and issue blockchain-verified credentials to students</p>
              </div>
            </div>
            
            {institution && (
              <CredentialIssuanceForm 
                institutionId={institution.id} 
                onSuccess={handleCredentialIssued}
              />
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Student Management</h2>
                <p className="text-slate-600">View and manage student records</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            {institution && <StudentManagement institutionId={institution.id} />}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Institution Analytics</h2>
                <p className="text-slate-600">Insights into credential issuance and verification</p>
              </div>
            </div>
            
            {institution && <InstitutionAnalytics institutionId={institution.id} />}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Manage Credentials</h2>
                <p className="text-slate-600">View, edit, and manage all issued credentials</p>
              </div>
            </div>
            
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Credential Management</h3>
                <p className="text-slate-600 mb-4">Browse and manage all credentials issued by your institution.</p>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Credentials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}