// src/modules/tag/models/Tag.ts
export interface Tag {
    id: number;
    name: string;
    description?: string;
    type: 'BUILTIN' | 'CUSTOM';
    userId?: number;
    quotes: { id: number }[];
    color?: string;
    createdAt: Date;
    updatedAt: Date;
  }