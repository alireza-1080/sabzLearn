import joi from "joi";

const contactUsValidator = joi.object({
    name: joi
        .string()
        .required()
        .trim()
        .min(3),
    email: joi
        .string()
        .required()
        .trim()
        .min(8)
        .email(),
    message: joi
        .string()
        .required()
        .trim()
        .min(10),
    phone: joi
        .string()
        .required()
        .trim()
        .min(10)
        .max(10),
}).strict();

export default contactUsValidator;