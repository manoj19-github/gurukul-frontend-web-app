import { auth } from "@clerk/nextjs";
import { dbConfig } from "@/lib/db";
import React, { FC } from "react";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import { LayoutDashboard } from "lucide-react";
import TitleForm from "./_components/TitleForm";

interface CourseIdPageProps {
  params: { courseId: string };
}
const CourseIdPage: FC<CourseIdPageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const course = await dbConfig.course.findUnique({
    where: { id: params.courseId, userId },
  });
  if (!course) return redirect("/");
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course setup
            <span className="text-sm ml-3 text-slate-700">
              Complete all fields {completionText}
            </span>
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 ">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} size="sm" />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
