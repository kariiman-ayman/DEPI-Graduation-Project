import { useState } from "react";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import {
  MailPlus,
  Search,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Mail,
  GraduationCap,
  Users,
  ShieldCheck,
} from "lucide-react";
import { InviteModal } from "../components/InviteModal";
import {
  useInvitations,
  useResendInvitation,
  useRevokeInvitation,
} from "../hooks/useInvites";
import type { InvitesList, InviteRole } from "../types/invites.types";

function roleBadge(role: InviteRole) {
  const styles: Record<InviteRole, string> = {
    student: "bg-blue-100 dark:bg-blue-900/20 text-blue-700",
    instructor: "bg-purple-100 dark:bg-purple-900/20 text-purple-700",
    admin: "bg-red-100 dark:bg-red-900/20 text-red-700",
  };
  const icons: Record<InviteRole, React.ElementType> = {
    student: GraduationCap,
    instructor: Users,
    admin: ShieldCheck,
  };
  const Icon = icons[role] ?? Users;
  return (
    <Badge className={`${styles[role] ?? ""} gap-1`}>
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
}

function statusBadge(inv: InvitesList) {
  if (inv.used)
    return (
      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700">
        Accepted
      </Badge>
    );
  if (inv.expired)
    return (
      <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        Expired
      </Badge>
    );
  return (
    <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700">
      Pending
    </Badge>
  );
}

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function expiryLabel(inv: InvitesList): string {
  if (inv.used) return "—";
  if (!inv.expiresAt) return "—";
  const diff = new Date(inv.expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "< 1h left";
  if (h < 24) return `${h}h left`;
  return `${Math.floor(h / 24)}d left`;
}

function CopyLinkButton({ link }: { link: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!link)
    return <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>;
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(link).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      title="Copy invite link"
      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

type StatusFilter = "all" | "pending" | "accepted" | "expired";
type RoleFilter = "all" | InviteRole;

export default function Invitations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invitations = [], isLoading } = useInvitations();
  const { mutate: resend, isPending: resending } = useResendInvitation();
  const { mutate: revoke, isPending: revoking } = useRevokeInvitation();

  const total = invitations.length;
  const accepted = invitations.filter((i) => i.used).length;
  const pending = invitations.filter((i) => !i.used && !i.expired).length;
  const expired = invitations.filter((i) => !i.used && i.expired).length;

  const filtered = invitations.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      inv.email.toLowerCase().includes(q) ||
      inv.role.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "accepted" && inv.used) ||
      (statusFilter === "expired" && !inv.used && inv.expired) ||
      (statusFilter === "pending" && !inv.used && !inv.expired);
    const matchRole = roleFilter === "all" || inv.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Invitation Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Invite students, instructors, and admins to the platform
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setIsModalOpen(true)}
        >
          <MailPlus className="w-4 h-4" />
          Send Invitation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sent",
            value: total,
            icon: Mail,
            color:
              "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Accepted",
            value: accepted,
            icon: Check,
            color: "bg-green-100 dark:bg-green-900/20 text-green-600",
          },
          {
            label: "Pending",
            value: pending,
            icon: RotateCcw,
            color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
          },
          {
            label: "Expired",
            value: expired,
            icon: Trash2,
            color:
              "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
                <p className="text-2xl font-semibold">
                  {isLoading ? "—" : value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="sr-only">Invitations</CardTitle>
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search by email, role, or ID…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as RoleFilter)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">
              No invitations match your filters.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Invite Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-indigo-600 text-xs font-medium">
                            {inv.email[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{inv.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                            {inv.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{roleBadge(inv.role)}</TableCell>
                    <TableCell>{statusBadge(inv)}</TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {relativeTime(inv.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {expiryLabel(inv)}
                    </TableCell>
                    <TableCell>
                      <CopyLinkButton link={inv.inviteLink} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {!inv.used && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs"
                              disabled={resending}
                              onClick={() => resend(inv.token)}
                            >
                              <RotateCcw className="w-3 h-3" />
                              Resend
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                              disabled={revoking}
                              onClick={() => revoke(inv.token)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && filtered.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Showing {filtered.length} of {total} invitations
            </p>
          )}
        </CardContent>
      </Card>

      <InviteModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
