import { Folder } from "@/models/Folder";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFolders(userId: number): Promise<Folder[]> {
  const response = await fetch(`${API_BASE_URL}/folders/user/${userId}`, {
    credentials: 'include',
    // In Next.js 13.4+, you can use the new 'server' option, which is more secure:
    // next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }
  
  return response.json();
}

export async function createFolder(name: string, userId: number): Promise<Folder> {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create folder');
  }
  
  return response.json();
}