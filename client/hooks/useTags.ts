import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Tag } from "@/models/Tag";

interface TagsResponse {
  status: string;
  tags: Tag[];
}

export const useTags = (userId: number | null) => {
  const [tagsData, setTagsData] = useState<TagsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchTags = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/tags/user/${userId}`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tags");
          }
          const data: TagsResponse = await response.json();
          setTagsData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          toast({
            title: "Error",
            description: "Failed to fetch tags",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchTags();
    }
  }, [userId]);

  return { tagsData, loading, error };
};
