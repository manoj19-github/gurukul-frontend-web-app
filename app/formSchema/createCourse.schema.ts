import * as z from "zod";

export const CrateCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});
export const CrateCourseDescriptionSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});
export const CrateImageSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export const createCategorySchema = z.object({
  categoryId: z.string().min(1),
});
export const createPriceSchema = z.object({
  price: z.coerce.number().min(0),
});

export const createAttachmentSchema = z.object({
  url: z.string().min(1),
});

export const chaptersFormSchema = z.object({
  title: z.string().min(1, "title is required"),
});

export const chapterAccessFormSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterVideoFormSchema = z.object({
  videoUrl: z.string().min(1),
});


// export const createTitleForCourseSchema=z.object({
//   title:
// })