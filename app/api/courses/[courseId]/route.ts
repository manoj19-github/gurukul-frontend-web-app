import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    const { courseId } = params;
    const values = await req.json();
    const course = await dbConfig.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: { ...values },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log({ error });
    return new NextResponse("internal Error", { status: 500 });
  }
}
