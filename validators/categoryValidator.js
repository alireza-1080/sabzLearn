import Joi from "joi";

const categoryValidator = Joi.object({
    title: Joi
        .string()
        .required()
        .trim()
        .min(3),
    href: Joi
        .string()
        .required()
        .trim()
        .min(3),
}).strict();

categoryValidator.options({ abortEarly: false });

export default categoryValidator;