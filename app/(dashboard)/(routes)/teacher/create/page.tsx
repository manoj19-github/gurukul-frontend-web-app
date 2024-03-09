"use client";

import useMounted from "@/hooks/useMounted";
import React, { FC, useEffect } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

import { Input } from "@/components/ui/input";
import { CrateCourseSchema } from "@/app/formSchema/createCourse.schema";
import { createCourseHandler } from "@/app/services/courseRelated.service";

interface CreatePageProps {}

const CreatePage: FC<CreatePageProps> = (): JSX.Element => {
  const isMounted = useMounted();
  const router = useRouter();

  const form = useForm<z.infer<typeof CrateCourseSchema>>({
    resolver: zodResolver(CrateCourseSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmitHandler = async (values: z.infer<typeof CrateCourseSchema>) => {
    console.log(values);
    await createCourseHandler({
      values,
      onSubmit: (response: any) => {
        router.push(`/teacher/courses/${response.data.id}`);
      },
      onError: () => {
        toast.error("something went wrong");
      },
    });
  };

  if (!isMounted) return <></>;
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-3">Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
