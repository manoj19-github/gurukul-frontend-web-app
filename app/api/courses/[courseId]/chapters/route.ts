import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId)
      return new NextResponse("authorization error ", { status: 403 });
    const { title } = await req.json();
    const isOwner = await dbConfig.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!isOwner) return new NextResponse("Unauthorized", { status: 401 });
    const lastChapter = await dbConfig.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const newChapter = await dbConfig.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });
    return NextResponse.json({ chapter: newChapter }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal errors ", { status: 500 });
  }
}
