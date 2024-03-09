import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized : ", { status: 401 });
    const { list } = await req.json();
    const ownCourse = await dbConfig.course.findUnique({
      where: { id: params.courseId, userId },
    });
    console.log("list rener: ", list);
    if (!Array.isArray(list))
      return new NextResponse("user input wrong  : ", { status: 400 });
    await Promise.all(
      list.map(async (self, index) => {
        return await dbConfig.chapter.update({
          where: {
            id: self.id,
          },
          data: {
            position: index + 1,
          },
        });
      })
    );
    return NextResponse.json(
      { message: "successfully reordered" },
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Internal error  : ", { status: 500 });
  }
}
