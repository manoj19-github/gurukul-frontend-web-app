import { dbConfig } from "@/lib/db";

export const getCategoriesData = async () => {
  try {
    return await dbConfig.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.log("error : ", error);
    throw new Error(String(error));
  }
};
