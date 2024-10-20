"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { Folder } from "@/models/Folder";
import { ChevronRight, FolderIcon, FoldersIcon, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Quill from "quill";
import React, { useEffect, useRef, useState } from "react";

const Editor = dynamic(() => import("../../../../components/text-editor"), {
  ssr: false,
});

interface CreateQuotePageProps {
  placeholder: string;
}

const fetchFolders = async (userId: number): Promise<Folder[]> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/user/${userId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch folders");
  }
  return response.json();
};

const createQuote = async (quoteData: {
  content: string;
  userId: number;
  folderId: number;
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("Payload too large");
      }
      throw new Error("Failed to create quote");
    }

    return response.json();
  } catch (error: any) {
    if (error.message === "Payload too large") {
      toast({
        title: "Content Too Large",
        description: "The content exceeds the size limit. Please shorten it.",
        variant: "destructive",
      });
    } else {
      throw error;
    }
  }
};

const FolderTree: React.FC<{
  folders: Folder[];
  onSelect: (folderId: number) => void;
  selectedFolderId: number | null;
}> = ({ folders, onSelect, selectedFolderId }) => {
  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isSelected = folder.id === selectedFolderId;
    return (
      <div key={folder.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
          }`}
          onClick={() => onSelect(folder.id)}
        >
          {folder.subFolders && folder.subFolders.length > 0 ? (
            <FoldersIcon size={16} className="text-yellow-500" />
          ) : (
            <FolderIcon size={16} className="text-yellow-500" />
          )}
          <span className="text-sm font-medium">{folder.name}</span>
          {folder.subFolders && folder.subFolders.length > 0 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </div>
        {folder.subFolders &&
          folder.subFolders.map((subFolder) =>
            renderFolder(subFolder, depth + 1)
          )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => renderFolder(folder))}
    </div>
  );
};

const CreateQuotePage = ({
  placeholder = "Write something...",
}: CreateQuotePageProps) => {
  const editorRef = useRef<Quill | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [step, setStep] = useState<"folder" | "content">("folder");

  useEffect(() => {
    if (user) {
      fetchFolders(user.id)
        .then(setFolders)
        .catch((error) => {
          console.error("Error fetching folders:", error);
          toast({
            title: "Error",
            description: "Failed to fetch folders",
            variant: "destructive",
          });
        });
    }
  }, [user]);

  const handleSubmit = async (value: { body: string }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a quote",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFolderId) {
      toast({
        title: "Error",
        description: "Please select a folder for the quote",
        variant: "destructive",
      });
      return;
    }

    try {
      await createQuote({
        content: value.body,
        userId: user.id,
        folderId: selectedFolderId,
      });

      toast({
        title: "Success",
        description: "Quote created successfully",
      });

      router.push("/dashboard/quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Error",
        description: "Failed to create quote",
        variant: "destructive",
      });
    }
  };

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  const handleNext = () => {
    if (!selectedFolderId) {
      toast({
        title: "Error",
        description: "Please select a folder before continuing",
        variant: "destructive",
      });
      return;
    }
    setStep("content");
  };

  const handleBack = () => {
    setStep("folder");
  };

  useEffect(() => {
    if (step === "content") {
      editorRef.current?.focus();
    }
  }, [step]);

  if (!user) {
    return <div>Please log in to create a quote.</div>;
  }

  return (
    <div className="py-10 px-4 h-full overflow-y-scroll">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create a New Quote -{" "}
            {step === "folder"
              ? "Step 1: Select Folder"
              : "Step 2: Write Quote"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "folder" ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Select a Folder
                </h3>
                <div className="border rounded-md p-2 max-h-[400px] overflow-y-auto">
                  <FolderTree
                    folders={folders}
                    onSelect={handleFolderSelect}
                    selectedFolderId={selectedFolderId}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!selectedFolderId}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Folder Selection
                </Button>
              </div>
              <div className="overflow-y-auto flex flex-col items-center">
                <Editor
                  variant="create"
                  placeholder={placeholder}
                  onSubmit={handleSubmit}
                  innerRef={editorRef}
                  defaultHeight={300}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuotePage;
