import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();
    if (!userId) return new NextResponse("Unauthorized : ", { status: 403 });
    const courseOwner = await dbConfig.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner)
      return new NextResponse("Unauthorized  ", { status: 401 });
    const attachment = await dbConfig.attachement.create({
      data: { url, name: url.split("/").pop(), courseId: params.courseId },
    });
    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Server internal error : ", { status: 500 });
  }
}
