"use client";
import {
  deleteChapterAction,
  handlePublishAndUnPublish,
} from "@/app/services/chapterRelated.service";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import { Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}
const ChapterActions: FC<ChapterActionsProps> = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const onDeleteSuccessCallback = () => {
    toast.success("Chapter Deleted Successfully");
    setIsLoading(false);
    router.refresh();
  };
  const onPublishUnPublishCallback = () => {
    toast.success("Chapter Deleted Successfully");
    setIsLoading(false);
    router.refresh();
  };
  const onDeleteErrorCallback = () => {
    toast.error("Something went wrong");
    setIsLoading(false);
  };
  const onDeleteConfirmHandler = () => {
    deleteChapterAction({
      startLoading: () => setIsLoading(true),
      values: { courseId, chapterId },
      onErrorCallback: onDeleteErrorCallback,
      onSuccessCallback: onDeleteSuccessCallback,
    });
  };
  const onPublishAndUnPublishAction = () => {
    handlePublishAndUnPublish({
      startLoading: () => setIsLoading(true),
      values: { courseId, chapterId },
      onErrorCallback: onDeleteErrorCallback,
      onSuccessCallback: onPublishUnPublishCallback,
      isPublished,
    });
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublishAndUnPublishAction}
        disabled={disabled || isLoading}
        variant={"outline"}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={() => onDeleteConfirmHandler()}
        disabled={isLoading}
      >
        <Button size="sm" variant={"outline"}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
