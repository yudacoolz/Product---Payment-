"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

interface Props {
  id: string;
  url: string;
  onRemove: (id: string) => void;
}

export function SortableGalleryItem({ id, url, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border bg-white"
    >
      <img src={url} alt="" className="w-full h-32 object-cover" />

      {/* drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 p-1 rounded bg-black/50 text-white cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      {/* remove button */}
      <button
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}
