"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
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
import { useUser } from "@/hooks/useUser";
import { SmallCardView } from "./small-card-view";
import FullPageScrollView from "./full-page-scroll-view";
import { Grid2X2, Maximize2, Search } from "lucide-react";
import debounce from "lodash/debounce";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be 20 characters or less"),
  // description: z
  //   .string()
  //   .min(10, "Description must be at least 10 characters")
  //   .max(200, "Description must be 200 characters or less"),
});

const fetchFolders = async (url: string, userId: number): Promise<Folder[]> => {
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

const createFolder = async (name: string, userId: number): Promise<Folder> => {
  const response = await fetch("http://localhost:5000/api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create folder");
  }
  return response.json();
};

export default function SwitchableFolderDashboard() {
  const [newFolderName, setNewFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFullPageView, setIsFullPageView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // description: "",
    },
  });

  const {
    data: folders,
    error,
    isLoading,
    mutate,
  } = useSWR(user ? ["/api/folders", user.id] : null, ([url, userId]) =>
    fetchFolders(url, userId)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    if (user) {
      try {
        const newFolder = await createFolder(values.name.trim(), user.id);

        await mutate(async (currentFolders) => {
          return [...(currentFolders || []), newFolder];
        }, false);

        mutate();

        form.reset(); // Reset the form fields
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Folder created successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create folder",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  // const createNewFolder = async (e: React.FormEvent) => {
  //   setIsSubmitting(true);
  //   e.preventDefault();
  //   if (newFolderName.trim() && user) {
  //     try {
  //       const newFolder = await createFolder(newFolderName.trim(), user.id);

  //       await mutate(async (currentFolders) => {
  //         return [...(currentFolders || []), newFolder];
  //       }, false);

  //       mutate();

  //       setNewFolderName("");
  //       setIsDialogOpen(false);
  //       toast({
  //         title: "Success",
  //         description: "Folder created successfully",
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to create folder",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }
  // };

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

  const filteredFolders = folders?.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grainy ">
      <div
        className={`${
          isFullPageView ? "h-screen overflow-hidden" : "min-h-screen"
        }`}
      >
        <div className="relative py-6 px-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md rounded-b-xl ">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            {filteredFolders?.length || 0}
            <span className="text-lg text-gray-500 ml-2">
              {filteredFolders?.length === 1 ? "folder" : "folders"}
            </span>
          </h1>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
            <Input
              type="search"
              placeholder="Search folders..."
              className="pl-12 pr-4 py-3 flex-1 rounded-[4px] border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-slate-400"
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="px-4 py-2 rounded-[4px] border-gray-300 hover:border-gray-400 transition"
              onClick={() => setIsFullPageView(!isFullPageView)}
              title={
                isFullPageView
                  ? "Switch to Grid View"
                  : "Switch to Full Page View"
              }
            >
              {isFullPageView ? (
                <Grid2X2 className="h-5 w-5 text-gray-700" />
              ) : (
                <Maximize2 className="h-5 w-5 text-gray-700" />
              )}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-500 px-6 py-3 rounded-[8px] font-medium transition shadow-md">
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-5xl font-serif h-full font-bold text-gray-800 flex flex-col">
                    Create Folder
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter folder name"
                              {...field}
                              className="w-full rounded-[8px] placeholder:text-neutral-400 border border-gray-300 focus:outline-none focus:border-black focus:border-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Choose a concise and descriptive name for your folder.
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter tag description"
                              {...field}
                              className="w-full rounded-[8px] placeholder:text-neutral-400 px-3 py-2 border border-gray-300 focus:outline-none focus:border-black focus:border-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Provide a brief explanation of what this tag
                            represents.
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    /> */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 text-white bg-black hover:bg-black/90 rounded-[8px] transition duration-300"
                    >
                      {isSubmitting ? "Creating..." : "Create Folder"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-700">Loading folders...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading folders: {error.message}
          </div>
        ) : filteredFolders && filteredFolders.length === 0 ? (
          <div className="text-center text-amber-700">
            {searchQuery
              ? "No matching folders found."
              : "No folders found. Create your first folder!"}
          </div>
        ) : (
          <div
            className={`${isFullPageView ? "h-[calc(100vh-200px)]" : "h-full"}`}
          >
            {isFullPageView ? (
              <FullPageScrollView
                folders={filteredFolders}
                isLoading={false}
                error={null}
              />
            ) : (
              <SmallCardView
                folders={filteredFolders}
                isLoading={false}
                error={null}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
