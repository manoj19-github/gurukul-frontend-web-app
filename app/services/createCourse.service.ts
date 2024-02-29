import * as z from "zod";
import { CrateCourseSchema } from "../formSchema/createCourse.schema";

import { SUBURLS } from "@/environments";
import { restClient } from "./rest";

export const createCourseHandler = async ({
  values,
  onError,
  onSubmit,
}: {
  values: z.infer<typeof CrateCourseSchema>;
  onSubmit: any;
  onError: any;
}) => {
  try {
    console.log("hit ");
    const response = await restClient.post("/api/courses", values);
    onSubmit?.(response);
  } catch (error) {
    console.log("error", error);
    onError?.();
  }
};

export const patchCourseTitleHandler = async ({
  values,
  onError,
  onSubmit,
  courseId,
}: {
  values: z.infer<typeof CrateCourseSchema>;
  courseId: string;
  onSubmit: any;
  onError: any;
}) => {
  try {
    await restClient.patch(`/api/courses/${courseId}`, values);
    onSubmit?.();
  } catch (error) {
    onError?.();
  }
};