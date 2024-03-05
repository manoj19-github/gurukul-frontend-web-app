"use client";
import { Chapter } from "@prisma/client";
import React, { FC, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: Array<{ id: string; position: number }>) => void;
  onEdit: (id: string) => void;
}
const ChapterList: FC<ChapterListProps> = ({
  items,
  onEdit,
  onReorder,
}): JSX.Element => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // rehydrate our items
  useEffect(() => {
    setChapters(items);
  }, [items]);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const startIndex = Math.max(result.source.index, result.destination.index);
    const endIndex = Math.min(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);
    const bulkUpdatedData = updatedChapters.map((self) => ({
      id: self.id,
      position: items.findIndex((item) => item.id === self.id),
    }));
    onReorder(bulkUpdatedData);
  };
  if (!isMounted) return <></>;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="mt-5"
          >
            {chapters.map((self, index) => (
              <Draggable key={index} draggableId={self.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 mt-2 text-sm",
                      self.isPublished
                        ? "bg-sky-100 border-sky-200 text-sky-700"
                        : ""
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r w-full border-r-slate-200 flex justify-between items-center space-x-3 hover:bg-slate-300 rounded-l=-md transition",
                        self.isPublished
                          ? "border-r-sky-200 hover:bg-sky-200"
                          : ""
                      )}
                      {...provided.dragHandleProps}
                    >
                      <div className="flex space-x-4 items-center">
                        <Grip className="h-4 w-4" />
                        <p>{self.title}</p>
                      </div>
                      <div className=" pr-2 flex items-center gap-x-2">
                        {self.isFree ? <Badge>Free</Badge> : <></>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            self.isPublished ? "bg-sky-700" : ""
                          )}
                        >
                          {self.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(self.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
