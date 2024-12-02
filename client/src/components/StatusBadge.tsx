import { Badge } from "@/components/ui/badge";

const statusColors = {
  open: "bg-blue-100 text-blue-800",
  in_review: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};

interface Props {
  status: keyof typeof statusColors;
}

export default function StatusBadge({ status }: Props) {
  return (
    <Badge className={statusColors[status]}>
      {status.replace("_", " ").toUpperCase()}
    </Badge>
  );
}
