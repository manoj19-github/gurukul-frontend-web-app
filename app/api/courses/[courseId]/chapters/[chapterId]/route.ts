import { dbConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { normalizeRouteRegex } from "next/dist/lib/load-custom-routes";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { utAPI } from "@/app/api/uploadthing/core";

const MuxInstance = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
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
    const isChapterExists = await dbConfig.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if (!isChapterExists)
      return new NextResponse("Chapter not found ", { status: 401 });
    if (isChapterExists.videoUrl) {
      const existingMuxData = await dbConfig.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      console.log({ existingMuxData });
      if (existingMuxData) {
        await Promise.all([
          MuxInstance.video.assets.delete(existingMuxData.assetId),
          dbConfig.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          }),
        ]);
      }
    }

    const deleteChapter = await dbConfig.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    if (!!isChapterExists.videoUrl) {
      const videoUrl = isChapterExists.videoUrl.substring(
        isChapterExists.videoUrl.lastIndexOf("/") + 1
      );
      console.log("videoUrl: ", videoUrl);
      await utAPI.deleteFiles(videoUrl);
    }

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
    return NextResponse.json(deleteChapter, { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return new NextResponse("Internal error ", { status: 500 });
  }
}

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

    const ownChapter = await dbConfig.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if (!ownCourse || !ownChapter)
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
    // delete existing video from uploadthing file server if  new video is adding when already this chapter has a video
    if (!!values.videoUrl && !!ownChapter.videoUrl) {
      const videoUrl = ownChapter.videoUrl.substring(
        ownChapter.videoUrl.lastIndexOf("/") + 1
      );
      console.log("videoUrl: ", videoUrl);
      await utAPI.deleteFiles(videoUrl);
    }
    if (
      !values.videoUrl ||
      values.videoUrl === "" ||
      values.videoUrl?.trim() === ""
    )
      return NextResponse.json(updatedChapter, { status: 200 });
    const existingMuxData = await dbConfig.muxData.findFirst({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (!!existingMuxData) {
      await Promise.all([
        MuxInstance.video.assets.delete(existingMuxData.assetId),
        dbConfig.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        }),
      ]);
    }
    const asset = await MuxInstance.video.assets.create({
      input: values.videoUrl,
      playback_policy: ["public"],
      test: false,
    });
    await dbConfig.muxData.create({
      data: {
        chapterId: params.chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
      },
    });
    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error ", { status: 500 });
  }
}
