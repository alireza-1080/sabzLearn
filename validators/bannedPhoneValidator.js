import joi from "joi";

const bannedPhoneValidator = joi.object({
    phone: joi
        .string()
        .required()
        .trim()
        .min(10)
        .max(10)
        .messages({
            'string.min': 'Phone number should have a minimum length of 10 characters',
            'string.max': 'Phone number should have a maximum length of 10 characters',
            'any.required': 'Phone number is a required field'
        }),
}).strict();

bannedPhoneValidator.options({ abortEarly: false });

export default bannedPhoneValidator;