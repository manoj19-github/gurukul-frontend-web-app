import { restClient } from "./rest";

export const AddAttachmentAction = async ({
  values,
  courseId,
  onSuccess,
  onError,
}: {
  values: any;
  courseId: string;
  onSuccess: any;
  onError: any;
}) => {
  try {
    console.log("hit ");
    const response = await restClient.post(
      `/api/courses/${courseId}/attachement`,
      values
    );
    onSuccess?.(response);
  } catch (error: any) {
    onError?.();
  }
};

export const deleteAttachmentAction = async ({
  attachmentId,
  onSuccess,
  onError,
  courseId,
}: {
  attachmentId: string;
  onSuccess: any;
  onError: any;
  courseId: string;
}) => {
  try {
    const response = await restClient.delete(
      `/api/courses/${courseId}/attachement/${attachmentId}`
    );
    onSuccess?.(response);
  } catch (error) {
    console.log("error: ", error);
    onError?.();
  }
};
