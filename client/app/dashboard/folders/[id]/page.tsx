"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Quote as QuoteIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import FolderBox from "./_components/folder-box";
import { Folder } from "@/models/Folder";

function getRealContent(quoteContent: string) {
  try {
    const contentObj = JSON.parse(quoteContent);
    if (contentObj.ops && Array.isArray(contentObj.ops)) {
      const realContent = contentObj.ops
        .filter((op: any) => !op.insert.includes("__dimensions__"))
        .map((op: any) => op.insert)
        .join("");
      return realContent;
    }
  } catch (error) {
    console.error("Error parsing content:", error);
  }
  return "";
}

const fetchFolder = async (id: string): Promise<Folder> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/${id}/with-subfolders`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch folder");
  }
  return response.json();
};

const createSubfolder = async (
  parentId: number,
  name: string
): Promise<Folder> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/${parentId}/subfolders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create subfolder");
  }
  return response.json();
};

const findFolderPath = (
  folder: Folder,
  targetId: number,
  path: number[] = []
): number[] | null => {
  if (folder.id === targetId) {
    return [...path, folder.id];
  }
  if (folder.subFolders) {
    for (const subFolder of folder.subFolders) {
      const result = findFolderPath(subFolder, targetId, [...path, folder.id]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export default function BeautifulFolderTree() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);

  const {
    data: folder,
    error,
    mutate,
  } = useSWR<Folder>(id ? `/api/folders/${id}` : null, () => fetchFolder(id));

  useEffect(() => {
    if (folder && selectedFolder) {
      const path = findFolderPath(folder, selectedFolder.id);
      if (path) {
        setExpandedFolders(path);
      }
    }
  }, [folder, selectedFolder]);

  const handleCreateSubfolder = async (parentId: number, name: string) => {
    try {
      const newSubfolder = await createSubfolder(parentId, name);
      await mutate((currentFolder) => {
        if (!currentFolder) return currentFolder;

        const updateSubfolders = (folders: Folder[]): Folder[] => {
          return folders.map((f) => {
            if (f.id === parentId) {
              return {
                ...f,
                subFolders: [...(f.subFolders || []), newSubfolder],
              };
            } else if (f.subFolders) {
              return {
                ...f,
                subFolders: updateSubfolders(f.subFolders),
              };
            }
            return f;
          });
        };

        if (currentFolder.id === parentId) {
          return {
            ...currentFolder,
            subFolders: [...(currentFolder.subFolders || []), newSubfolder],
          };
        } else {
          return {
            ...currentFolder,
            subFolders: updateSubfolders(currentFolder.subFolders || []),
          };
        }
      }, false);
      toast({
        title: "Success",
        description: "Subfolder created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subfolder",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newSubfolderName.trim() && folder) {
      await handleCreateSubfolder(folder.id, newSubfolderName.trim());
      setNewSubfolderName("");
      setIsDialogOpen(false);
    }
  };

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const handleQuoteClick = (quoteId: number) => {
    router.push(`/dashboard/quotes/${quoteId}`);
  };

  if (error) return <div>Failed to load folder {error.message}</div>;
  if (!folder) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-4 px-4 md:px-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-600">{folder.name}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-[8px]">
              <Plus size={16} className="mr-2" />
              Create Subfolder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-800">
                Create New Subfolder
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col items-end justify-end"
            >
              <Input
                value={newSubfolderName}
                onChange={(e) => setNewSubfolderName(e.target.value)}
                placeholder="Enter subfolder name"
                required
                className="w-full rounded border-green-300 focus:border-green-500 focus:ring-green-500"
              />
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Create Subfolder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex bg-white rounded-xl shadow-lg overflow-hidden h-[80%]">
        <div
          className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          <div className="min-w-max">
            {folder && (
              <FolderBox
                folder={folder}
                depth={0}
                onCreateSubfolder={handleCreateSubfolder}
                onFolderSelect={handleFolderSelect}
                selectedFolderId={selectedFolder?.id || null}
                expandedFolders={expandedFolders}
              />
            )}
          </div>
        </div>
        <div
          className="w-2/3 p-6 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {selectedFolder && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                {selectedFolder.name}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Quotes:
                  </h3>
                  {selectedFolder.quotes && selectedFolder.quotes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFolder.quotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="flex items-start space-x-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => handleQuoteClick(quote.id)}
                        >
                          <QuoteIcon
                            size={16}
                            className="text-blue-500 mt-1 flex-shrink-0"
                          />
                          <p className="text-gray-700 truncate overflow-hidden max-w-[500px]">
                            {getRealContent(quote.content)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No quotes in this folder.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Subfolders:
                  </h3>
                  {selectedFolder.subFolders &&
                  selectedFolder.subFolders.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFolder.subFolders.map((subfolder) => (
                        <div
                          key={subfolder.id}
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => handleFolderSelect(subfolder)}
                        >
                          <FolderIcon size={16} className="text-yellow-500" />
                          <span className="text-gray-700">
                            {subfolder.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No subfolders in this folder.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
