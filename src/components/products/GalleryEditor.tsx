"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableGalleryItem } from "./SortableGalleryItem";

interface Props {
  initialUrls: string[];
  onChange: (urls: string[]) => void; // pushes latest order up to parent form
}

export function GalleryEditor({ initialUrls, onChange }: Props) {
  // give each url a stable id — the url itself works since they're unique
  const [items, setItems] = useState(initialUrls);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    const newOrder = arrayMove(items, oldIndex, newIndex);

    setItems(newOrder);
    onChange(newOrder);
  }

  function handleRemove(id: string) {
    const newOrder = items.filter((url) => url !== id);
    setItems(newOrder);
    onChange(newOrder);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {items.map((url) => (
            <SortableGalleryItem
              key={url}
              id={url}
              url={url}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
