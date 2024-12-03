import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import { useFeatureRequests } from "../hooks/use-feature-requests";
import { useUser } from "../hooks/use-user";
import { type FeatureRequest } from "@db/schema";
import type { statusEnum } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

interface Props {
  searchTerm: string;
  statusFilter: string;
}

type StatusType = typeof statusEnum.enumValues[number];

export default function FeatureRequestList({ searchTerm, statusFilter }: Props) {
  const { user } = useUser();
  const { toast } = useToast();
  const { data: requests, updateFeatureRequest } = useFeatureRequests(
    searchTerm, 
    statusFilter === "all" ? undefined : statusFilter
  );

  const handleStatusChange = async (request: FeatureRequest, newStatus: StatusType) => {
    try {
      console.log('Updating status:', { id: request.id, oldStatus: request.status, newStatus });
      await updateFeatureRequest(request.id, { status: newStatus });
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update status: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          {user?.isAdmin && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.title}</TableCell>
            <TableCell>{request.description}</TableCell>
            <TableCell>
              <span className={`capitalize ${
                request.priority === 'high' ? 'text-red-500' :
                request.priority === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {request.priority}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell>
              {new Date(request.createdAt).toLocaleDateString()}
            </TableCell>
            {user?.isAdmin && (
              <TableCell>
                <Select
                  value={request.status}
                  onValueChange={(value: StatusType) => handleStatusChange(request, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
