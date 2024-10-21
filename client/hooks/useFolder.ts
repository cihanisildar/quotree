import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Folder } from "@/models/Folder";

export const useFolders = (userId: number |null) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchFolders = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/folders/user/${userId}`, {
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error("Failed to fetch folders");
          }
          const data = await response.json();
          setFolders(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          toast({
            title: "Error",
            description: "Failed to fetch folders",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchFolders();
    }
  }, [userId]);

  return { folders, loading, error };
};
