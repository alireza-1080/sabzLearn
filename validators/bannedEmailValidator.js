import Joi from "joi";

const bannedEmailValidator = Joi.object({
    email: Joi
        .string()
        .required()
        .trim()
        .min(8)
        .email()
        .messages({
            'string.email': 'Email must be a valid email address',
            'string.min': 'Email should have a minimum length of 8 characters',
            'any.required': 'Email is a required field'
        }),
}).strict();

bannedEmailValidator.options({ abortEarly: false });

export default bannedEmailValidator;