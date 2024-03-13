import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    const ownCourse = await dbConfig.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse)
      return new NextResponse("Coruse not available", { status: 401 });

    const unPublishedChapter = await dbConfig.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedChaptersInCourse = await dbConfig.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!publishedChaptersInCourse.length) {
      await dbConfig.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unPublishedChapter, { status: 200 });
  } catch (error) {
    console.log(`error occured : `, error);
    return new NextResponse(`error occured server error : `, { status: 500 });
  }
}
