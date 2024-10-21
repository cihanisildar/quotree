import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type Folder = {
  id: number;
  name: string;
};

type SmallCardViewProps = {
  folders: Folder[] | undefined;
  isLoading: boolean;
  error: any;
};

export function SmallCardView({ folders, isLoading, error }: SmallCardViewProps) {
  const router = useRouter();

  if (error) {
    return <div className="p-4 text-red-500">Error loading folders</div>;
  }

  return (
    <div className="overflow-y-scroll pt-8">
      <div className="h-[calc(100vh-200px)] px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : folders && folders.length === 0 ? (
              <div className="text-center text-gray-700 text-lg">
                No folders found. Create your first folder!
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {folders?.map((folder) => (
                  <div
                    key={folder.id}
                    className="cursor-pointer transform transition-transform duration-200"
                    onClick={() => router.push(`/dashboard/folders/${folder.id}`)}
                  >
                    <Card className="w-full h-full p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-3 text-gray-800 text-2xl font-semibold">
                          <Folder className="h-7 w-7 text-gray-900" />
                          <span>{folder.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-600 text-sm">
                        <p>
                          Click to view the contents of your <strong>{folder.name}</strong> folder.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
