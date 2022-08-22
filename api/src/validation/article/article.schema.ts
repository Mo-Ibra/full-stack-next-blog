import Joi from "joi";

export const articleSchema = Joi.object({
    id: Joi.number().greater(0),
    slug: Joi.string().min(8).max(32).required(),
    title: Joi.string().min(8).max(58).required(), // min(54) max(58) SEO.
    description: Joi.string().min(8).max(64).required(),
    content: Joi.string().min(8).required(),
    categoryId: Joi.number().required(),
});