import { useState } from "react";
import {
  GraduationCap, Mail, Calendar, User, Lock, CheckCircle,
  AlertCircle, BookOpen, ClipboardCheck, Award, DollarSign, Pencil, X, Layers,
} from "lucide-react";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { useProfile, useUpdateProfile, useChangePassword } from "../hooks/useProfile";

function getInitials(name?: string | null) {
  if (!name) return "S";
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "S";
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateProfile();
  const { mutateAsync: savePwd, isPending: changingPwd } = useChangePassword();

  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const startEdit = () => {
    setNameVal(profile?.name ?? "");
    setNameError("");
    setNameSuccess(false);
    setEditName(true);
  };

  const handleSaveName = async () => {
    setNameError("");
    try {
      await saveProfile({ name: nameVal });
      setNameSuccess(true);
      setEditName(false);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Failed to update name");
    }
  };

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (newPwd !== confirmPwd) { setPwdError("Passwords do not match"); return; }
    if (newPwd.length < 6) { setPwdError("New password must be at least 6 characters"); return; }
    try {
      await savePwd({ currentPassword: currentPwd, newPassword: newPwd });
      setPwdSuccess(true);
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Failed to load profile</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {error instanceof Error ? error.message : "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.name);

  return (
    <div className="max-w-4xl space-y-6">

      {/* Hero card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-400" />
        <div className="px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-gray-900 shadow-md shrink-0">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Student
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Layers}
          label="Academic Year"
          value={profile.academicYear !== null ? `Year ${profile.academicYear}` : "—"}
          color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard icon={BookOpen} label="Enrolled Courses" value={String(profile.stats.enrolledCourses)} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <StatCard icon={ClipboardCheck} label="Attendance Rate" value={`${profile.stats.attendanceRate}%`} color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" />
        <StatCard
          icon={Award}
          label="Average Grade"
          value={profile.stats.averageGrade !== null ? String(profile.stats.averageGrade) : "—"}
          color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={DollarSign}
          label="Total Paid"
          value={`$${profile.stats.totalPaid.toLocaleString()}`}
          color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Info + Security grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Personal Information
            </h2>
            {!editName && (
              <button onClick={startEdit} className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</Label>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">{profile.email}</p>
          </div>

          <div>
            <Label htmlFor="name" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</Label>
            {editName ? (
              <div className="mt-1 space-y-2">
                <Input id="name" value={nameVal} onChange={(e) => setNameVal(e.target.value)} autoFocus />
                {nameError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{nameError}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving} onClick={handleSaveName}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditName(false)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">{profile.name}</p>
                {nameSuccess && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3.5 h-3.5" />Saved
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Academic Year</Label>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              {profile.academicYear ? `Year ${profile.academicYear}` : <span className="text-gray-400 dark:text-gray-500 italic">Not set</span>}
            </p>
          </div>

          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</Label>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 capitalize">{profile.role}</p>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-indigo-500" />
            Change Password
          </h2>
          <form onSubmit={handleChangePwd} className="space-y-4">
            <div>
              <Label htmlFor="cur-pwd" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Password</Label>
              <Input id="cur-pwd" type="password" className="mt-1" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} autoComplete="current-password" required />
            </div>
            <div>
              <Label htmlFor="new-pwd" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">New Password</Label>
              <Input id="new-pwd" type="password" className="mt-1" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} autoComplete="new-password" required minLength={6} />
            </div>
            <div>
              <Label htmlFor="confirm-pwd" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Confirm New Password</Label>
              <Input id="confirm-pwd" type="password" className="mt-1" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} autoComplete="new-password" required />
            </div>
            {pwdError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{pwdError}
              </p>
            )}
            {pwdSuccess && (
              <p className="text-xs text-green-600 flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />Password updated successfully
              </p>
            )}
            <Button type="submit" disabled={changingPwd || !currentPwd || !newPwd || !confirmPwd} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {changingPwd ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
