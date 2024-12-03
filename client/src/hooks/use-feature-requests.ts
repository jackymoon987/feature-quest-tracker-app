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
    console.log('Sending request to server:', request);
    const response = await fetch("/api/feature-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      credentials: 'include'  // Add this to ensure cookies are sent
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.details
          ? `Validation failed: ${errorData.details.map((d: any) => `${d.field} ${d.message}`).join(', ')}`
          : errorData.message || "Failed to create feature request"
      );
    }

    queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    return response.json();
  };

  const updateFeatureRequest = async (id: number, updates: Partial<FeatureRequest>) => {
    console.log('Sending update request:', { id, updates });
    const response = await fetch(`/api/feature-requests/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(updates),
      credentials: 'include'
    });

    console.log('Update response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update error:', errorData);
      throw new Error(errorData.message || "Failed to update feature request");
    }

    const updatedRequest = await response.json();
    console.log('Update successful:', updatedRequest);
    
    queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    return updatedRequest;
  };

  return {
    data,
    createFeatureRequest,
    updateFeatureRequest,
  };
}
