import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

const builtInItems = [
  { title: "Inspirational", color: "bg-blue-500" },
  { title: "Motivational", color: "bg-green-500" },
  { title: "Literary", color: "bg-yellow-500" },
  { title: "Philosophy", color: "bg-purple-500" },
  { title: "Science", color: "bg-red-500" },
  { title: "History", color: "bg-indigo-500" },
  { title: "Humor", color: "bg-pink-500" },
  { title: "Life", color: "bg-teal-500" },
]

const customItems = [
  { title: "Deep Thoughts", color: "bg-blue-800" },
  { title: "Thrill Seeker", color: "bg-green-700" },
  { title: "Creative Vibes", color: "bg-yellow-500" },
  { title: "Tech Talk", color: "bg-purple-800" },
  { title: "Mind Games", color: "bg-red-600" },
  { title: "Wanderlust", color: "bg-indigo-700" },
  { title: "Fit Life", color: "bg-pink-600" },
  { title: "Soul Searching", color: "bg-teal-600" },
]

export function BuiltInTagContent() {
  return (
    <>
      {builtInItems.map((item, index) => (
        <Card key={index} className="w-48 h-24 mx-2 flex items-center justify-center">
          <CardContent className="p-4 text-center">
            <div className={`${item.color} text-white p-1 rounded-[4px]`}>{item.title}</div>
            {/* <p className="mt-2 text-sm text-muted-foreground">Quote Category</p> */}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function CustomTagContent() {
  return (
    <>
      {customItems.map((item, index) => (
        <Card key={index} className="w-48 h-24 mx-2 flex items-center justify-center">
          <CardContent className="p-4 text-center">
            <div className={`${item.color} text-white p-1 rounded-[4px]`}>{item.title}</div>
            {/* <p className="mt-2 text-sm text-muted-foreground">Quote Category</p> */}
          </CardContent>
        </Card>
      ))}
    </>
  )
}