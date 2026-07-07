import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }).min(3, "Title must be at least 3 characters"),
    description: z.string({ required_error: "Description is required" }).min(10, "Description must be at least 10 characters"),
    category: z.string().optional(),
    budget: z.number({ required_error: "Budget is required" }).positive("Budget must be a positive number"),
  }),
});
