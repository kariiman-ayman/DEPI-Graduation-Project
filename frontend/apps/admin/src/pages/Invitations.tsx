import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import { Card, CardContent, CardHeader } from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { MailPlus, Search } from "lucide-react";
import { useState } from "react";
import { InviteModal } from "../components/InviteModal";
import { useInvitations } from "../hooks/useInvites";

const Invitations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invitations, isLoading } = useInvitations();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invitations) {
    return <div>No invitations found</div>;
  }

  const filteredInvitations = invitations.filter(
    (invitation) =>
      invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Invitation Management</h3>
          <p className="text-sm text-gray-500">
            Invite new users to join the platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
          >
            <MailPlus className="w-4 h-4" />
            Invite New User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search invitations by email, ID, or role..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invitation ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {/* <TableHead>Expires At</TableHead> */}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-xs">
                          {invitation.email
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span>{invitation.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {invitation.role}
                  </TableCell>
                  {/* <TableCell>{invitation.expiresAt.toDateString()}</TableCell> */}
                  <TableCell>
                    <Badge
                      variant={invitation.used ? "default" : "secondary"}
                      className={
                        invitation.used
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    >
                      {invitation.used ? "Accepted" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InviteModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Invitations;
