"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, TagIcon, Filter } from "lucide-react";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { Tag } from "@/models/Tag";
import { useRouter } from "next/navigation";
import { useTags } from "@/hooks/useTags";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be 20 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be 200 characters or less"),
  color: z
    .string()
    .regex(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, "Invalid color format")
    .optional()
    .or(z.literal("")),
});

type ViewMode = "ALL" | "CUSTOM" | "BUILTIN";

export default function Component() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");

  const router = useRouter();
  const { user } = useUser();

  const { tagsData, loading, error } = useTags(user?.id ?? null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
    },
  });

  const sortTags = (tagsToSort: Tag[]): Tag[] => {
    return [
      ...tagsToSort.filter((tag) => tag.type === "CUSTOM"),
      ...tagsToSort.filter((tag) => tag.type === "BUILTIN"),
    ];
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      if (tagsData?.tags) {
        filterTags(query, viewMode, tagsData.tags);
      }
    }, 300),
    [tagsData?.tags, viewMode]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filterTags = (query: string, mode: ViewMode, tags: Tag[]) => {
    let filtered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase())
    );

    if (mode === "CUSTOM") {
      filtered = filtered.filter((tag) => tag.type === "CUSTOM");
    } else if (mode === "BUILTIN") {
      filtered = filtered.filter((tag) => tag.type === "BUILTIN");
    } else {
      filtered = sortTags(filtered);
    }

    setFilteredTags(filtered);
  };

  const cycleViewMode = () => {
    const modes: ViewMode[] = ["ALL", "CUSTOM", "BUILTIN"];
    const currentIndex = modes.indexOf(viewMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setViewMode(nextMode);
    if (tagsData?.tags) {
      filterTags(searchQuery, nextMode, tagsData.tags);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const dataToSend = {
      ...values,
      userId: user?.id,
      color: values.color
        ? values.color.startsWith("#")
          ? values.color
          : `#${values.color}`
        : undefined,
    };
    try {
      const response = await fetch(`http://localhost:5000/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Tag created successfully",
        });

        // Refresh tags by re-fetching
        const refreshResponse = await fetch(
          `http://localhost:5000/api/tags/user/${user?.id}`,
          {
            credentials: "include",
          }
        );
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          if (refreshedData.status === "success") {
            filterTags(searchQuery, viewMode, refreshedData.tags);
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create tag",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (tagsData?.tags) {
      filterTags(searchQuery, viewMode, tagsData.tags);
    }
  }, [tagsData, searchQuery, viewMode]);

  return (
    <div className="grainy min-h-screen">
      <div className="h-screen flex flex-col pb-20 md:pb-14">
        <div className="relative py-6 px-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md rounded-b-xl">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            {filteredTags.length}
            <span className="text-lg text-gray-500 ml-2">
              {filteredTags.length === 1 ? "tag" : "tags"}
            </span>
          </h1>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tags..."
              className="pl-12 pr-4 py-3 flex-1 rounded-[4px] border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-slate-400"
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="px-4 py-2 rounded-[4px] border-gray-300 hover:border-gray-400 transition"
              onClick={cycleViewMode}
              title="Change view mode"
            >
              <Filter className="h-5 w-5 text-gray-700 mr-2" />
              {viewMode === "ALL"
                ? "All Tags"
                : viewMode === "CUSTOM"
                ? "Custom Tags"
                : "Common Tags"}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-500 px-6 py-3 rounded-[8px] font-medium transition shadow-md">
                  New Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-5xl font-serif h-full font-bold text-gray-800 flex flex-col">
                    Create Tag
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
                              placeholder="Enter tag name"
                              {...field}
                              className="w-full rounded-[8px] placeholder:text-neutral-400 border border-gray-300 focus:outline-none focus:border-black focus:border-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Choose a concise and descriptive name for your tag.
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
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
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700">
                            Color (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter color name or hex code (e.g. red or #FF0000)"
                              {...field}
                              className="w-full rounded-[8px] placeholder:text-neutral-400 border border-gray-300 focus:outline-none focus:border-black focus:border-2"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Choose a color for your tag (optional). Use hex code
                            format.
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 text-white bg-black hover:bg-black/90 rounded-[8px] transition duration-300"
                    >
                      {isSubmitting ? "Creating..." : "Create Tag"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto py-6 px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className="block group"
              >
                <div className="flex flex-col justify-between rounded-[8px] h-[208px] text-white shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div
                    className="h-2"
                    style={{
                      backgroundColor:
                        tag.color ||
                        (tag.type === "CUSTOM" ? "#bdbdbd" : "initial"),
                    }}
                  ></div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {tag.name}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          tag.type === "CUSTOM"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tag.type === "BUILTIN" ? "Common" : tag.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tag.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <TagIcon className="mr-2 h-4 w-4" />
                      {tag.quotes.length} quotes
                    </div>
                  </div>
                  <div
                    className="px-5 py-3"
                    style={{
                      backgroundColor:
                        tag.color ||
                        (tag.type === "CUSTOM" ? "#bdbdbd" : "initial"),
                    }}
                  >
                    <span className="text-white text-sm font-medium transition-colors duration-300">
                      View Tag →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
