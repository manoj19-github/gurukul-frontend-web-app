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
  createCategorySchema,
  CrateCourseSchema,
} from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { patchCourseHandler } from "@/app/services/createCourse.service";
import { Category } from "@prisma/client";
import { ComboBox } from "@/components/ui/combobox";

interface CategoriesFormProps {
  initialData: { categoryId: string | null };
  courseId: string;
  options: Category[];
}
const CategoriesForm: FC<CategoriesFormProps> = ({
  initialData,
  courseId,
  options,
}): JSX.Element => {
  const router = useRouter();
  const formController = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { categoryId: initialData.categoryId ?? "" },
  });
  const { isSubmitting, isValid } = formController.formState;
  console.log(formController.formState.errors);
  const successCallback = () => {
    toast.success("Course Description updated");
    router.refresh();
    setIsEditing(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
  };
  const onSubmit = async (values: z.infer<typeof createCategorySchema>) => {
    await patchCourseHandler({
      values,
      onError: errorCallback,
      courseId: courseId,
      onSubmit: successCallback,
    });
  };
  console.log("isValid : ", isValid);
  console.log("isSubmitting : ", isSubmitting);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const selectedOption = options.find(
    (self) => self.id === initialData.categoryId
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 ">
      <div className="font-medium flex items-center justify-between">
        Course category
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
        <></>
      ) : (
        <>
          <p
            className={cn(
              "text-sm mt-2 ",
              !selectedOption ? "text-slate-500 italic" : ""
            )}
          >
            {selectedOption?.name || "No description"}
          </p>

          <Form {...formController}>
            <form
              onSubmit={formController.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={formController.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboBox
                        {...field}
                        options={options}
                        keyName={"name"}
                        valName={"id"}
                        placeHolder={"Select category"}
                        noDataFound={"No category found"}
                        searchPlaceholder={"Search category"}
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

export default CategoriesForm;
