import { useRef, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import { Skeleton } from "_core/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "_core/components/ui/dialog";
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
import { Video, Play, Clock, Eye, BookOpen } from "lucide-react";
import { useLectures } from "../hooks/useLectures.js";
import { saveProgress } from "../api/lectures.js";
import type { Lecture } from "../types/lecture.types.js";

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function LectureCard({
  lecture,
  showNewBadge,
  onWatch,
}: {
  lecture: Lecture;
  showNewBadge?: boolean;
  onWatch: (lecture: Lecture) => void;
}) {
  const completed = lecture.watchProgress >= 90;
  const inProgress = lecture.watchProgress > 0 && !completed;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => onWatch(lecture)}
          >
            <Play className="w-8 h-8 text-indigo-600" />
          </Button>
        </div>
        {lecture.duration != null && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
            {formatDuration(lecture.duration)}
          </div>
        )}
        {completed && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Eye className="w-4 h-4 text-white" />
          </div>
        )}
        {showNewBadge && (
          <Badge className="absolute top-2 left-2 bg-blue-600">New</Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="mb-2">
          <Badge variant="outline">{lecture.courseName}</Badge>
        </div>
        <CardTitle className="text-base leading-tight">
          {lecture.title}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {lecture.instructorName}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {lecture.watchProgress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{lecture.watchProgress}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(lecture.watchProgress, 100)}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span />
          {lecture.createdAt && (
            <span>
              {new Date(lecture.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onWatch(lecture)}
        >
          <Play className="w-4 h-4 mr-2" />
          {inProgress ? "Continue" : "Watch"}
        </Button>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

function VideoPlayerDialog({
  lecture,
  open,
  onOpenChange,
}: {
  lecture: Lecture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaveTime = useRef<number>(0);

  const handleTimeUpdate = useCallback(() => {
    if (!lecture || !videoRef.current) return;
    const video = videoRef.current;
    const now = Date.now();
    if (now - lastSaveTime.current < 10000) return;
    lastSaveTime.current = now;
    const progress = video.duration
      ? Math.round((video.currentTime / video.duration) * 100)
      : 0;
    saveProgress(lecture.id, progress, Math.floor(video.currentTime));
  }, [lecture]);

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && lecture && videoRef.current) {
        const video = videoRef.current;
        const progress = video.duration
          ? Math.round((video.currentTime / video.duration) * 100)
          : 0;
        saveProgress(lecture.id, progress, Math.floor(video.currentTime));
      }
      onOpenChange(nextOpen);
    },
    [lecture, onOpenChange],
  );

  if (!lecture) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{lecture.title}</DialogTitle>
        </DialogHeader>
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full rounded-lg"
          src={lecture.videoUrl}
          onTimeUpdate={handleTimeUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function StudentLectures() {
  const { data: lectures = [], isLoading } = useLectures();
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const handleWatch = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setPlayerOpen(true);
  };

  const uniqueCourses = Array.from(
    new Map(lectures.map((l) => [l.courseId, l.courseName])).entries(),
  );

  const filtered =
    selectedCourse === "all"
      ? lectures
      : lectures.filter((l) => l.courseId === selectedCourse);

  const recentLectures = [...filtered]
    .sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 6);

  const continueLectures = filtered.filter(
    (l) => l.watchProgress > 0 && l.watchProgress < 90,
  );

  const stats = [
    {
      label: "Total Lectures",
      value: lectures.length,
      icon: Video,
      color: "bg-blue-500",
    },
    {
      label: "Watched",
      value: lectures.filter((l) => l.watchProgress >= 90).length,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: lectures.filter((l) => l.watchProgress > 0 && l.watchProgress < 90)
        .length,
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      label: "Not Started",
      value: lectures.filter((l) => l.watchProgress === 0).length,
      icon: BookOpen,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Recorded Lectures</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Access course lectures and materials
          </p>
        </div>
      </div>

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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl">{isLoading ? "—" : stat.value}</p>
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
              <SelectItem value="all">All Courses</SelectItem>
              {uniqueCourses.map(([courseId, courseName]) => (
                <SelectItem key={courseId} value={courseId}>
                  {courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No lectures available
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  onWatch={handleWatch}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recentLectures.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No lectures available
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentLectures.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  showNewBadge
                  onWatch={handleWatch}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="continue" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : continueLectures.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No lectures in progress
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLectures.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  onWatch={handleWatch}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <VideoPlayerDialog
        lecture={selectedLecture}
        open={playerOpen}
        onOpenChange={setPlayerOpen}
      />
    </div>
  );
}
