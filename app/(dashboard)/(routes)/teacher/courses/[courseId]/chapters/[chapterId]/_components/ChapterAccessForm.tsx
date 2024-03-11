"use client";
import React, { FC, Fragment, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  CrateCourseDescriptionSchema,
  CrateCourseSchema,
  chapterAccessFormSchema,
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
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterAccessForm: FC<ChapterAccessFormProps> = ({
  initialData,
  courseId,
  chapterId,
}): JSX.Element => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formController = useForm<z.infer<typeof chapterAccessFormSchema>>({
    resolver: zodResolver(CrateCourseDescriptionSchema),
    defaultValues: { isFree: Boolean(initialData.isFree) },
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
  const onSubmit = async (values: z.infer<typeof chapterAccessFormSchema>) => {
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
        Chapter Access
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
            !initialData.isFree ? "text-slate-500 italic" : ""
          )}
        >
          {initialData?.isFree ? (
            <>This chapter is for preview</>
          ) : (
            <>This chapter is not free</>
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
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to make this chapter is for
                        preview
                      </FormDescription>
                    </div>
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

export default ChapterAccessForm;
