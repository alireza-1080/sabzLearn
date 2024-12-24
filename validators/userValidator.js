import Joi from "joi";

const userValidator = Joi.object({
    firstName: Joi
        .string()
        .required()
        .trim()
        .min(3),
    lastName: Joi
        .string()
        .required()
        .trim()
        .min(3),
    username: Joi
        .string()
        .required()
        .trim()
        .min(3),
    email: Joi
        .string()
        .required()
        .trim()
        .min(8)
        .email(),
    phone: Joi
        .string()
        .required()
        .trim()
        .min(10)
        .max(10),
    password: Joi
        .string()
        .required()
        .trim()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .messages({
            'string.pattern.base': 'Password must have at least one lowercase letter, one uppercase letter, one number, and one special character',
            'string.min': 'Password should have a minimum length of 8 characters',
            'any.required': 'Password is a required field'
        }),
    confirmPassword: Joi
        .string()
        .required()
        .valid(Joi.ref('password'))
        .messages({ 'any.only': 'Passwords do not match' }),
    role: Joi
        .string()
        .valid("USER", "ADMIN")
        .default("USER"),
}).strict();

userValidator.options({ abortEarly: false });

export default userValidator;