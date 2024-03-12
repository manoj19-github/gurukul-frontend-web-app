import * as z from "zod";
import { CrateCourseSchema } from "../formSchema/createCourse.schema";

import { SUBURLS } from "@/environments";
import { restClient } from "./rest";
import toast from "react-hot-toast";

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

export const patchCourseHandler = async ({
  values,
  onError,
  onSubmit,
  courseId,
}: {
  values: any;
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

export const createChaptersService = async ({
  courseId,
  values,
  onSuccessCallback,
  onErrorCallback,
}: {
  courseId: string;
  values: any;
  onSuccessCallback: any;
  onErrorCallback: any;
}) => {
  try {
    await restClient.post(`/api/courses/${courseId}/chapters`, values);
    onSuccessCallback?.();
  } catch (error) {
    onErrorCallback?.();
  }
};

export const onReOrderChapterService = async ({
  updatedData,
  courseId,
  onErrorCallback,
  onSuccessCallback,
  onLoading,
}: {
  updatedData: Array<{ id: string; position: number }>;
  onLoading: any;
  onSuccessCallback: any;
  onErrorCallback: any;
  courseId: string;
}) => {
  try {
    onLoading();
    const response = await restClient.put(
      `/api/courses/${courseId}/chapters/reorder`,
      {
        list: [...updatedData],
      }
    );
    console.log("response : ", response);
    onSuccessCallback?.(response?.data?.message || "");
  } catch (error: any) {
    console.log(error);
    onErrorCallback?.();
  }
};
