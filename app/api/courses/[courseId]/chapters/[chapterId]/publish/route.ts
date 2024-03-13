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
    const chapter = await dbConfig.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    const muxData = await dbConfig.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });
    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    )
      return new NextResponse("Missing required fields : ", { status: 401 });
    const publishedChapter = await dbConfig.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedChapter, { status: 200 });
  } catch (error) {
    console.log(`error occured : `, error);
    return new NextResponse(`error occured server error : `, { status: 500 });
  }
}
