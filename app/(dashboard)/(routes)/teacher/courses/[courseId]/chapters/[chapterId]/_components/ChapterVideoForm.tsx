"use client";
import React, { FC, Fragment, useState } from "react";
import * as z from "zod";
import { ChapterVideoFormSchema } from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { patchCourseHandler } from "@/app/services/courseRelated.service";
import { editChaptersAction } from "@/app/services/chapterRelated.service";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: String;
}
const ChapterVideoForm: FC<ChapterVideoFormProps> = ({
  initialData,
  courseId,
  chapterId,
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const successCallback = () => {
    toast.success("Course Description updated");
    router.refresh();
    setIsEditing(false);
    setLoading(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
    setLoading(false);
  };
  const onSubmit = async (values: z.infer<typeof ChapterVideoFormSchema>) => {
    await editChaptersAction({
      values: { ...values, courseId, chapterId },
      onErrorCallback: errorCallback,
      onSuccessCallback: successCallback,
      startLoading: () => setLoading(true),
    });
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleImage = (url: any) => {
    console.log("url: ", url);
    if (url) {
      onSubmit({ videoUrl: url });
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {!!isEditing ? <Fragment>Cancel</Fragment> : <></>}
          {!isEditing && !initialData.videoUrl ? (
            <Fragment>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Fragment>
          ) : !isEditing && initialData.videoUrl ? (
            <Fragment>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Fragment>
          ) : (
            <></>
          )}
        </Button>
      </div>

      {!isEditing && !initialData.videoUrl ? (
        <Fragment>
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        </Fragment>
      ) : initialData.videoUrl ? (
        <div className="relative aspect-video mt-2">
          {/* <Image
            alt="upload"
            fill
            className="object-cover rounded-md"
            src={initialData.videoUrl}
          /> */}
          <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
        </div>
      ) : (
        <></>
      )}
      {!!isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(file: any) => handleImage(file)}
          />
          <div className="text-xs text muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      ) : (
        <></>
      )}
      {initialData.videoUrl && !isEditing ? (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process, refresh the page if video
          does not appear
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChapterVideoForm;
