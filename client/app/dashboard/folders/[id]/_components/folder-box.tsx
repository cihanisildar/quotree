import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  FolderIcon,
  Plus,
  FoldersIcon,
  Quote as QuoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Folder } from "@/models/Folder";

type Quote = {
  id: number;
  content: string;
};

type FolderProps = {
  folder: Folder;
  depth: number;
  onCreateSubfolder: (parentId: number, name: string) => Promise<void>;
  onFolderSelect: (folder: Folder) => void;
  selectedFolderId: number | null;
  expandedFolders: number[];
};

const FolderBox: React.FC<FolderProps> = ({
  folder,
  depth,
  onCreateSubfolder,
  onFolderSelect,
  selectedFolderId,
  expandedFolders,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (expandedFolders.includes(folder.id)) {
      setIsOpen(true);
    }
  }, [expandedFolders, folder.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newSubfolderName.trim()) {
      await onCreateSubfolder(folder.id, newSubfolderName.trim());
      setNewSubfolderName("");
      setIsDialogOpen(false);
    }
  };

  const hasSubfolders = folder.subFolders && folder.subFolders.length > 0;

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleFolderClick = () => {
    onFolderSelect(folder);
  };

  return (
    <div>
      <div style={{ marginLeft: `${depth * 20}px` }}>
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={handleChevronClick}
          >
            {hasSubfolders &&
              (isOpen ? (
                <ChevronDown size={16} className="transition-transform" />
              ) : (
                <ChevronRight size={16} className="transition-transform" />
              ))}
          </Button>

          <div
            className="flex items-center cursor-pointer"
            onClick={handleFolderClick}
          >
            {hasSubfolders ? (
              <FoldersIcon size={16} className="text-yellow-500 mr-2" />
            ) : (
              <FolderIcon size={16} className="text-yellow-500 mr-2" />
            )}
            <span
              className={`font-medium ${
                selectedFolderId === folder.id
                  ? "text-green-600 font-bold"
                  : "text-green-800"
              }`}
            >
              {folder.name}
            </span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 p-0 h-6 w-6 text-green-600 hover:text-green-700"
              >
                <div className="border rounded-[4px]">
                  <Plus size={16} />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl text-green-800">
                  Create New Subfolder in {folder.name}
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
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Create Subfolder
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isOpen && hasSubfolders && (
          <div className="ml-4">
            {folder.subFolders!.map((subfolder: Folder) => (
              <FolderBox
                key={subfolder.id}
                folder={subfolder}
                depth={depth + 1}
                onCreateSubfolder={onCreateSubfolder}
                onFolderSelect={onFolderSelect}
                selectedFolderId={selectedFolderId}
                expandedFolders={expandedFolders}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderBox;
