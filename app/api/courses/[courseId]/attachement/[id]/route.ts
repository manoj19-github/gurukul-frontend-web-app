import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("unauthorized", { status: 403 });
    const isCourseOwner = await dbConfig.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!isCourseOwner)
      return new NextResponse("course not found", { status: 400 });
    const attachment = await dbConfig.attachement.delete({
      where: {
        courseId: params.courseId,
        id: params.id,
      },
    });
    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
