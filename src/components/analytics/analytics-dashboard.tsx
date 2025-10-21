'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  Trophy, 
  Award, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalStudents: number
    totalRecords: number
    totalVerifications: number
    verificationSuccessRate: number
  }
  recordDistribution: {
    academic: number
    athletic: number
    certificates: number
  }
  verificationStats: {
    verified: number
    pending: number
    rejected: number
    successRate: number
  }
  blockchainStats: {
    totalBlocks: number
    verifiedRecords: number
    pendingRecords: number
    averageVerificationTime: string
  }
  topInstitutions: Array<{
    id: string
    name: string
    type: string
    totalRecords: number
    verified: boolean
  }>
  monthlyTrends: any[]
  studentStats: Array<{
    id: string
    name: string
    email: string
    verificationScore: number
    recordCounts: {
      academic: number
      athletic: number
      certificates: number
    }
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Failed to load analytics data</p>
      </div>
    )
  }

  const recordDistributionData = [
    { name: 'Academic', value: data.recordDistribution.academic, color: '#3b82f6' },
    { name: 'Athletic', value: data.recordDistribution.athletic, color: '#10b981' },
    { name: 'Certificates', value: data.recordDistribution.certificates, color: '#8b5cf6' }
  ]

  const verificationData = [
    { name: 'Verified', value: data.verificationStats.verified, color: '#10b981' },
    { name: 'Pending', value: data.verificationStats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: data.verificationStats.rejected, color: '#ef4444' }
  ]

  const monthlyData = [
    { month: 'Jan', students: 45, records: 120 },
    { month: 'Feb', students: 52, records: 145 },
    { month: 'Mar', students: 61, records: 168 },
    { month: 'Apr', students: 73, records: 195 },
    { month: 'May', students: 89, records: 234 },
    { month: 'Jun', students: 105, records: 278 }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{data.overview.totalStudents}</div>
            <p className="text-blue-700 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{data.overview.totalRecords}</div>
            <p className="text-green-700 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{data.overview.totalVerifications}</div>
            <p className="text-purple-700 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{data.overview.verificationSuccessRate}%</div>
            <p className="text-emerald-700 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Distribution</CardTitle>
                <CardDescription>Breakdown of record types in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.value}</div>
                        <div className="text-sm text-slate-600">
                          {Math.round((item.value / data.overview.totalRecords) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Current verification status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.value}</div>
                        <div className="text-sm text-slate-600">
                          {data.verificationStats.verified > 0 ? 
                            Math.round((item.value / data.verificationStats.verified) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Monthly growth in students and records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-slate-600">
                        {month.students} students, {month.records} records
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-600">Students</span>
                          <span className="text-xs">{month.students}</span>
                        </div>
                        <Progress value={(month.students / 150) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-600">Records</span>
                          <span className="text-xs">{month.records}</span>
                        </div>
                        <Progress value={(month.records / 300) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Academic Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{data.recordDistribution.academic}</div>
                <Progress value={(data.recordDistribution.academic / data.overview.totalRecords) * 100} className="mt-3" />
                <p className="text-sm text-slate-600 mt-2">
                  {Math.round((data.recordDistribution.academic / data.overview.totalRecords) * 100)}% of total records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Athletic Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{data.recordDistribution.athletic}</div>
                <Progress value={(data.recordDistribution.athletic / data.overview.totalRecords) * 100} className="mt-3" />
                <p className="text-sm text-slate-600 mt-2">
                  {Math.round((data.recordDistribution.athletic / data.overview.totalRecords) * 100)}% of total records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{data.recordDistribution.certificates}</div>
                <Progress value={(data.recordDistribution.certificates / data.overview.totalRecords) * 100} className="mt-3" />
                <p className="text-sm text-slate-600 mt-2">
                  {Math.round((data.recordDistribution.certificates / data.overview.totalRecords) * 100)}% of total records
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Students by Verification Score</CardTitle>
              <CardDescription>Students with highest verification scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.studentStats.slice(0, 10).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{student.verificationScore}%</div>
                      <div className="text-xs text-slate-600">
                        {student.recordCounts.academic + student.recordCounts.athletic + student.recordCounts.certificates} records
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Total Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{data.blockchainStats.totalBlocks}</div>
                <p className="text-sm text-slate-600 mt-2">Records on blockchain</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Verified Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{data.blockchainStats.verifiedRecords}</div>
                <p className="text-sm text-slate-600 mt-2">Successfully verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">{data.blockchainStats.pendingRecords}</div>
                <p className="text-sm text-slate-600 mt-2">Awaiting verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Avg. Verification Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{data.blockchainStats.averageVerificationTime}</div>
                <p className="text-sm text-slate-600 mt-2">Per record</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Health</CardTitle>
              <CardDescription>System performance and integrity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Chain Integrity</span>
                      <span className="text-sm text-slate-600">100%</span>
                    </div>
                    <Progress value={100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Verification Success Rate</span>
                      <span className="text-sm text-slate-600">{data.verificationStats.successRate}%</span>
                    </div>
                    <Progress value={data.verificationStats.successRate} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Network Uptime</span>
                      <span className="text-sm text-slate-600">99.9%</span>
                    </div>
                    <Progress value={99.9} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Block Confirmation Rate</span>
                      <span className="text-sm text-slate-600">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Institutions</CardTitle>
              <CardDescription>Institutions with most verified records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topInstitutions.map((institution, index) => (
                  <div key={institution.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{institution.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{institution.type}</Badge>
                          {institution.verified && (
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{institution.totalRecords}</div>
                      <div className="text-sm text-slate-600">Total Records</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}