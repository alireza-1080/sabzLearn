import Joi from "joi";

const courseValidator = Joi.object({
    title: Joi
        .string()
        .required()
        .trim()
        .min(3),
    description: Joi
        .string()
        .required()
        .trim()
        .min(10),
    cover: Joi
        .string()
        .required()
        .trim(),
    duration: Joi
        .string()
        .required()
        .trim(),
    support: Joi
        .string()
        .required()
        .trim()
        .valid("telegram", "website"),
    price: Joi
        .number()
        .required()
        .min(0),
    href: Joi
        .string()
        .required()
        .trim(),
    status: Joi
        .string()
        .required()
        .valid("completed", "recording", "pre-sale"),
    discount: Joi
        .number()
        .required()
        .min(0)
        .max(100),
    category: Joi
        .string()
        .required()
        .trim(),
    instructor: Joi
        .string()
        .required()
        .trim(),
}).strict();

courseValidator.options({ abortEarly: false });

export default courseValidator;