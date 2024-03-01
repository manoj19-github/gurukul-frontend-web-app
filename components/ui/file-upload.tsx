"use client";

import { UploadDropzone } from "@/lib/UploadThing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { FC, Fragment } from "react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload: FC<FileUploadProps> = ({
  onChange,
  endpoint,
}): JSX.Element => {
  return (
    <Fragment>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            console.log("res: ", res);
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error.message}`);
        }}
      />
    </Fragment>
  );
};
