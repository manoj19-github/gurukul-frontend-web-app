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
  createPriceSchema,
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
import { formatPrice } from "@/utils/format";

interface PriceFormProps {
  initialData: { price: number | undefined | null };
  courseId: string;
}
const PriceForm: FC<PriceFormProps> = ({
  initialData,
  courseId,
}): JSX.Element => {
  const router = useRouter();
  const formController = useForm<z.infer<typeof createPriceSchema>>({
    resolver: zodResolver(createPriceSchema),
    defaultValues: { price: initialData.price ?? undefined },
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
  const onSubmit = async (values: z.infer<typeof createPriceSchema>) => {
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
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
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
        <p
          className={cn(
            "text-sm mt-2 ",
            !initialData.price ? "text-slate-500 italic" : ""
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : "No price"}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={isSubmitting}
                        placeholder="Set a price for your course"
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

export default PriceForm;
