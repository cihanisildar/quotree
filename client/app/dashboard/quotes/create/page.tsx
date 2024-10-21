"use client";

import { FolderTree } from "@/components/folder-tree";
import TagSelector from "@/components/tag-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useFolders } from "@/hooks/useFolder";
import { useTags } from "@/hooks/useTags";
import { useUser } from "@/hooks/useUser";
import { Tag } from "@/models/Tag";
import { ArrowLeft, CheckCircle, Edit, Folder, Send, Tags } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center">
      <div className="loader"></div>
    </div>
  ),
});

interface CreateQuotePageProps {
  placeholder: string;
}

const createQuote = async ({
  content,
  userId,
  folderId,
  tags,
}: {
  content: string;
  userId: number;
  folderId: number;
  tags: Tag[];
}) => {
  const response = await fetch("http://localhost:5000/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      userId,
      folderId,
      tagIds: tags.map((tag) => tag.id),
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create quote");
  }

  const data = await response.json();
  return data;
};

export default function CreateQuotePage({
  placeholder = "Write something...",
}: CreateQuotePageProps) {
  const editorRef = useRef<Quill | null>(null);
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useFolders(user?.id || null);
  const {
    tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useTags(user?.id || null);

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [step, setStep] = useState<"folder" | "content">("folder");
  const [quoteContent, setQuoteContent] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isQuoteChecked, setIsQuoteChecked] = useState(false);
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  const [editorInstance, setEditorInstance] = useState<Quill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "content") {
      editorRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.enable(!isEditorDisabled);
    }
  }, [isEditorDisabled]);

  useEffect(() => {
    if (editorInstance) {
      editorRef.current = editorInstance;
    }
  }, [editorInstance]);

  const handleSubmit = async () => {
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
      setLoading(true);
      await createQuote({
        content: quoteContent,
        userId: user.id,
        folderId: selectedFolderId,
        tags: selectedTags,
      });
      setQuoteSubmitted(true);
      // Delay showing the success message for 2 seconds
      setTimeout(() => {
        setLoading(false);
        setShowSuccessMessage(true);
      }, 2000);
    } catch (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Error",
        description: "Failed to create quote",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleFolderSelect = (folderId: number, folderName: string) => {
    setSelectedFolderId(folderId);
    setSelectedFolder(folderName);
  };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prevTags) =>
      prevTags.some((t) => t.id === tag.id)
        ? prevTags.filter((t) => t.id !== tag.id)
        : [...prevTags, tag]
    );
  };

  const handleSaveAndClose = () => {
    // Perform any necessary actions with selectedTags
    console.log("Selected tags:", selectedTags);
    // Close the dialog
    setIsTagDialogOpen(false);
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

  const toggleQuoteCheck = () => {
    setIsQuoteChecked((prev) => !prev);
    setIsEditorDisabled((prev) => !prev);
  };

  const handleBack = () => setStep("folder");

  if (userLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to create a quote.</div>;
  }
  return (
    <div className="pt-10 pb-20 px-4 h-full overflow-y-scroll">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {quoteSubmitted ? "Quote Submitted" : "Create a New Quote"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quoteSubmitted ? (
            <div className="text-center">
              {loading ? (
                <div className="flex items-center justify-center w-full h-40 gap-4">
                  <p className="text-lg font-semibold mb-4 text-gray-700 animate-pulse">
                    Submitting your quote...
                  </p>
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Your quote has been successfully created!
                  </h3>
                  {showSuccessMessage && (
                    <Button
                      onClick={() => router.push("/dashboard/quotes")}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-[8px]"
                    >
                      View All Quotes
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {step === "folder" ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                      Select a Folder
                    </h3>
                    {foldersLoading ? (
                      <p>Loading folders...</p>
                    ) : foldersError ? (
                      <p className="text-red-500">
                        Error fetching folders: {foldersError}
                      </p>
                    ) : (
                      <div className="border rounded-md p-2 max-h-[400px] overflow-y-auto">
                        <FolderTree
                          folders={folders}
                          onSelect={handleFolderSelect}
                          selectedFolderId={selectedFolderId}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleNext}
                      disabled={!selectedFolderId}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-[8px]"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
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
                    {selectedFolder && (
                      <div className="mb-4 p-3 flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-[4px] shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                        <div className="flex items-center gap-2 text-gray-700 ">
                          <Folder size={20} color="#4A5568" />
                          <span className="text-sm font-medium">
                            {selectedFolder}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center space-y-4">
                    <Editor
                      variant="create"
                      placeholder={placeholder}
                      onSubmit={({ body }) => {
                        setQuoteContent(body);
                        toggleQuoteCheck();
                      }}
                      innerRef={editorRef}
                      defaultHeight={300}
                      disabled={isEditorDisabled}
                    />
                    {isQuoteChecked ? (
                      <div
                        className="w-full p-2 bg-green-100 border border-green-300 rounded-md text-green-700 flex items-center justify-center cursor-pointer"
                        onClick={toggleQuoteCheck}
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Click to edit the quote
                      </div>
                    ) : (
                      <div className="w-full p-2 bg-blue-100 border border-blue-300 rounded-md text-blue-700 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Click the check button in the editor to finalize your
                        quote
                      </div>
                    )}

                    <div className="flex flex-col w-full space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-sm"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <Dialog
                          open={isTagDialogOpen}
                          onOpenChange={setIsTagDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex bg-blue-500 text-white hover:bg-blue-600 hover:text-white items-center gap-2 rounded-[8px]"
                              onClick={() => setIsTagDialogOpen(true)}
                            >
                              <Tags size={16} />
                              Select Tags
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle className="text-3xl">
                                Select Tags
                              </DialogTitle>
                              <DialogDescription>
                                Choose tags for your quote. Click a tag to
                                select or deselect it.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-grow overflow-y-auto mb-4">
                              {tagsLoading ? (
                                <p>Loading tags...</p>
                              ) : tagsError ? (
                                <p className="text-red-500">
                                  Error fetching tags: {tagsError}
                                </p>
                              ) : (
                                <TagSelector
                                  tags={tagsData?.tags}
                                  selectedTags={selectedTags}
                                  onTagToggle={handleTagToggle}
                                  loading={tagsLoading}
                                />
                              )}
                            </div>
                            <div className="flex justify-end w-full">
                              <Button
                                onClick={handleSaveAndClose}
                                className="bg-blue-500 w-full rounded-[4px] text-white hover:bg-blue-600"
                              >
                                Save & Close
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={handleSubmit}
                          disabled={!quoteContent}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 rounded-[8px]"
                        >
                          <Send size={16} />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
