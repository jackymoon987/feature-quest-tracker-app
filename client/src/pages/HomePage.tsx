import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import FeatureRequestForm from "../components/FeatureRequestForm";
import FeatureRequestList from "../components/FeatureRequestList";
import { useUser } from "../hooks/use-user";

export default function HomePage() {
  const { user, logout } = useUser();
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Feature Request Tracker</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}</span>
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-xs">
            <Select
              defaultValue="all"
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowNewRequestDialog(true)}>
            New Feature Request
          </Button>
        </div>

        <FeatureRequestList statusFilter={statusFilter} />

        <Dialog
          open={showNewRequestDialog}
          onOpenChange={setShowNewRequestDialog}
        >
          <FeatureRequestForm
            onSuccess={() => setShowNewRequestDialog(false)}
          />
        </Dialog>
      </main>
    </div>
  );
}
