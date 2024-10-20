"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import useSWR from "swr";
import backgroundLeaves from "../../../../public/leaves.svg";
import { Folder } from "@/models/Folder";
import { Badge } from "@/components/ui/badge";
// Define the valid text align values for CSS
type TextAlign = "left" | "right" | "center" | "justify";
type ListType = "ordered" | "bullet";

type Quote = {
  id: number;
  content: string;
  userId: number;
  folderId: number;
  folder: Folder;
};

type QuoteContent = {
  ops: Array<{
    insert: string;
    attributes?: {
      align?: TextAlign;
      list?: ListType;
      background?: string;
      color?: string;
      font?: string;
      bold?: boolean;
      italic?: boolean;
      strike?: boolean;
    };
  }>;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

function parseQuoteContent(content: string): {
  contentBlocks: Array<{
    text: string;
    style: React.CSSProperties;
    backgroundColor?: string;
    backgroundImage?: string;
  }>;
  dimensions: { width: number; height: number };
} {
  try {
    const parsedContent: QuoteContent = JSON.parse(content);

    let dimensions = { width: 300, height: 200 }; // Default dimensions
    const contentBlocks: Array<{
      text: string;
      style: React.CSSProperties;
      backgroundColor?: string;
      backgroundImage?: string;
    }> = [];

    parsedContent.ops.forEach((op) => {
      const style: React.CSSProperties = {};

      if (op.insert.startsWith("__dimensions__:")) {
        const [width, height] = op.insert
          .replace("__dimensions__:", "")
          .split("x")
          .map(Number);
        dimensions = { width, height };
      } else if (op.insert.startsWith("__backgroundImage__")) {
        // Handle background image
        const imageUrl = op.insert.replace("__backgroundImage__:", "").trim();
        contentBlocks.push({
          text: "",
          style,
          backgroundImage: `url(${imageUrl})`,
        });
      } else if (op.insert.startsWith("__backgroundColor__")) {
        // Handle background color
        const color = op.insert.replace("__backgroundColor__:", "").trim();
        contentBlocks.push({
          text: "",
          style,
          backgroundColor: color,
        });
      } else {
        // Set text style based on attributes
        if (op.attributes?.color) style.color = op.attributes.color;
        if (op.attributes?.background)
          style.backgroundColor = op.attributes.background;
        if (op.attributes?.font) style.fontFamily = op.attributes.font;
        if (op.attributes?.bold) style.fontWeight = "bold";
        if (op.attributes?.italic) style.fontStyle = "italic";
        if (op.attributes?.strike) style.textDecoration = "line-through";
        if (op.attributes?.align) style.textAlign = op.attributes.align;

        contentBlocks.push({
          text: op.insert,
          style,
        });
      }
    });

    return { contentBlocks, dimensions };
  } catch (error) {
    console.error("Error parsing quote content:", error);
    return {
      contentBlocks: [{ text: content, style: {} }],
      dimensions: { width: 300, height: 200 },
    };
  }
}

export default function SingleQuotePage() {
  const params = useParams();
  const quoteId = params.id as string;

  const {
    data: quote,
    error,
    isLoading,
  } = useSWR<Quote>(
    quoteId ? `http://localhost:5000/api/quotes/${quoteId}` : null,
    fetcher
  );

  if (error)
    return <div className="text-center text-red-500">Failed to load quote</div>;
  if (isLoading) return <Skeleton className="w-full h-64" />;

  if (!quote)
    return <div className="text-center text-gray-500">No quote found</div>;

  const { contentBlocks, dimensions } = parseQuoteContent(quote.content);
  console.log("Parsed content blocks:", contentBlocks);
  console.log("Parsed dimensions:", dimensions);

  // Initialize background styles
  let backgroundColor = "";
  let backgroundImage = "";

  // Loop through content blocks to find any background settings
  contentBlocks.forEach((block) => {
    if (block.backgroundColor) {
      backgroundColor = block.backgroundColor;
    }
    if (block.backgroundImage) {
      backgroundImage = block.backgroundImage;
    }
  });

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-repeat opacity-50"
        style={{
          backgroundImage: `url(${backgroundLeaves.src})`,
          backgroundSize: "400px",
          zIndex: 0,
        }}
      />
      {/* <div className="absolute left-2 right-2 z-20">{quote.folder.name}</div> */}
      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {" "}
        <Card className="max-w-2xl w-full bg-white">
          <CardContent className="p-6">
            <div
              className="relative rounded-[8px] p-8 flex"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                maxWidth: "100%",
                margin: "0 auto",
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage ? backgroundImage : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <blockquote className="relative z-10 text-green-800 font-serif text-lg italic">
                {contentBlocks.map((block, index) => (
                  <p key={index} style={block.style}>
                    {block.text}
                  </p>
                ))}
              </blockquote>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
