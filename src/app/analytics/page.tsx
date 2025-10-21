import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Shield, Users } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive insights into your educational passport ecosystem. Monitor performance, track trends, and optimize verification processes.
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Student Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track student enrollment and engagement metrics across the platform.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Record Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor academic, athletic, and certificate record creation patterns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Blockchain Health</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time blockchain performance and verification statistics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-lg">Institution Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analyze institution performance and verification patterns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  )
}