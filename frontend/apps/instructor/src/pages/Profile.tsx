import { useState } from "react";
import {
  Users,
  Mail,
  Calendar,
  User,
  Lock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Pencil,
  X,
  BookMarked,
} from "lucide-react";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
} from "../hooks/useProfile.js";

function getInitials(name?: string | null) {
  if (!name) return "I";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("") || "I"
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function InstructorProfile() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateProfile();
  const { mutateAsync: savePwd, isPending: changingPwd } = useChangePassword();

  const [editMode, setEditMode] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [titleVal, setTitleVal] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const startEdit = () => {
    setNameVal(profile?.name ?? "");
    setTitleVal(profile?.title ?? "");
    setSpecVal(profile?.specialization ?? "");
    setInfoError("");
    setInfoSuccess(false);
    setEditMode(true);
  };

  const handleSaveInfo = async () => {
    setInfoError("");
    try {
      await saveProfile({
        name: nameVal,
        title: titleVal || undefined,
        specialization: specVal || undefined,
      });
      setInfoSuccess(true);
      setEditMode(false);
      setTimeout(() => setInfoSuccess(false), 3000);
    } catch (err) {
      setInfoError(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (newPwd !== confirmPwd) {
      setPwdError("Passwords do not match");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("New password must be at least 6 characters");
      return;
    }
    try {
      await savePwd({ currentPassword: currentPwd, newPassword: newPwd });
      setPwdSuccess(true);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      setPwdError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load profile
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.name);
  const displayName = profile.title
    ? `${profile.title} ${profile.name}`
    : profile.name;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Hero card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="h-24 bg-gradient-to-r from-purple-600 to-violet-400" />
        <div className="px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-gray-900 shadow-md shrink-0">
                <span className="text-white text-2xl font-bold">
                  {initials}
                </span>
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h1>
                {profile.specialization && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.specialization}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 gap-1">
                    <Users className="w-3 h-3" />
                    Instructor
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Member since {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {profile.email}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses Taught"
          value={String(profile.stats.totalCourses)}
          color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={GraduationCap}
          label="Students Enrolled"
          value={String(profile.stats.totalStudents)}
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Info + Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              Professional Information
            </h2>
            {!editMode && (
              <button
                onClick={startEdit}
                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Email
            </Label>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              {profile.email}
            </p>
          </div>

          {editMode ? (
            <>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Title
                </Label>
                <Select value={titleVal} onValueChange={setTitleVal}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select title…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Prof.">Prof.</SelectItem>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="name"
                  className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  className="mt-1"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="spec"
                  className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  Specialization
                </Label>
                <div className="relative mt-1">
                  <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="spec"
                    className="pl-9"
                    placeholder="e.g. Computer Science"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                  />
                </div>
              </div>
              {infoError && (
                <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {infoError}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={saving}
                  onClick={handleSaveInfo}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Title
                </Label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {profile.title || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Full Name
                </Label>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
                    {profile.name}
                  </p>
                  {infoSuccess && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Specialization
                </Label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {profile.specialization || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-purple-500" />
            Change Password
          </h2>
          <form onSubmit={handleChangePwd} className="space-y-4">
            <div>
              <Label
                htmlFor="cur-pwd"
                className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                Current Password
              </Label>
              <Input
                id="cur-pwd"
                type="password"
                className="mt-1"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="new-pwd"
                className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                New Password
              </Label>
              <Input
                id="new-pwd"
                type="password"
                className="mt-1"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label
                htmlFor="confirm-pwd"
                className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirm-pwd"
                type="password"
                className="mt-1"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {pwdError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {pwdError}
              </p>
            )}
            {pwdSuccess && (
              <p className="text-xs text-green-600 flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                Password updated successfully
              </p>
            )}
            <Button
              type="submit"
              disabled={changingPwd || !currentPwd || !newPwd || !confirmPwd}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {changingPwd ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
