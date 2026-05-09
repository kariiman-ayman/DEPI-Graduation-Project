import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import { Video, Play, Clock, Eye, Download, BookOpen } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "_core/components/ui/dialog";
import { useState } from "react";

export default function StudentLectures() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const lectures = [
    {
      id: 1,
      course: "CS401",
      courseName: "Advanced Data Structures",
      title: "Introduction to Binary Trees",
      instructor: "Dr. Johnson",
      duration: "1:45:30",
      uploadDate: "2026-02-18",
      views: 42,
      watched: true,
      watchProgress: 100,
      thumbnail:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
    },
    {
      id: 2,
      course: "CS401",
      courseName: "Advanced Data Structures",
      title: "AVL Trees and Balancing",
      instructor: "Dr. Johnson",
      duration: "2:10:15",
      uploadDate: "2026-02-15",
      views: 45,
      watched: true,
      watchProgress: 65,
      thumbnail:
        "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=225&fit=crop",
    },
    {
      id: 3,
      course: "CS401",
      courseName: "Advanced Data Structures",
      title: "Graph Algorithms - DFS & BFS",
      instructor: "Dr. Johnson",
      duration: "1:55:45",
      uploadDate: "2026-02-12",
      views: 45,
      watched: false,
      watchProgress: 0,
      thumbnail:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=225&fit=crop",
    },
    {
      id: 4,
      course: "CS301",
      courseName: "Database Systems",
      title: "SQL Joins and Optimization",
      instructor: "Prof. Chen",
      duration: "2:05:20",
      uploadDate: "2026-02-17",
      views: 38,
      watched: true,
      watchProgress: 100,
      thumbnail:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=225&fit=crop",
    },
    {
      id: 5,
      course: "CS301",
      courseName: "Database Systems",
      title: "Database Normalization",
      instructor: "Prof. Chen",
      duration: "1:50:10",
      uploadDate: "2026-02-14",
      views: 36,
      watched: true,
      watchProgress: 40,
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    },
    {
      id: 6,
      course: "BUS201",
      courseName: "Business Analytics",
      title: "Data Visualization Techniques",
      instructor: "Dr. Davis",
      duration: "1:35:45",
      uploadDate: "2026-02-16",
      views: 40,
      watched: false,
      watchProgress: 0,
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    },
  ];

  const filteredLectures =
    selectedCourse === "all"
      ? lectures
      : lectures.filter((lecture) => lecture.course === selectedCourse);

  const handleWatchLecture = (lecture) => {
    setSelectedLecture(lecture);
    setIsVideoOpen(true);
  };

  const courses = [
    { id: "all", name: "All Courses" },
    { id: "CS401", name: "CS401 - Advanced Data Structures" },
    { id: "CS301", name: "CS301 - Database Systems" },
    { id: "BUS201", name: "BUS201 - Business Analytics" },
  ];

  const stats = [
    {
      label: "Total Lectures",
      value: lectures.length.toString(),
      icon: Video,
      color: "bg-blue-500",
    },
    {
      label: "Watched",
      value: lectures.filter((l) => l.watched).length.toString(),
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: lectures
        .filter((l) => l.watchProgress > 0 && l.watchProgress < 100)
        .length.toString(),
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      label: "Not Started",
      value: lectures.filter((l) => l.watchProgress === 0).length.toString(),
      icon: BookOpen,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Recorded Lectures</h3>
          <p className="text-sm text-gray-500">
            Access course lectures and materials
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Lectures</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="continue">Continue Watching</TabsTrigger>
          </TabsList>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures.map((lecture) => (
              <Card
                key={lecture.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={lecture.thumbnail}
                    alt={lecture.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white hover:bg-gray-100"
                    >
                      <Play className="w-8 h-8 text-indigo-600" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    {lecture.duration}
                  </div>
                  {lecture.watched && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="mb-2">
                    <Badge variant="outline">{lecture.course}</Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">
                    {lecture.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{lecture.instructor}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  {lecture.watchProgress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{lecture.watchProgress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${lecture.watchProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{lecture.views} views</span>
                    </div>
                    <span>
                      {new Date(lecture.uploadDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleWatchLecture(lecture)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {lecture.watchProgress > 0 && lecture.watchProgress < 100
                        ? "Continue"
                        : "Watch"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures
              .sort(
                (a, b) =>
                  new Date(b.uploadDate).getTime() -
                  new Date(a.uploadDate).getTime(),
              )
              .slice(0, 6)
              .map((lecture) => (
                <Card
                  key={lecture.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white hover:bg-gray-100"
                      >
                        <Play className="w-8 h-8 text-indigo-600" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                      {lecture.duration}
                    </div>
                    <Badge className="absolute top-2 left-2 bg-blue-600">
                      New
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="mb-2">
                      <Badge variant="outline">{lecture.course}</Badge>
                    </div>
                    <CardTitle className="text-base leading-tight">
                      {lecture.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {lecture.instructor}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleWatchLecture(lecture)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="continue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures
              .filter((l) => l.watchProgress > 0 && l.watchProgress < 100)
              .map((lecture) => (
                <Card
                  key={lecture.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white hover:bg-gray-100"
                      >
                        <Play className="w-8 h-8 text-indigo-600" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                      {lecture.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="mb-2">
                      <Badge variant="outline">{lecture.course}</Badge>
                    </div>
                    <CardTitle className="text-base leading-tight">
                      {lecture.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {lecture.instructor}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{lecture.watchProgress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${lecture.watchProgress}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleWatchLecture(lecture)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Watching
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
          {filteredLectures.filter(
            (l) => l.watchProgress > 0 && l.watchProgress < 100,
          ).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No lectures in progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedLecture?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                poster={selectedLecture?.thumbnail}
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Instructor: {selectedLecture?.instructor}</span>
                <span>Duration: {selectedLecture?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{selectedLecture?.views} views</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
