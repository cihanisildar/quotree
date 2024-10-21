import React from "react";
import { Tag } from "@/models/Tag";
import { Button } from "@/components/ui/button";

interface TagSelectorProps {
  tags?: Tag[] | null;
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  loading: boolean;
}

export default function TagSelector({
  tags,
  selectedTags,
  onTagToggle,
  loading,
}: TagSelectorProps) {
  if (loading) {
    return <div>Loading tags...</div>;
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    return <div>No tags available</div>;
  }

  return (
    <div>
      <div className="mb-4 text-sm font-medium">
        Selected tags: {selectedTags.length} / {tags.length}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);
          return (
            <Button
              key={tag.id}
              onClick={() => onTagToggle(tag)}
              variant={isSelected ? "default" : "secondary"}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {tag.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}