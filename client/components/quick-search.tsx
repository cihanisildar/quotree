import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Folder } from "@/models/Folder";
import { Quote } from "@/models/Quote";
import { useUser } from "@/hooks/useUser";

interface QuickSearchComponentProps {
  link: {
    label: string;
    href: string;
    icon: React.JSX.Element;
    dialog: boolean;
  };
  idx: number;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

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

const QuickSearchComponent = ({ link, idx }: QuickSearchComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { user } = useUser();
  let userId: number | null = null;
  if (user) {
    userId = user.id;
  }

  const { data: folders, error: foldersError } = useSWR<Folder[]>(
    `http://localhost:5000/api/folders/user/${userId}`,
    fetcher
  );

  const { data: quotes, error: quotesError } = useSWR<Quote[]>(
    `http://localhost:5000/api/quotes/user/${userId}`,
    fetcher
  );

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const normalizedSearchTerm = searchTerm.toLowerCase();

    const folderResults = Array.isArray(folders)
      ? folders
          .filter((folder) =>
            folder.name.toLowerCase().includes(normalizedSearchTerm)
          )
          .map((folder) => ({ type: "Folder" as const, item: folder }))
      : [];

    const quoteResults = Array.isArray(quotes)
      ? quotes
          .filter((quote) => {
            const realContent = getRealContent(quote.content);
            return realContent.toLowerCase().includes(normalizedSearchTerm);
          })
          .map((quote) => ({ type: "Quote" as const, item: quote }))
      : [];

    return [...folderResults, ...quoteResults];
  }, [folders, quotes, searchTerm]);

  if (foldersError) console.error("Error fetching folders:", foldersError);
  if (quotesError) console.error("Error fetching quotes:", quotesError);

  const handleResultClick = (result: {
    type: "Folder" | "Quote";
    item: any;
  }) => {
    const id = result.item.id;
    if (result.type === "Folder") {
      router.push(`/dashboard/folders/${id}`);
    } else if (result.type === "Quote") {
      router.push(`/dashboard/quotes/${id}`);
    }
    setIsOpen(false); // Close the dialog after navigation
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="group/button flex items-center py-2 text-sm justify-start gap-2 text-neutral-700 dark:text-neutral-200"
          >
            {link.icon}
            <span className="group-hover/button:translate-x-1 transition-all duration-150">
              {link.label}
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl">Quick Search</DialogTitle>
            <DialogDescription>
              Search for quotes, folders, or content
            </DialogDescription>
          </DialogHeader>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleResultClick(result)} // Add onClick event
                >
                  <strong>{result.type}:</strong>{" "}
                  {result.type === "Folder"
                    ? (result.item as Folder).name
                    : getRealContent((result.item as Quote).content).substring(
                        0,
                        50
                      )}
                  {result.type === "Quote" && (
                    <p className="text-sm text-gray-600">
                      {getRealContent((result.item as Quote).content).substring(
                        0,
                        100
                      )}
                      ...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickSearchComponent;
