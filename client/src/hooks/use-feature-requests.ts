import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FeatureRequest } from "@db/schema";

async function fetchFeatureRequests(search?: string, status?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await fetch(`/api/feature-requests?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch feature requests");
  }
  return response.json();
}

export function useFeatureRequests(search?: string, status?: string) {
  const queryClient = useQueryClient();

  const { data } = useQuery<FeatureRequest[]>({
    queryKey: ["feature-requests", search, status],
    queryFn: () => fetchFeatureRequests(search, status),
  });

  const createFeatureRequest = async (request: Partial<FeatureRequest>) => {
    const response = await fetch("/api/feature-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to create feature request");
    }

    queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    return response.json();
  };

  const updateFeatureRequest = async (id: number, updates: Partial<FeatureRequest>) => {
    const response = await fetch(`/api/feature-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update feature request");
    }

    queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    return response.json();
  };

  return {
    data,
    createFeatureRequest,
    updateFeatureRequest,
  };
}
