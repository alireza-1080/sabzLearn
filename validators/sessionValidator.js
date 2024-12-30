import Joi from "joi";

const sessionValidator = Joi.object({
    title: Joi
        .string()
        .required()
        .trim()
        .min(3),
    time: Joi
        .string()
        .required()
        .trim()
        .min(3),
    video: Joi
        .string()
        .required()
        .trim()
        .min(3),
    isItFree: Joi
        .boolean(),
    course: Joi
        .string()
        .required()
        .trim()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    instructor: Joi
        .string()
        .required()
        .trim()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
}).strict();

sessionValidator.options({ abortEarly: false });

export default sessionValidator;