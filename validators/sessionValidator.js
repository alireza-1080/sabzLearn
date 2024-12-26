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
        .boolean()
        .required(),
    course: Joi
        .string()
        .required()
        .trim()
        .min(3)
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
}).strict();

sessionValidator.options({ abortEarly: false });

export default sessionValidator;