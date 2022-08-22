import Joi from "joi";

export const categorySchema = Joi.object({
    id: Joi.number().greater(0),
    name: Joi.string().min(8).max(32).required(),
    description: Joi.string().min(8).max(64).required(),
});