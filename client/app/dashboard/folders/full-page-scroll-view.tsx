"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Folder,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Quote = {
  id: number;
  content: string;
};

type Folder = {
  id: number;
  name: string;
  subFolders?: Folder[];
  quotes?: Quote[];
  createdAt: Date;
  updatedAt: Date;
};

type FolderStatistics = {
  totalSubfolders: number;
  totalQuotes: number;
  deepestLevel: number;
};

type FullPageScrollViewProps = {
  folders: Folder[] | undefined;
  isLoading: boolean;
  error: any;
};

function calculateFolderStatistics(folder: Folder): FolderStatistics {
  let stats: FolderStatistics = {
    totalSubfolders: 0,
    totalQuotes: folder.quotes?.length || 0,
    deepestLevel: 0,
  };

  if (folder.subFolders && folder.subFolders.length > 0) {
    stats.totalSubfolders = folder.subFolders.length;
    folder.subFolders.forEach((subFolder) => {
      const subStats = calculateFolderStatistics(subFolder);
      stats.totalSubfolders += subStats.totalSubfolders;
      stats.totalQuotes += subStats.totalQuotes;
      stats.deepestLevel = Math.max(
        stats.deepestLevel,
        subStats.deepestLevel + 1
      );
    });
  }

  return stats;
}

export default function FullPageScrollView({
  folders,
  isLoading,
  error,
}: FullPageScrollViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const RecursiveFolderView = ({ folder }: { folder: Folder }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
        <div className="flex items-center space-x-2">
          <Folder className="h-5 w-5 text-primary" />
          <span className="font-medium">{folder.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {folder.quotes?.length || 0} quotes
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/folder/${folder.id}`)}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {folder.subFolders && folder.subFolders.length > 0 && (
        <div className="pl-4 border-l border-secondary">
          {folder.subFolders.map((subFolder) => (
            <RecursiveFolderView key={subFolder.id} folder={subFolder} />
          ))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && activeIndex < (folders?.length || 0) - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeIndex, folders]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transform = `translateY(-${activeIndex * 100}%)`;
    }
  }, [activeIndex]);

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
  }) => {
    const colorClasses = getColorByStatTitle(title); // Get the color for the title

    return (
      <Card className={`${colorClasses} border-primary/10`}>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div>{icon}</div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return <div className="text-red-500">Error loading folders</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <div
        ref={containerRef}
        className="h-full transition-transform duration-500 ease-in-out"
      >
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <Skeleton className="h-[80%] w-[80%] rounded-md" />
          </div>
        ) : folders && folders.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-semibold">No folders found</p>
                <p className="text-muted-foreground mt-2">
                  Create your first folder to get started!
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/create-folder")}
                >
                  Create Folder
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          folders?.map((folder, index) => {
            const stats = calculateFolderStatistics(folder);
            return (
              <div
                key={folder.id}
                className="h-full w-full flex justify-center p-4"
              >
                <Card className="w-full max-w-4xl h-[500px] overflow-hidden shadow-lg border border-gray-200  flex flex-col">
                  <CardHeader className=" border-b border-gray-200">
                    <CardTitle className="flex items-center space-x-2 text-2xl text-gray-800">
                      <Folder className="h-8 w-8 text-primary" />
                      <span>{folder.name}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 grid gap-4 grid-cols-2 flex-grow bg-white">
                    <StatCard
                      title="Total Subfolders"
                      value={stats.totalSubfolders}
                      icon={<Layers className="h-6 w-6" />}
                    />
                    <StatCard
                      title="Total Quotes"
                      value={stats.totalQuotes}
                      icon={<FileText className="h-6 w-6" />}
                    />
                    <StatCard
                      title="Deepest Level"
                      value={stats.deepestLevel}
                      icon={<Folder className="h-6 w-6" />}
                    />
                    <StatCard
                      title="Last Updated"
                      value={format(new Date(folder.updatedAt), "MMM d, yyyy")}
                      icon={<Calendar className="h-6 w-6" />}
                    />
                  </CardContent>

                  <CardFooter className="bg-gray-100 border-t border-gray-200 p-4">
                    <Button
                      className="w-full text-primary bg-zinc-800 rounded-[4px] text-white hover:bg-zinc-700"
                      onClick={() => router.push(`/folder/${folder.id}`)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {folders && folders.length > 0 && (
        <div className="fixed right-8 flex flex-col top-1/2 transform -translate-y-1/2 space-y-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setActiveIndex(
                Math.min((folders?.length || 1) - 1, activeIndex + 1)
              )
            }
            disabled={activeIndex === (folders?.length || 1) - 1}
            className="rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

const getColorByStatTitle = (title: string) => {
  switch (title) {
    case "Total Subfolders":
      return "bg-gray-100 text-gray-900"; // Light gray background, dark gray text
    case "Total Quotes":
      return "bg-gray-100 text-gray-900"; // Slightly darker gray background, dark gray text
    case "Deepest Level":
      return "bg-gray-100 text-gray-900"; // Medium gray background, darker text
    case "Last Updated":
      return "bg-gray-100 text-gray-900"; // Darker gray background, light gray text
    default:
      return "bg-gray-100 text-gray-900"; // Default light gray and dark gray text
  }
};
