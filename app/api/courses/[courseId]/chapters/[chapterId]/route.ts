import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { normalizeRouteRegex } from "next/dist/lib/load-custom-routes";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();
    if (!userId)
      return new NextResponse("Authorization error  ", { status: 403 });
    const ownCourse = await dbConfig.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse)
      return new NextResponse("unauthorization error : ", { status: 401 });
    if (values?.courseId) delete values.courseId;
    if (values?.chapterId) delete values.chapterId;
    const updatedChapter = await dbConfig.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error ", { status: 500 });
  }
}
