import { z } from "zod";

// Comment Validation Schema
const commentValidationSchema = z.object({
  comment: z.string().trim().min(1, "Comment is required"),
  commentatorId: z.string().min(1, "Commentator ID is required"), // String for ObjectId
  isDeleted: z.boolean().default(false),
});

// Post Validation Schema
const createPostValidationSchema = z.object({
  body: z.object({
    authorId: z.string().min(1, "Author ID is required"), // String for ObjectId
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    // images: z.array(z.string().url()).optional().default([]),
    images: z.string().url("Invalid URL").optional().default(""),
    category: z.enum(["Vegetables", "Flowers", "Landscaping", "Indoor Plants"]),
    comments: z.array(commentValidationSchema).optional().default([]),
    isPremium: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    authorId: z.string().min(1, "Author ID is required").optional(), // String for ObjectId
    title: z.string().trim().min(1, "Title is required").optional(),
    description: z.string().trim().min(1, "Description is required").optional(),
    // images: z.array(z.string().url()).optional().default([]),
    images: z.string().url().optional().default(""),
    category: z
      .enum(["Vegetables", "Flowers", "Landscaping", "Indoor Plants"])
      .optional(),
    upVoteNumber: z.number().nonnegative().default(0).optional(),
    downVoteNumber: z.number().nonnegative().default(0).optional(),
    comments: z.array(commentValidationSchema).optional().default([]),
    isPremium: z.boolean().default(false).optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export { createPostValidationSchema, updatePostValidationSchema };
