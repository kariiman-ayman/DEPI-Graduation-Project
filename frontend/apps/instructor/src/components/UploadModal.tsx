import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "_core/components/ui/select";
import { Button } from "_core/components/ui/button";
import {
  Upload,
  X,
  CheckCircle,
  FileVideo,
  Video,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useUploadLecture } from "../hooks/useLectures";
import type { CoursesList } from "../types/course.types";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  courses: CoursesList[];
}

type UploadState = "idle" | "uploading" | "success" | "error";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported format. Please upload MP4, MOV, or AVI.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "File exceeds the 2GB size limit.";
  }
  return null;
}

export function UploadModal({ open, onClose, courses }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync } = useUploadLecture();

  const handleFileSelect = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setErrorMessage(err);
      setVideoFile(null);
    } else {
      setErrorMessage("");
      setVideoFile(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!title.trim() || !courseId || !videoFile) return;

    setUploadState("uploading");
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 12;
        });
      }, 300);

      await mutateAsync({
        title,
        courseId,
        video: videoFile,
      }).finally(() => clearInterval(progressInterval));

      setUploadProgress(100);
      setUploadState("success");
    } catch (err) {
      setUploadState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    }
  };

  const handleClose = () => {
    setTitle("");
    setCourseId("");
    setVideoFile(null);
    setDragging(false);
    setUploadState("idle");
    setUploadProgress(0);
    setErrorMessage("");
    onClose();
  };

  if (!open) return null;

  const canSubmit =
    title.trim() !== "" &&
    courseId !== "" &&
    videoFile !== null &&
    uploadState === "idle";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={uploadState === "idle" ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Upload Lecture
              </h2>
              <p className="text-xs text-gray-500">MP4, MOV, AVI · Max 2 GB</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {uploadState === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Upload Complete!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                <span className="font-medium text-gray-700">"{title}"</span> has
                been uploaded successfully.
              </p>
              <Button
                onClick={handleClose}
                className="bg-indigo-600 hover:bg-indigo-700 px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Lecture Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Introduction to Binary Trees"
                  disabled={uploadState === "uploading"}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 disabled:opacity-60 disabled:bg-gray-50 transition"
                />
              </div>

              {/* Course */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Course
                </label>
                <Select
                  value={courseId}
                  onValueChange={setCourseId}
                  disabled={uploadState === "uploading"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course…" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.department.code} — {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Drop Zone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Video File
                </label>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() =>
                    uploadState === "idle" && fileInputRef.current?.click()
                  }
                  className={[
                    "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
                    dragging
                      ? "border-indigo-400 bg-indigo-50"
                      : videoFile
                        ? "border-indigo-300 bg-indigo-50/50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50",
                    uploadState !== "idle"
                      ? "cursor-default pointer-events-none"
                      : "",
                  ].join(" ")}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      e.target.files?.[0] && handleFileSelect(e.target.files[0])
                    }
                  />

                  {videoFile ? (
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileVideo className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatBytes(videoFile.size)}
                        </p>
                      </div>
                      {uploadState === "idle" && (
                        <button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setVideoFile(null);
                            setErrorMessage("");
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Video className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-0.5">
                        <span className="font-medium text-indigo-600">
                          Click to browse
                        </span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-gray-400">
                        MP4, MOV, AVI up to 2 GB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {errorMessage && uploadState !== "uploading" && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3.5 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Progress bar */}
              {uploadState === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Uploading…</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={uploadState === "uploading"}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {uploadState === "uploading" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        />
                      </svg>
                      Uploading…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Lecture
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
