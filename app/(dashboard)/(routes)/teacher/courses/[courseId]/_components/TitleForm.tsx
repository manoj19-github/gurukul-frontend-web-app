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
import { CrateCourseSchema } from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { patchCourseTitleHandler } from "@/app/services/createCourse.service";

interface TitleFormProps {
  initialData: { title: string };
  courseId: string;
}
const TitleForm: FC<TitleFormProps> = ({
  initialData,
  courseId,
}): JSX.Element => {
  const router = useRouter();
  const formController = useForm<z.infer<typeof CrateCourseSchema>>({
    resolver: zodResolver(CrateCourseSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = formController.formState;
  console.log(formController.formState.errors);
  const successCallback = () => {
    toast.success("Course Title updated");
    router.refresh();
    setIsEditing(false);
  };
  const errorCallback = () => {
    toast.success("Something went wrong");
  };
  const onSubmit = async (values: z.infer<typeof CrateCourseSchema>) => {
    await patchCourseTitleHandler({
      values,
      onError: errorCallback,
      courseId: courseId,
      onSubmit: successCallback,
    });
  };
  console.log("isValid : ", isValid);
  console.log("isSubmitting : ", isSubmitting);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Title
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <Fragment>Cancel</Fragment>
          ) : (
            <Fragment>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </Fragment>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">{initialData.title}</p>
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
                        placeholder="e.g 'Advanced Web Development' "
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
      )}
    </div>
  );
};

export default TitleForm;
