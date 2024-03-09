"use client";
import React, { FC, Fragment, useState } from "react";
import * as z from "zod";
import { CrateImageSchema } from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { patchCourseHandler } from "@/app/services/courseRelated.service";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}
const ImageForm: FC<ImageFormProps> = ({
  initialData,
  courseId,
}): JSX.Element => {
  const router = useRouter();
  const successCallback = () => {
    toast.success("Course Description updated");
    router.refresh();
    setIsEditing(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
  };
  const onSubmit = async (values: z.infer<typeof CrateImageSchema>) => {
    await patchCourseHandler({
      values,
      onError: errorCallback,
      courseId: courseId,
      onSubmit: successCallback,
    });
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleImage = (url: any) => {
    console.log("url: ", url);
    if (url) {
      onSubmit({ imageUrl: url });
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {!!isEditing ? <Fragment>Cancel</Fragment> : <></>}
          {!isEditing && !initialData.imageUrl ? (
            <Fragment>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Fragment>
          ) : !isEditing ? (
            <Fragment>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Fragment>
          ) : (
            <></>
          )}
        </Button>
      </div>

      {!isEditing && !initialData.imageUrl ? (
        <>
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        </>
      ) : initialData.imageUrl ? (
        <div className="relative aspect-video mt-2">
          <Image
            alt="upload"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      ) : (
        <></>
      )}
      {!!isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(file: any) => handleImage(file)}
          />
          <div className="text-xs text muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2 ",
            !initialData.imageUrl ? "text-slate-500 italic" : ""
          )}
        >
          {initialData.imageUrl || "No image"}
        </p>
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
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="e.g 'This course is about ...' "
                        {...field}
                      />
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
      )} */}
    </div>
  );
};

export default ImageForm;
