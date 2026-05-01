import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminReports() {
  const attendanceData = [
    { week: "Week 1", rate: 92 },
    { week: "Week 2", rate: 89 },
    { week: "Week 3", rate: 91 },
    { week: "Week 4", rate: 87 },
    { week: "Week 5", rate: 88 },
    { week: "Week 6", rate: 90 },
  ];

  const performanceData = [
    { semester: "Fall 2023", avgGpa: 3.45 },
    { semester: "Spring 2024", avgGpa: 3.52 },
    { semester: "Summer 2024", avgGpa: 3.48 },
    { semester: "Fall 2024", avgGpa: 3.58 },
    { semester: "Spring 2025", avgGpa: 3.61 },
    { semester: "Summer 2025", avgGpa: 3.65 },
  ];

  const financialData = [
    { quarter: "Q1", tuition: 185000, expenses: 120000, net: 65000 },
    { quarter: "Q2", tuition: 192000, expenses: 125000, net: 67000 },
    { quarter: "Q3", tuition: 178000, expenses: 115000, net: 63000 },
    { quarter: "Q4", tuition: 195000, expenses: 130000, net: 65000 },
  ];

  const departmentPerformance = [
    { department: "Engineering", students: 890, avgGpa: 3.52, retention: 94 },
    { department: "Business", students: 720, avgGpa: 3.61, retention: 92 },
    { department: "Sciences", students: 650, avgGpa: 3.58, retention: 91 },
    { department: "Arts", students: 387, avgGpa: 3.65, retention: 89 },
    { department: "Medicine", students: 200, avgGpa: 3.71, retention: 96 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Reports & Analytics</h3>
          <p className="text-sm text-gray-500">
            Comprehensive insights and data analysis
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export All Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl">92.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg GPA</p>
                <p className="text-2xl">3.65</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Completion</p>
                <p className="text-2xl">88.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-2xl">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[80, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="semester" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[3.0, 4.0]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgGpa"
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tuition" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="expenses"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar dataKey="net" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentPerformance.map((dept) => (
                  <div
                    key={dept.department}
                    className="border-b pb-6 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg">{dept.department}</h4>
                      <span className="text-sm text-gray-500">
                        {dept.students} students
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          Average GPA
                        </p>
                        <p className="text-xl text-green-600">
                          {dept.avgGpa.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          Retention Rate
                        </p>
                        <p className="text-xl text-blue-600">
                          {dept.retention}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Enrollment</p>
                        <p className="text-xl text-indigo-600">
                          {dept.students}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
