"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuoteIcon, Search } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

type Quote = {
  id: number;
  content: string;
  userId: number;
  folderId: number;
};

type Folder = {
  id: number;
  name: string;
};

function getRealContent(quoteContent: string) {
  try {
    const contentObj = JSON.parse(quoteContent);

    if (contentObj.ops && Array.isArray(contentObj.ops)) {
      const realContent = contentObj.ops
        .filter((op: any) => 
          // Exclude any insert that includes undesired placeholders or image data
          typeof op.insert === 'string' && 
          !op.insert.includes("__backgroundImage__") &&
          !op.insert.includes("__backgroundColor__") &&
          !op.insert.includes("__dimensions__")
        )
        .map((op: any) => op.insert)
        .join(""); // Join all filtered inserts into a single string
      return realContent;
    }
  } catch (error) {
    console.error("Error parsing content:", error);
  }
  return "";
}


const fetchQuotes = async (userId: number): Promise<Quote[]> => {
  const response = await fetch(
    `http://localhost:5000/api/quotes/user/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch quotes");
  }
  return response.json();
};

const fetchFolders = async (folderId: number): Promise<Folder> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/${folderId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch folder with ID ${folderId}`);
  }
  return response.json();
};

export default function QuoteDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: quotes,
    error,
    isLoading,
  } = useSWR<Quote[]>(user ? `/api/quotes/user/${user.id}` : null, () =>
    fetchQuotes(user!.id)
  );

  const { data: folders } = useSWR(
    quotes ? quotes.map((quote) => quote.folderId) : null,
    (folderIds) =>
      Promise.all(folderIds.map((folderId) => fetchFolders(folderId)))
  );

  const handleCardClick = (quoteId: number) => {
    router.push(`/dashboard/quotes/${quoteId}`);
  };

  // Debounce the search function to avoid excessive re-renders
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filteredQuotes = quotes?.filter((quote) =>
    getRealContent(quote.content)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading quotes: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto py-4 h-full">
      <main className="space-y-6">
        <div className="flex justify-between items-center px-8">
          <h2 className="text-4xl font-semibold">Your Quotes</h2>
          <Link href="/dashboard/quotes/create">
            <Button className="bg-green-500 hover:bg-green-500/90 rounded-[8px] text-white">
              New Quote
            </Button>
          </Link>
        </div>

        <div className="relative px-8">
          <Search className="absolute left-10 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            type="search"
            placeholder="Search quotes..."
            className="pl-8 border-slate-400 rounded-[4px] placeholder:text-slate-400"
            onChange={handleSearchChange}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-amber-700">Loading quotes...</div>
        ) : filteredQuotes && filteredQuotes.length === 0 ? (
          <div className="text-center text-amber-700">
            {searchQuery
              ? "No matching quotes found."
              : "No quotes found. Add your first quote!"}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto h-screen px-8 pb-8">
            {filteredQuotes?.map((quote) => {
              const folder = folders?.find(
                (folder: Folder) => folder.id === quote.folderId
              );

              return (
                <div
                  key={quote.id}
                  className="group flex h-40 w-full max-w-sm cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleCardClick(quote.id)}
                >
                  <div className="bg-amber-200 w-10 rounded-l-lg flex items-center justify-center shadow-md transition-all">
                    <span className="transform -rotate-90 whitespace-nowrap text-amber-800 font-semibold truncate text-sm transition-all">
                      {folder ? folder.name : "Loading..."}
                    </span>
                  </div>
                  <div className="bg-white rounded-r-[8px] border border-l-0 p-4 shadow-md flex-grow flex flex-col w-full md:w-[200px] relative overflow-hidden">
                    <QuoteIcon className="h-6 w-6 mb-2 flex-shrink-0 absolute top-2 right-2 opacity-50" />
                    <p className="text-sm text-zinc-900 italic block overflow-hidden text-ellipsis line-clamp-4 mt-6">
                      {getRealContent(quote.content)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
