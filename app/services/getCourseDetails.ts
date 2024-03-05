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
