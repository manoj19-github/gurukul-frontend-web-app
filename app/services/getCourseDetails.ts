import { dbConfig } from "@/lib/db";

export const getCourseDetailsService = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  try {
    return await dbConfig.course.findUnique({
      where: { id, userId },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachements: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.log("error: ", error);
  }
};


export const getChapterDetails = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    return await dbConfig.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: true,
      },
    });
  } catch (error) {
    console.log("error : ", error);
  }
};