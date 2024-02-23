import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    if (!userId || !title)
      return new NextResponse("Unauthorized", { status: 401 });
    const course = await dbConfig.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("error : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
