"use client"

import { useState, useRef, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Folder, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/useUser"
import { Skeleton } from "@/components/ui/skeleton"

type Folder = {
  id: number
  name: string
}

const fetchFolders = async (url: string, userId: number): Promise<Folder[]> => {
  const response = await fetch(
    `http://localhost:5000/api/folders/user/${userId}`,
    {
      credentials: "include",
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch folders")
  }
  return response.json()
}

const createFolder = async (name: string, userId: number): Promise<Folder> => {
  const response = await fetch("http://localhost:5000/api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, userId }),
  })
  if (!response.ok) {
    throw new Error("Failed to create folder")
  }
  return response.json()
}

export default function FullPageScrollingFolders() {
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { user } = useUser()

  const {
    data: folders,
    error,
    isLoading,
    mutate,
  } = useSWR(
    user ? ["/api/folders", user.id] : null,
    ([url, userId]) => fetchFolders(url, userId)
  )

  const createNewFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newFolderName.trim() && user) {
      try {
        const newFolder = await createFolder(newFolderName.trim(), user.id)

        await mutate(async (currentFolders) => {
          return [...(currentFolders || []), newFolder]
        }, false)

        mutate()

        setNewFolderName("")
        setIsDialogOpen(false)
        toast({
          title: "Success",
          description: "Folder created successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create folder",
          variant: "destructive",
        })
      }
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0 && activeIndex < (folders?.length || 0) - 1) {
        setActiveIndex(activeIndex + 1)
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [activeIndex, folders])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.style.transform = `translateY(-${activeIndex * 100}%)`
    }
  }, [activeIndex])

  if (error) {
    return <div>Error loading folders</div>
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-4 right-4 z-10">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-[8px]">
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[8px]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-800">
                Create New Folder
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={createNewFolder}
              className="space-y-4 flex flex-col items-end justify-end"
            >
              <Input
                value={newFolderName}
                className="rounded-[4px] border-green-400"
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                required
              />
              <Button
                variant="default"
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Create Folder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div
        ref={containerRef}
        className="h-full transition-transform duration-500 ease-in-out"
      >
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <Skeleton className="h-[80%] w-[80%] rounded-md" />
          </div>
        ) : folders && folders.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-center text-green-700">
            No folders found. Create your first folder!
          </div>
        ) : (
          folders?.map((folder, index) => (
            <div
              key={folder.id}
              className="h-screen w-full flex items-center justify-center p-8"
            >
              <Card className="w-full h-full max-w-4xl overflow-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800 text-3xl">
                    <Folder className="h-8 w-8 text-green-600" />
                    <span>{folder.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">
                    This is the content of your {folder.name} folder. Add your folder-specific content here.
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {folders && folders.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setActiveIndex(Math.min((folders?.length || 1) - 1, activeIndex + 1))}
            disabled={activeIndex === (folders?.length || 1) - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}