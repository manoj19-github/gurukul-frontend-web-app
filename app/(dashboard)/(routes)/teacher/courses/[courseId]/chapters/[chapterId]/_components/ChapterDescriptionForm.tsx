"use client";
import React, { FC, Fragment, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  CrateCourseDescriptionSchema,
  CrateCourseSchema,
} from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { patchCourseHandler } from "@/app/services/courseRelated.service";
import { editChaptersAction } from "@/app/services/chapterRelated.service";
import Editor from "@/components/Editor";
import { Chapter } from "@prisma/client";
import PreviewEditor from "@/components/PreviewEditor";

interface ChapterDescriptionProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterDescription: FC<ChapterDescriptionProps> = ({
  initialData,
  courseId,
  chapterId,
}): JSX.Element => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formController = useForm<z.infer<typeof CrateCourseDescriptionSchema>>({
    resolver: zodResolver(CrateCourseDescriptionSchema),
    defaultValues: { description: initialData.description ?? "" },
  });
  const { isSubmitting, isValid } = formController.formState;
  console.log(formController.formState.errors);
  const successCallback = () => {
    toast.success("Chapter Description updated");
    router.refresh();
    setIsEditing(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
    setIsEditing(false);
  };
  const onSubmit = async (
    values: z.infer<typeof CrateCourseDescriptionSchema>
  ) => {
    await editChaptersAction({
      values: { ...values, chapterId, courseId },
      onErrorCallback: errorCallback,
      startLoading: () => setIsEditing(true),
      onSuccessCallback: successCallback,
    });
  };
  console.log("isValid : ", isValid);
  console.log("isSubmitting : ", isSubmitting);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <Fragment>Cancel</Fragment>
          ) : (
            <Fragment>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Fragment>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            "text-sm mt-2 ",
            !initialData.description ? "text-slate-500 italic" : ""
          )}
        >
          {!initialData.description ? "No description" : ""}
          {initialData.description ? (
            <PreviewEditor value={initialData.description} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <>
          <Form {...formController}>
            <form
              onSubmit={formController.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={formController.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ChapterDescription;
