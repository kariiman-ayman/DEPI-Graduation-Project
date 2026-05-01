import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: "147",
      change: "+3.2%",
      trend: "up",
      icon: BookOpen,
      color: "bg-indigo-500",
    },
    {
      title: "Total Revenue",
      value: "$847,290",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Avg. Attendance",
      value: "87.3%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const enrollmentData = [
    { month: "Jan", students: 2400 },
    { month: "Feb", students: 2520 },
    { month: "Mar", students: 2680 },
    { month: "Apr", students: 2720 },
    { month: "May", students: 2780 },
    { month: "Jun", students: 2847 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 120000 },
    { month: "Feb", revenue: 135000 },
    { month: "Mar", revenue: 142000 },
    { month: "Apr", revenue: 138000 },
    { month: "May", revenue: 155000 },
    { month: "Jun", revenue: 157000 },
  ];

  const departmentData = [
    { name: "Engineering", value: 890, color: "#3b82f6" },
    { name: "Business", value: 720, color: "#6366f1" },
    { name: "Sciences", value: 650, color: "#8b5cf6" },
    { name: "Arts", value: 387, color: "#a855f7" },
    { name: "Medicine", value: 200, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {departmentData.map((dept) => (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-sm text-gray-700">{dept.name}</span>
                    </div>
                    <span className="text-sm">{dept.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Sarah Williams",
                  course: "Computer Science",
                  time: "2 hours ago",
                },
                {
                  name: "James Chen",
                  course: "Business Analytics",
                  time: "5 hours ago",
                },
                {
                  name: "Maria Garcia",
                  course: "Data Science",
                  time: "1 day ago",
                },
                {
                  name: "David Kim",
                  course: "Software Engineering",
                  time: "1 day ago",
                },
                { name: "Emma Brown", course: "Marketing", time: "2 days ago" },
              ].map((enrollment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-sm">
                        {enrollment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm">{enrollment.name}</p>
                      <p className="text-xs text-gray-500">
                        {enrollment.course}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {enrollment.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
