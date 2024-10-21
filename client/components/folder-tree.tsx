import { Folder } from "@/models/Folder"
import { ChevronRight, FolderIcon, FoldersIcon } from "lucide-react"

interface FolderTreeProps {
  folders: Folder[]
  onSelect: (folderId: number, folderName: string) => void
  selectedFolderId: number | null
}

export const FolderTree: React.FC<FolderTreeProps> = ({ folders, onSelect, selectedFolderId }) => {
  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isSelected = folder.id === selectedFolderId
    return (
      <div key={folder.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? "bg-green-100 text-green-800 rounded-[8px]" : "hover:bg-gray-100 rounded-[8px]"
          }`}
          onClick={() => onSelect(folder.id, folder.name)}
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
    )
  }

  return (
    <div className="space-y-1">
      {folders.map((folder) => renderFolder(folder))}
    </div>
  )
}