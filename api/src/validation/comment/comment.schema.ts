import Joi from "joi";

export const commentSchema = Joi.object({
    id: Joi.number().greater(0),
    content: Joi.string().required(),
    articleId: Joi.number().required(),
});