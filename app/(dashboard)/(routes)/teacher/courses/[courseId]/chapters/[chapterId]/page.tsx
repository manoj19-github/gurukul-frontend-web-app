import { getChapterDetails } from "@/app/services/getCourseDetails";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface ChapterByIdPageProps {
  params: { courseId: string; chapterId: string };
}
const ChapterByIdPage: FC<ChapterByIdPageProps> = async ({
  params,
}): Promise<JSX.Element> => {
  console.log("params : ", params);
  const { userId } = auth();
  if (!userId) return redirect("/");
  const chapterDetails = await getChapterDetails(params);
  if (!chapterDetails) return redirect("/");

  const requiredFields = [
    chapterDetails.title,
    chapterDetails.description,
    chapterDetails.videoUrl,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-5">
      <div className="flex items-cenjter justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex gap-x-3 items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to course setup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChapterByIdPage;
