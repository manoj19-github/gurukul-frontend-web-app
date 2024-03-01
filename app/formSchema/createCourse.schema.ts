import * as z from "zod";

export const CrateCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});
export const CrateCourseDescriptionSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

// export const createTitleForCourseSchema=z.object({
//   title:
// })