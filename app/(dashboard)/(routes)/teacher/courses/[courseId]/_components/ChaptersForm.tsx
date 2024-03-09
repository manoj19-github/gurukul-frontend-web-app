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
  chaptersFormSchema,
} from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  createChaptersService,
  onReOrderChapterService,
  patchCourseHandler,
} from "@/app/services/courseRelated.service";
import { Chapter, Course } from "@prisma/client";
import ChapterList from "./ChapterList";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}
const ChaptersForm: FC<ChaptersFormProps> = ({
  initialData,
  courseId,
}): JSX.Element => {
  const router = useRouter();
  const formController = useForm<z.infer<typeof chaptersFormSchema>>({
    resolver: zodResolver(chaptersFormSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = formController.formState;
  console.log(formController.formState.errors);
  const successCallback = () => {
    toast.success("Chapter successfully created");
    router.refresh();
    formController.reset();
    setIsCreating(false);
    // setIsEditing(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
  };
  const onSubmit = async (values: z.infer<typeof chaptersFormSchema>) => {
    console.log("values: ", values);
    await createChaptersService({
      values,
      onErrorCallback: errorCallback,
      courseId,
      onSuccessCallback: successCallback,
    });
  };
  console.log("isValid : ", isValid);
  console.log("isSubmitting : ", isSubmitting);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const reorderError = () => {
    toast.error("something went wrong");
    setIsUpdating(false);
  };
  const reOrderSuccess = (successMessage: string) => {
    setIsUpdating(false);
    toast.success(successMessage);
    router.refresh();
  };

  const onReorderHandler = async (
    updatedData: {
      id: string;
      position: number;
    }[]
  ) => {
    await onReOrderChapterService({
      updatedData,
      courseId,
      onErrorCallback: reorderError,
      onSuccessCallback: reOrderSuccess,
      onLoading: () => setIsUpdating(true),
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button variant="ghost" onClick={() => setIsCreating((prev) => !prev)}>
          {isCreating ? (
            <Fragment>Cancel</Fragment>
          ) : (
            <Fragment>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Fragment>
          )}
        </Button>
      </div>
      {!isCreating ? (
        <></>
      ) : (
        <>
          <Form {...formController}>
            <form
              onSubmit={formController.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={formController.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Introduction to the course' "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isSubmitting} type="submit">
                Create
              </Button>
            </form>
          </Form>
        </>
      )}
      {!isCreating ? (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length ? "text-slate-500 italic" : ""
          )}
        >
          {!initialData.chapters.length ? "No Chapters " : ""}
        </div>
      ) : (
        <></>
      )}
      {initialData.chapters.length > 0 ? (
        <ChapterList
          onEdit={(id: string) => onEditChapterHandler(id)}
          onReorder={onReorderHandler}
          items={initialData.chapters || []}
          isUpdating={isUpdating}
        />
      ) : (
        <></>
      )}
      {!isCreating ? (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChaptersForm;
