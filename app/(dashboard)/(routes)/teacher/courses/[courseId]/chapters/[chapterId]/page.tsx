import { getChapterDetails } from "@/app/services/getCourseDetails";
import { IconBadge } from "@/components/IconBadge";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FC, Fragment } from "react";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescription from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import Banner from "@/components/Banner";
import ChapterActions from "./_components/ChapterActions";

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
  const isChapterCompleted = requiredFields.every(Boolean);

  return (
    <Fragment>
      {!chapterDetails.isPublished ? (
        <Banner
          variant={"warning"}
          label="This chapter is unpublished. It will not be visible in the course"
        />
      ) : (
        <></>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex gap-x-3 items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full mt-2 ">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isChapterCompleted}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapterDetails.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapterDetails}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescription
                initialData={chapterDetails}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Setttings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapterDetails}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a Video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapterDetails}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ChapterByIdPage;
