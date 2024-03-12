import { restClient } from "./rest";

export const editChaptersAction = async ({
  values,

  startLoading,
  onSuccessCallback,
  onErrorCallback,
}: {
  values: any;
  startLoading: any;
  onErrorCallback: any;
  onSuccessCallback: any;
}) => {
  try {
    startLoading?.();
    const response = await restClient.patch(
      `/api/courses/${values.courseId}/chapters/${values.chapterId}`,
      values
    );

    onSuccessCallback?.();
  } catch (error: any) {
    console.log("error : ", error);
    onErrorCallback?.();
  }
};


export const deleteChapterAction = async ({
  values,
  startLoading,
  onSuccessCallback,
  onErrorCallback,
}: {
  values: { courseId: string; chapterId: string };
  startLoading: () => void;
  onSuccessCallback: any;
  onErrorCallback: any;
}) => {
  try {
    startLoading?.();
    await restClient.delete(
      `/api/courses/${values.courseId}/chapters/${values.chapterId}`
    );
    onSuccessCallback?.();
  } catch (error: any) {
    console.log(error);
    onErrorCallback?.();
  }
};