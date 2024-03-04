"use client";
import React, { FC, Fragment, useState } from "react";
import { FaTrash } from "react-icons/fa";
import * as z from "zod";
import { createAttachmentSchema } from "@/app/formSchema/createCourse.schema";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Pencil, PlusCircle, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Attachement, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";

import {
  AddAttachmentAction,
  deleteAttachmentAction,
} from "@/app/services/attachmentForCourse";
import { File } from "lucide-react";
import AttachmentDeleteConfirmation from "./AttachmentDeleteConfirmation";
interface AttachmentsFormProps {
  initialData: Course & { attachements: Attachement[] };
  courseId: string;
}
const AttachmentsForm: FC<AttachmentsFormProps> = ({
  initialData,
  courseId,
}): JSX.Element => {
  const router = useRouter();
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const successCallback = () => {
    toast.success("Course Description updated");
    router.refresh();
    setIsEditing(false);
  };
  const errorCallback = () => {
    toast.error("Something went wrong");
  };
  const onSubmit = async (values: z.infer<typeof createAttachmentSchema>) => {
    AddAttachmentAction({
      values,
      courseId,
      onSuccess: successCallback,
      onError: errorCallback,
    });
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleImage = (url: any) => {
    console.log("url: ", url);
    if (url) {
      onSubmit({ url });
    }
  };
  const onDeleteRequest = (deletingId: string) => {
    setDeletingId(deletingId);
    setOpenDeleteConfirmation(true);
  };
  const onCancelDeleteAction = () => {
    setDeletingId("");
    setOpenDeleteConfirmation(false);
  };
  const onSuccessDeleteAction = () => {
    setDeletingId("");
    router.refresh();
    setOpenDeleteConfirmation(false);
    toast.success("Attachment deleted successfully");
  };
  const onErrorDeleteAction = () => {
    setDeletingId("");
    setOpenDeleteConfirmation(false);
    toast.error("Something went wrong");
  };

  const onDeleteAction = () => {
    if (!deletingId) return toast.error("something went wrong");
    deleteAttachmentAction({
      courseId,
      attachmentId: deletingId,
      onSuccess: onSuccessDeleteAction,
      onError: onErrorDeleteAction,
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <AttachmentDeleteConfirmation
        open={openDeleteConfirmation}
        onOpenChange={() => (
          setOpenDeleteConfirmation(false), setDeletingId("")
        )}
        confirmAction={onDeleteAction}
        cancelAction={onCancelDeleteAction}
      />
      <div className="font-medium flex items-center justify-between">
        Course Attachments
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

      {!isEditing && initialData.attachements.length === 0 ? (
        <p className="text-sm mt-2 text-slate-500 italic">
          No attachment found
        </p>
      ) : (
        // <>
        //   <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
        //     <ImageIcon className="h-10 w-10 text-slate-500" />
        //   </div>
        // </>

        <></>
      )}
      {initialData.attachements.length > 0 && !isEditing ? (
        <div className="space-y-2">
          {initialData.attachements.map((self, index) => (
            <div
              key={index}
              className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md"
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs line-clamp-1">{self.name}</p>
              {deletingId === self.id ? (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                </div>
              ) : (
                <button className="ml-auto hover:opacity-75">
                  <FaTrash
                    className="h-4 w-4 text-rose-500"
                    onClick={() => onDeleteRequest(self.id)}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {!!isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(file: any) => handleImage(file)}
          />
          <div className="text-xs text muted-foreground mt-4">
            Add anything your students might need to complete the course.
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

export default AttachmentsForm;
