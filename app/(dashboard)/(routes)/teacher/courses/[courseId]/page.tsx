import { auth } from "@clerk/nextjs";
import { dbConfig } from "@/lib/db";
import React, { FC } from "react";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import {
  BadgeIndianRupee,
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
} from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import { getCategoriesData } from "@/app/services/getMasterData.service";
import CategoriesForm from "./_components/CategoriesForm";
import PriceForm from "./_components/PriceForm";
import AttachmentsForm from "./_components/Attachments";

interface CourseIdPageProps {
  params: { courseId: string };
}
const CourseIdPage: FC<CourseIdPageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const course = await dbConfig.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      attachements: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
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
  const categoriesData = await getCategoriesData();
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
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoriesForm
            initialData={course}
            courseId={course.id}
            options={categoriesData}
          />
        </div>
        <div className="space-y-6 ">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapter</h2>
            </div>
            <div>todo :</div>
          </div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={BadgeIndianRupee} />
            <h2 className="text-xl">Sell your course</h2>
          </div>
          <PriceForm initialData={course} courseId={course.id} />

          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">Resources & Attachments</h2>
          </div>
          <AttachmentsForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
