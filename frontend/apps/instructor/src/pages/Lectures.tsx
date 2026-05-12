import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import { Calendar, Clock, Eye, Upload, Video } from "lucide-react";
import { useState } from "react";
import { UploadModal } from "../components/UploadModal";
import { useCourses } from "../hooks/useCourses";

export default function InstructorLectures() {
  const [selectedCourse, setSelectedCourse] = useState("CS401");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: courses } = useCourses();

  if (!courses) return <div>Loading...</div>;

  const lectures = [
    {
      id: 1,
      title: "Introduction to Binary Trees",
      course: "CS401",
      duration: "1:45:30",
      uploadDate: "2026-02-18",
      views: 42,
      size: "245 MB",
      status: "Published",
    },
    {
      id: 2,
      title: "AVL Trees and Balancing",
      course: "CS401",
      duration: "2:10:15",
      uploadDate: "2026-02-15",
      views: 45,
      size: "312 MB",
      status: "Published",
    },
    {
      id: 3,
      title: "Graph Algorithms - DFS & BFS",
      course: "CS401",
      duration: "1:55:45",
      uploadDate: "2026-02-12",
      views: 45,
      size: "278 MB",
      status: "Published",
    },
    {
      id: 4,
      title: "Dynamic Programming Fundamentals",
      course: "CS401",
      duration: "2:20:00",
      uploadDate: "2026-02-10",
      views: 43,
      size: "335 MB",
      status: "Published",
    },
    {
      id: 5,
      title: "Hash Tables and Collision Resolution",
      course: "CS401",
      duration: "1:38:22",
      uploadDate: "2026-02-08",
      views: 44,
      size: "198 MB",
      status: "Published",
    },
  ];

  const stats = [
    { label: "Total Videos", value: "24", icon: Video, color: "bg-blue-500" },
    { label: "Total Views", value: "1,047", icon: Eye, color: "bg-green-500" },
    {
      label: "Total Duration",
      value: "42h 15m",
      icon: Clock,
      color: "bg-purple-500",
    },
    { label: "This Week", value: "3", icon: Calendar, color: "bg-indigo-500" },
  ];

  return (
    <>
      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courses={courses}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl">Lecture Recordings</h3>
            <p className="text-sm text-gray-500">
              Upload and manage recorded lectures
            </p>
          </div>
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setModalOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Upload New Lecture
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Lectures</CardTitle>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.id} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="mb-1">{lecture.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{lecture.duration}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{lecture.views} views</span>
                            </div>
                            <span>•</span>
                            <span>{lecture.size}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {lecture.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">
                          Uploaded on{" "}
                          {new Date(lecture.uploadDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              {[
                "Supported formats: MP4, MOV, AVI (Max size: 2GB)",
                "Recommended resolution: 1080p or higher",
                "Add clear titles and descriptions for better student engagement",
                "Videos are automatically transcoded for optimal streaming",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
