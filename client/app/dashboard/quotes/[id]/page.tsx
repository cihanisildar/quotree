"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import useSWR from "swr";
import backgroundLeaves from "../../../../public/leaves.svg";
import { Folder } from "@/models/Folder";
import { Badge } from "@/components/ui/badge";
import { Quote } from "@/models/Quote";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
// Define the valid text align values for CSS
type TextAlign = "left" | "right" | "center" | "justify";
type ListType = "ordered" | "bullet";

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

  console.log(quote);

  if (error)
    return <div className="text-center text-red-500">Failed to load quote</div>;
  if (isLoading) return <Skeleton className="w-full h-64" />;

  if (!quote)
    return <div className="text-center text-gray-500">No quote found</div>;

  const { contentBlocks, dimensions } = parseQuoteContent(quote.content);

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
      {quote.folder && (
        <Link
          href={`/dashboard/folders/${quote.folder.id}`}
          className="absolute left-2 top-2 z-20 flex items-center gap-2 bg-gray-50 p-2 rounded-[4px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out"
        >
          <FolderIcon className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {quote.folder.name}
          </span>
        </Link>
      )}

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {" "}
        <Card className="max-w-2xl w-full bg-white">
          <CardContent className="p-6">
            {quote.tags && quote.tags.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 text-white justify-end">
                {quote.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    style={{
                      backgroundColor: tag.color || "gray",
                      borderColor: tag.color || "gray",
                    }}
                    className="text-xs whitespace-nowrap rounded-[4px]"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
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
