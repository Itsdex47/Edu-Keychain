'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Trophy, 
  Award,
  Calendar,
  Shield,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react'

interface InstitutionAnalyticsProps {
  institutionId: string
}

interface AnalyticsData {
  totalCredentials: number
  monthlyIssuance: number[]
  credentialTypes: {
    academic: number
    athletic: number
    certificates: number
  }
  verificationStats: {
    total: number
    successful: number
    pending: number
    failed: number
  }
  topPrograms: Array<{
    name: string
    count: number
    percentage: number
  }>
}

export function InstitutionAnalytics({ institutionId }: InstitutionAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [institutionId])

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data - in real app, this would fetch from API
      const mockAnalytics: AnalyticsData = {
        totalCredentials: 24,
        monthlyIssuance: [3, 5, 2, 8, 4, 6, 3, 7, 5, 9, 4, 6],
        credentialTypes: {
          academic: 12,
          athletic: 6,
          certificates: 6
        },
        verificationStats: {
          total: 156,
          successful: 142,
          pending: 8,
          failed: 6
        },
        topPrograms: [
          { name: 'Computer Science', count: 8, percentage: 33 },
          { name: 'Biology', count: 5, percentage: 21 },
          { name: 'Economics', count: 4, percentage: 17 },
          { name: 'Mathematics', count: 3, percentage: 13 },
          { name: 'Engineering', count: 4, percentage: 16 }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const verificationSuccessRate = (analytics.verificationStats.successful / analytics.verificationStats.total) * 100

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCredentials}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Issuance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyIssuance[analytics.monthlyIssuance.length - 1]}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.verificationStats.successful}/{analytics.verificationStats.total} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +201 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credential Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Credential Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of credentials by type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Academic Records</span>
                </div>
                <span className="text-sm font-bold">{analytics.credentialTypes.academic}</span>
              </div>
              <Progress 
                value={(analytics.credentialTypes.academic / analytics.totalCredentials) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Athletic Records</span>
                </div>
                <span className="text-sm font-bold">{analytics.credentialTypes.athletic}</span>
              </div>
              <Progress 
                value={(analytics.credentialTypes.athletic / analytics.totalCredentials) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Certificates</span>
                </div>
                <span className="text-sm font-bold">{analytics.credentialTypes.certificates}</span>
              </div>
              <Progress 
                value={(analytics.credentialTypes.certificates / analytics.totalCredentials) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Statistics
            </CardTitle>
            <CardDescription>
              Real-time verification performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {analytics.verificationStats.successful}
                </div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">
                  {analytics.verificationStats.pending}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">{verificationSuccessRate.toFixed(1)}%</span>
              </div>
              <Progress value={verificationSuccessRate} className="h-2" />
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {analytics.verificationStats.total}
              </div>
              <div className="text-sm text-gray-600">Total Verifications</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Top Programs by Credential Count
          </CardTitle>
          <CardDescription>
            Most active programs in credential issuance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPrograms.map((program, index) => (
              <div key={program.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{program.name}</div>
                    <div className="text-sm text-gray-500">{program.count} credentials</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <Progress value={program.percentage} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {program.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest credential issuance and verification activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-blue-900">New academic credential issued</p>
                <p className="text-sm text-blue-700">Bachelor of Science in Computer Science - Alexandra Chen</p>
              </div>
              <Badge variant="outline" className="text-blue-700">2 minutes ago</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-green-900">Credential verified by employer</p>
                <p className="text-sm text-green-700">TechCorp Inc. verified David Kim's academic records</p>
              </div>
              <Badge variant="outline" className="text-green-700">15 minutes ago</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-purple-900">Certificate issued</p>
                <p className="text-sm text-purple-700">Dean's List - Academic Excellence for Emma Thompson</p>
              </div>
              <Badge variant="outline" className="text-purple-700">1 hour ago</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">System maintenance completed</p>
                <p className="text-sm text-gray-700">Blockchain nodes synchronized successfully</p>
              </div>
              <Badge variant="outline" className="text-gray-700">2 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}