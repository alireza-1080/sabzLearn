import Joi from "joi";

const courseValidator = Joi.object({
    title: Joi
        .string()
        .required()
        .trim()
        .min(3)
        .messages({
            "string.base": "Title must be a string",
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
        }),
    description: Joi
        .string()
        .required()
        .trim()
        .min(10)
        .messages({
            "string.base": "Description must be a string",
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters",
        }),
    cover: Joi
        .string()
        .required()
        .trim()
        .messages({
            "string.base": "Cover must be a string",
            "string.empty": "Cover is required",
        }),
    duration: Joi
        .string()
        .required()
        .trim()
        .messages({
            "string.base": "Duration must be a string",
            "string.empty": "Duration is required",
        }),
    support: Joi
        .string()
        .required()
        .trim()
        .valid("telegram", "website")
        .messages({
            "string.base": "Support must be a string",
            "string.empty": "Support is required",
            "any.only": "Support must be either telegram or website",
        }),
    price: Joi
        .number()
        .required()
        .min(0)
        .messages({
            "number.base": "Price must be a number",
            "number.empty": "Price is required",
            "number.min": "Price must be a positive number",
        }),
    href: Joi
        .string()
        .required()
        .trim()
        .messages({
            "string.base": "Href must be a string",
            "string.empty": "Href is required",
        }),
    status: Joi
        .string()
        .required()
        .valid("completed", "recording", "pre-sale")
        .messages({
            "string.base": "Status must be a string",
            "string.empty": "Status is required",
            "any.only": "Status must be one of completed, recording, or pre-sale",
        }),
    discount: Joi
        .number()
        .required()
        .min(0)
        .max(100)
        .messages({
            "number.base": "Discount must be a number",
            "number.empty": "Discount is required",
            "number.min": "Discount must be a positive number",
            "number.max": "Discount cannot exceed 100",
        }),
    category: Joi
        .string()
        .required()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.base": "Category must be a string",
            "string.empty": "Category is required",
            "string.pattern.base": "Category is not valid",
        }),
    instructor: Joi
        .string()
        .required()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.base": "Instructor must be a string",
            "string.empty": "Instructor is required",
            "string.pattern.base": "Instructor is not valid",
        }),
}).strict();


export default courseValidator;