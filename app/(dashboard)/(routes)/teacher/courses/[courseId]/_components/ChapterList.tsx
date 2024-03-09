"use client";
import { Chapter } from "@prisma/client";
import React, { FC, useEffect, useRef, useState } from "react";
import DraggableList from "react-draggable-list";

import { cn } from "@/lib/utils";
import { Grid, Grip, Loader2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: Array<{ id: string; position: number }>) => void;
  onEdit: (id: string) => void;
  isUpdating: boolean;
}
const ChapterList: FC<ChapterListProps> = ({
  items,
  onEdit,
  onReorder,
  isUpdating,
}): JSX.Element => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);
  const containerRef = useRef();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // rehydrate our items
  useEffect(() => {
    setChapters(items);
  }, [items]);

  const _onListChange = (newChapters: Chapter[]) => {
    console.log("newChapters: ", newChapters);
    setChapters(newChapters);
    onReorder(newChapters);
  };
  if (!isMounted) return <></>;
  return (
    <div className="relative">
      {isUpdating ? (
        <div className="rounded-md absolute w-full h-full flex justify-center items-center z-[10] bg-[rgba(0,0,0,0.2)]">
          <Loader2 className=" h-8 w-8 animate-spin  " />
        </div>
      ) : (
        <></>
      )}
      <DraggableList
        itemKey="id"
        template={Item as any}
        list={chapters}
        onMoveEnd={(newList: any) => _onListChange(newList)}
        container={() => containerRef.current}
      />
    </div>
  );
};

const Item = ({
  item,
  itemSelected,
  dragHandleProps,
  onEdit,
}: {
  item: any;
  itemSelected: any;
  dragHandleProps: any;
  onEdit: any;
}) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const router = useRouter();
  const { courseId } = useParams();
  const onEditChapterHandler = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };
  return (
    <div
      onMouseDown={(e: any) => onMouseDown(e)}
      onTouchStart={(e: any) => onTouchStart(e)}
      className={cn(
        "flex !cursor-pointer items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 mt-2 text-sm",
        item.isPublished ? "bg-sky-100 border-sky-200 text-sky-700" : ""
      )}
    >
      <div
        className={cn(
          "px-2 py-3 cursor-pointer border-r w-full border-r-slate-200 flex justify-between items-center space-x-3 hover:bg-slate-300 rounded-l=-md transition",
          item.isPublished ? "border-r-sky-200 hover:bg-sky-200" : ""
        )}
      >
        <div className="flex space-x-4 items-center cursor-pointer">
          <Grip className="h-4 w-4" />
          <p>{item.title}</p>
        </div>
        <div className=" pr-2 flex items-center gap-x-2">
          {item.isFree ? <Badge>Free</Badge> : <></>}
          <Badge
            className={cn("bg-slate-500", item.isPublished ? "bg-sky-700" : "")}
          >
            {item.isPublished ? "Published" : "Draft"}
          </Badge>
          <Pencil
            onClick={() => onEditChapterHandler(item.id)}
            className="w-4 h-4 cursor-pointer hover:opacity-75"
          />
        </div>
      </div>
    </div>
  );
};
export default ChapterList;
